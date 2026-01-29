# Live Data Cache

This folder stores static JSON snapshots for GitHub Pages. It is **generated** by `scripts/publish_live_data.py`.

- Each series is saved to `data/live/<series_id>.json`
- A `data/live/manifest.json` is written with timestamps and status

Commit this folder to GitHub so Pages can serve the latest data.
