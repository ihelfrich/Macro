# Macro — Live Macro Signal Room

A single‑page, live macroeconomics dashboard designed to answer real questions fast. It pulls time‑series data from your APIs, computes macro signals, and renders narrative answers plus visualizations.

## What’s here
- **index.html** — main page
- **styles.css** — design system + layout + motion
- **app.js** — data fetching, normalization, analytics, and charting
- **data/sources.js** — define your data endpoints and what each series means
- **data/mock.js** — fallback demo data so the UI still works without APIs
- **assets/** — optional portrait and media assets

## Quick start (local)
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

## Connect your APIs (no secrets committed)
1. Open the page.
2. Click **Connect APIs** (top right).
3. Enter:
   - **Base URL** (e.g., `https://api.yourdomain.com`)
   - **API Key** (optional)
   - **Headers JSON** (optional; e.g., `{ "X-Client": "macro-room" }`)
4. Save. The values live in your browser’s localStorage.

**Important:** If your APIs require secrets, keep them out of the repo. Use the connection drawer or a backend proxy.

## Customize Ian’s voice + portrait
1. Click **Edit voice + photo** in the hero.
2. Update name, tagline, and voice line.
3. Upload a portrait (stored locally in your browser).

## Macro Fundamentals Studio
Interactive labs for:
- Business cycle phases
- GDP components + transactions
- National accounts (value added / income / expenditure)
- Nominal vs real GDP + deflator
- Interest rate transmission
- Savings calculator
- Production function lab
- Long-run growth tracker (uses live GDP)

## Configure data sources
Edit `data/sources.js` to match your API paths and series IDs.

Each source expects a time series. The app normalizes common shapes like:
- `[ { date, value }, ... ]`
- `{ series: [ { date, value }, ... ] }`
- `{ data: [ { date, value }, ... ] }`
- FRED‑style `{ observations: [ { date, value } ] }`

If your API is different, add a `transform` function for that source in `data/sources.js`.

## Deploy to GitHub Pages
- Push this repo to GitHub (remote: `https://github.com/ihelfrich/Macro`)
- In GitHub, enable Pages and select the root.

## Next data hookup (tell me)
To wire your live feeds correctly, send:
- API base URL(s)
- Auth scheme (header name, token type)
- Example JSON responses for each series
- The “relevant questions” you want answered

I’ll then hard‑wire the transforms and logic.
