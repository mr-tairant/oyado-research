# OYADO — Japan stay journal

Astro / TypeScript static MVP. Python is used for optional permission-gated HTML snapshots. No database. No external calls or paid usage in demo mode.

## Start

Node 22.12+ (or Node 24) and npm required. Python 3.11+ only for optional collection.

```sh
npm install
npm run discover -- --count 5 --seed 42
npm run collect
npm run generate
npm run validate
npm test
npm run typecheck
npm run dev
npm run build
```

Generated demo data and articles are committed, so `npm install && npm run dev` works immediately. Open the local address printed by Astro. All five fictional samples are labeled, `noindex`, excluded from sitemap, and never attributed to actual properties. Production mode refuses to build without approved live guides and a real SITE_URL.

See [operations](docs/operations.md), [Cloudflare setup](docs/cloudflare-pages.md), and [URL report](docs/discovery-report.md).

The paid-generation adapter follows the [official OpenAI Responses text-generation guide](https://developers.openai.com/api/docs/guides/text). Its network path is intentionally unexecuted in the demo. Optional collectors are `scripts/collect_allowed.py`, `scripts/extract.py` and `scripts/screenshot_allowed.py`; see operations before granting any URL permissions.
