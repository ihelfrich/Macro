# Live Data Cache

This folder stores static JSON snapshots for GitHub Pages. It is **generated** by `scripts/publish_live_data.py`
and refreshed by GitHub Actions.

- Each series is saved to `data/live/<series_id>.json`
- A `data/live/manifest.json` is written with timestamps and status

GitHub Actions deploys these snapshots with the site so the frontend never exposes API keys.
