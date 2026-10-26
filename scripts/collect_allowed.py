"""Explicitly authorized public HTML collection; no crawling or browser bypass."""
import argparse
import datetime
import hashlib
import json
from pathlib import Path
import urllib.request
import urllib.robotparser
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
AGENT = 'OyadoResearch/0.1'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('url')
    args = parser.parse_args()
    url = args.url
    parsed = urlparse(url)
    if parsed.scheme != 'https' or parsed.username or parsed.password:
        raise SystemExit('Only public HTTPS URLs are supported')
    permissions = json.loads((ROOT / 'data/permissions.json').read_text())
    permission = next((p for p in permissions if p.get('url') == url and p.get('fetch_allowed') is True and p.get('permission_basis')), None)
    if not permission:
        raise SystemExit('No recorded permission for this exact URL; skipped')
    robots = urllib.robotparser.RobotFileParser(f'https://{parsed.netloc}/robots.txt')
    robots.read()
    if not robots.can_fetch(AGENT, url):
        raise SystemExit('robots.txt denies access or could not be evaluated')
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            raise RuntimeError('Redirect requires separate permission review')
    request = urllib.request.Request(url, headers={'User-Agent': AGENT})
    with urllib.request.build_opener(NoRedirect).open(request, timeout=20) as response:
        if response.status != 200 or 'text/html' not in response.headers.get('Content-Type', ''):
            raise SystemExit('Expected public HTML 200')
        body = response.read(2_000_001)
        if len(body) > 2_000_000:
            raise SystemExit('Response too large')
    at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    key = hashlib.sha256((url + at).encode()).hexdigest()[:20]
    directory = ROOT / 'data/snapshots/private'
    directory.mkdir(parents=True, exist_ok=True)
    (directory / f'{key}.html').write_bytes(body)
    record = {'source_url': url, 'retrieved_at': at, 'permission_basis': permission['permission_basis'], 'sha256': hashlib.sha256(body).hexdigest(), 'verification_status': 'unverified', 'confidence': 0}
    (directory / f'{key}.json').write_text(json.dumps(record, indent=2))
    print(json.dumps(record))

if __name__ == '__main__':
    main()
