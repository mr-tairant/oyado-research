"""Optional Playwright screenshots for exact URLs with recorded permission."""
import argparse
import datetime
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('url')
    args = parser.parse_args()
    permissions = json.loads((ROOT / 'data/permissions.json').read_text())
    permitted = {p['url'] for p in permissions if p.get('screenshot_allowed') is True and p.get('permission_basis')}
    if args.url not in permitted or urlparse(args.url).scheme != 'https':
        raise SystemExit('No exact screenshot permission; skipped before browser launch')
    for url in permitted:
        parsed = urlparse(url)
        robots = RobotFileParser(f'https://{parsed.netloc}/robots.txt')
        robots.read()
        if not robots.can_fetch('OyadoResearch', url):
            raise SystemExit('robots.txt permission unavailable')
    from playwright.sync_api import sync_playwright
    output = ROOT / 'data/snapshots/private'
    output.mkdir(parents=True, exist_ok=True)
    key = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context(user_agent='OyadoResearch/0.1', service_workers='block')
        # Every network resource, including scripts/images/redirects, needs explicit permission.
        context.route('**/*', lambda route: route.continue_() if route.request.url in permitted else route.abort())
        page = context.new_page()
        response = page.goto(args.url, wait_until='domcontentloaded', timeout=20000)
        if not response or response.status != 200 or page.url != args.url:
            raise SystemExit('Non-200 or redirect; screenshot skipped')
        page.screenshot(path=str(output / f'{key}.png'), full_page=True)
        browser.close()
    (output / f'{key}-screenshot.json').write_text(json.dumps({'source_url': args.url, 'retrieved_at': key, 'internal_only': True}))

if __name__ == '__main__':
    main()
