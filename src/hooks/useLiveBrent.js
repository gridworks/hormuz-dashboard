import { useState, useEffect } from "react";
import { EIA_API_KEY } from "../data/index.js";

export function useLiveBrent() {
  const [data, setData] = useState({ price: null, change: null, changePercent: null, ts: null, source: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function fetchEIA() {
      const url = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${EIA_API_KEY}&frequency=daily&data[0]=value&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=2`;
      const r = await fetch(url);
      if (!r.ok) throw new Error("EIA non-200");
      const j = await r.json();
      const rows = j?.response?.data;
      if (!rows || rows.length < 1) throw new Error("EIA empty");
      const latest = rows[0];
      const prev   = rows[1];
      const price  = parseFloat(latest.value);
      const prev_p = prev ? parseFloat(prev.value) : null;
      const change = prev_p ? +(price - prev_p).toFixed(2) : null;
      const pct    = prev_p ? +((change / prev_p) * 100).toFixed(2) : null;
      return { price, change, changePercent: pct, ts: latest.period, source: "EIA API (official)", loading: false, error: null };
    }

    async function run() {
      if (EIA_API_KEY) {
        try { const d = await fetchEIA(); if (!cancelled) setData(d); return; }
        catch (_e) { /* EIA unreachable, use fallback */ }
      }
      // Skip Yahoo proxy (often CORS/500); use static fallback when EIA unavailable
      if (!cancelled) setData({ price: 74.2, change: null, changePercent: null, ts: "2026-03-11", source: "Static fallback (set VITE_EIA_API_KEY for live)", loading: false, error: "Live APIs unreachable — showing last known value" });
    }

    run();
    const interval = setInterval(run, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return data;
}
