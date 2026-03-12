# Strait of Hormuz — Traffic Intelligence Dashboard

**Live dashboard → [gridworks.github.io/hormuz-dashboard](https://gridworks.github.io/hormuz-dashboard/)**

An interactive maritime intelligence dashboard tracking vessel traffic, oil flows, and LNG throughput through the Strait of Hormuz from January 2023 to today (March 2026).

---

## What it shows

The Strait of Hormuz is the world's most critical energy chokepoint — roughly 20% of global oil supply and 20% of LNG transits it daily. This dashboard tracks how that traffic has evolved across five distinct geopolitical eras:

| Era | Period |
|---|---|
| 🟢 Normal Operations | Jan 2023 – Oct 2023 |
| 🟡 Elevated Tension | Nov 2023 – Jan 2025 |
| 🟠 Active Escalation | Feb 2025 – May 2025 |
| 🔴 Conflict-Affected | Jun 2025 – Feb 2026 |
| 🟣 Effectively Closed | Mar 2026 |

### Four tabs of data

- **Overview** — strait geography, crude export share by producer (Saudi Arabia, Iraq, UAE, Iran, Kuwait, Qatar), and cargo destination breakdown by region
- **Fleet** — vessel type composition (VLCC, Suezmax, Aframax, LNG carriers, etc.), tanker size classes, and flag state registry
- **Cargo** — daily and annual flow estimates for crude oil, LNG, petroleum products, LPG, containers, fertilizer, metals, and food
- **Origins & Destinations** — major loading terminals (Ras Tanura, Ras Laffan, Kharg Island, Basra, Jebel Ali) and destination flows by country with dependency ratings

### Live data
- **Brent crude spot price** — fetched live from the EIA API (with key) or Yahoo Finance via CORS proxy (no key required), refreshing every 5 minutes
- **Timeline slider** — scrub through any month from Jan 2023 to today; all figures scale proportionally to the selected period

---

## Data sources

| Label | Source |
|---|---|
| ✓ EIA Verified | EIA World Oil Transit Chokepoints report, Vortexa tanker tracking. Annual anchors; monthly values interpolated. |
| ~ Modeled Estimate | Extrapolated from EIA H1-2025 baseline + geopolitical event timeline. Treat as directional. |
| 📡 AIS Tracked | CSIS/Starboard Maritime Intelligence, MarineTraffic AIS transponder data. |

Vessel counts and flag registry use Lloyd's List Intelligence / WorldwideAIS 2023–2024 baseline. Live AIS feed requires a MarineTraffic or Kpler enterprise subscription.

---

## Running locally

```bash
git clone https://github.com/gridworks/hormuz-dashboard.git
cd hormuz-dashboard
npm install
npm run dev
```

Open `http://localhost:5173`

### Optional: EIA API key

For official Brent price data and the 52-week chart, get a free key at [eia.gov/opendata](https://www.eia.gov/opendata/) and create a `.env` file:

```
VITE_EIA_API_KEY=your-key-here
```

Without it the dashboard falls back to Yahoo Finance via a public CORS proxy.

---

## Tech stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Deployed via GitHub Actions → GitHub Pages
