# Hormuz Dashboard — CLAUDE.md

## Project Overview

Single-page React dashboard tracking maritime vessel traffic, oil flows, and LNG throughput through the Strait of Hormuz (Jan 2023–Mar 2026). Visualizes geopolitical impacts across five eras using historical data, live Brent crude pricing, and real-time AIS vessel tracking.

**Live site:** https://gridworks.github.io/hormuz-dashboard/

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 (functional components + hooks) |
| Build tool | Vite 7 |
| Map | Leaflet 1.9.4 + react-leaflet 5 |
| Backend (local AIS only) | Node.js + Express 4 + ws (WebSocket) |
| Deployment | GitHub Actions → GitHub Pages |
| Fonts | Google Fonts: Space Mono (data), Space Grotesk (headings) |
| Styling | Inline styles throughout — no CSS modules, no styled-components |

---

## Running the Project

```bash
# Install dependencies
npm install

# Start frontend dev server (http://localhost:5173)
npm run dev

# Start local AIS WebSocket backend (ws://localhost:4000/ais) — separate terminal
npm run server

# Production build (outputs to /dist)
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

**Note:** The AIS live map requires the local backend (`npm run server`) running with a valid `AISSTREAM_API_KEY`. Without it, the map shows an "offline" indicator gracefully.

---

## Environment Variables

Create a `.env` file in the root (already gitignored):

```
VITE_EIA_API_KEY=        # Optional: EIA API key for live Brent price + 52-week history
VITE_AIS_LOCAL_WS_URL=ws://localhost:4000/ais   # Default WS endpoint for local AIS
AISSTREAM_API_KEY=       # Backend-only: AIStream.io key for raw AIS feed
PORT=4000                # Backend server port (default 4000)
```

`VITE_EIA_API_KEY` is also injected as a GitHub Actions secret for the GitHub Pages deploy.

---

## Project Structure

```
hormuz-dashboard/
├── .github/workflows/deploy.yml   # CI/CD: push to main → GitHub Pages deploy
├── server/
│   └── index.js                   # Express + WebSocket AIS proxy backend
├── src/
│   ├── main.jsx                   # React entry point (React 19 createRoot)
│   ├── App.jsx                    # Entire frontend (~900 lines, monolithic)
│   ├── HormuzLiveMap.jsx          # Leaflet map with live AIS vessel markers
│   ├── App.css                    # Minimal boilerplate (mostly unused)
│   └── index.css                  # Global dark theme, fonts, button styles
├── index.html                     # HTML shell
├── vite.config.js                 # Vite config; base: '/hormuz-dashboard/'
├── package.json
└── .env                           # API keys (not committed)
```

---

## Architecture & Conventions

### Data Model

All historical data lives as constants at the top of `App.jsx`:

- **`MONTHS`** — 39-entry array (Jan 2023–Mar 2026), each with: `transits`, `oil`, `lng`, `dwt`, `era`, `source` (EIA/EST/AIS), plus geopolitical notes
- **`ERAS`** — 5 color-coded geopolitical states: normal (green) → tension (yellow) → escalation (orange) → conflict (red) → blockade (magenta)
- **`VESSEL_TYPES`**, **`FLAGS`**, **`CARGO`**, **`PRODUCERS`**, **`DESTINATIONS`** — supporting lookup tables

### Data Scaling

All metrics are scaled proportionally from the selected timeline month:
```js
const ratio = selectedMonth.transits / MONTHS[0].transits;
// Applied to all displayed values
```

### Live Data Hooks

- **`useLiveBrent()`** — Fetches Brent crude from EIA API, falls back to Stooq (via allorigins proxy), falls back to static `$74.2`. Refreshes every 5 minutes.
- **`useBrentHistory()`** — Fetches 52-week EIA Brent series (requires `VITE_EIA_API_KEY`).

### Component Structure

Everything lives in `App.jsx` — no component file splitting. Internal components:
- `<Bar>` — horizontal progress bar
- `<Ticker>` — animated number with units
- `<Donut>` — custom inline SVG donut chart
- `<Spark>` / `<BrentSpark>` — sparkline SVG charts
- `<Timeline>` — monthly slider with era coloring + KPI sparklines
- `<LiveBrentPanel>` — live price display with status indicator
- `<DataQualityBanner>` — EIA Verified / Modeled Estimate / AIS Tracked badge

Tabs: Overview | Fleet | Cargo | Origins & Destinations

### Styling Conventions

- **All styles are inline** — no external CSS classes for layout/theming
- Dark background: `#0a0f1a`, primary text: `#dde4f0`
- Space Mono for data/numbers, Space Grotesk for headings/labels
- Era colors drive accent colors throughout the UI
- Opacity used for secondary/disabled states
- Blink animation (`animation: "blink 2s infinite"`) for status indicators — defined as a global CSS keyframe

### AIS Map (`HormuzLiveMap.jsx`)

- Connects to `ws://localhost:4000/ais` (or `VITE_AIS_LOCAL_WS_URL`)
- Map centered on Persian Gulf at `[26.5, 52.5]`, zoom 8
- Vessel markers: pink/magenta circles (`#ff79c6`)
- Shows vessel name, MMSI, SOG, COG, nav status in tooltip
- Displays "AIS offline" indicator if WebSocket unreachable

### Backend (`server/index.js`)

- Proxies AIStream.io WebSocket (`wss://stream.aisstream.io/v0/stream`)
- Bounding box: Persian Gulf (23.0–30.5°N, 48.0–58.0°E)
- Filters inland noise (Dubai, Qatar, Bahrain areas)
- Normalizes raw AIS → `{ mmsi, lat, lon, sog, cog, name, navStatus }`
- Broadcasts to all connected frontend clients
- Auto-reconnects upstream if clients remain connected
- Health endpoint: `GET /health`

---

## Deployment

Push to `main` → GitHub Actions runs:
1. `npm ci`
2. `npm run build` (with `VITE_EIA_API_KEY` secret injected)
3. Deploys `/dist` to GitHub Pages

Vite base path is `/hormuz-dashboard/` — required for GitHub Pages subdirectory hosting. Do not change this without also updating `deploy.yml`.

---

## Key Gotchas

- **Monolithic `App.jsx`** — all UI logic, data, and components are in one ~900-line file. Don't split without a clear plan.
- **No state management library** — state is local `useState` + custom hooks only. Props are passed directly.
- **Inline styles everywhere** — adding CSS classes won't work unless you also add matching rules to `index.css` or `App.css`.
- **AIS data is local-only** — the live map only works when `npm run server` is running locally. GitHub Pages shows the map in offline/demo mode.
- **Brent price fallback chain** — EIA → Stooq (via allorigins) → static `$74.2`. If adding a new data source, insert before the static fallback.
- **Vite base path** — `vite.config.js` sets `base: '/hormuz-dashboard/'`. Asset paths in `index.html` must be relative, not absolute.
- **React 19** — uses `createRoot`, no legacy ReactDOM.render.
