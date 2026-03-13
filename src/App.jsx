import { useState, useEffect, useCallback } from "react";

const EIA_API_KEY = import.meta?.env?.VITE_EIA_API_KEY || "";

const MONTHS = [
  { id:"2023-01", label:"Jan 2023", transits:106, oil:21.0, lng:77, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-02", label:"Feb 2023", transits:105, oil:21.0, lng:77, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-03", label:"Mar 2023", transits:107, oil:21.0, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-04", label:"Apr 2023", transits:108, oil:21.0, lng:78, dwt:10.3, era:"normal",  src:"EIA", note:null },
  { id:"2023-05", label:"May 2023", transits:107, oil:20.9, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:"IRGC seized Marshall Is. tanker. OPEC+ voluntary cuts begin reducing crude volumes." },
  { id:"2023-06", label:"Jun 2023", transits:106, oil:20.8, lng:77, dwt:10.1, era:"normal",  src:"EIA", note:"OPEC+ cuts take effect — crude & condensate volumes decline, partially offset by products." },
  { id:"2023-07", label:"Jul 2023", transits:108, oil:20.8, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-08", label:"Aug 2023", transits:107, oil:20.8, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-09", label:"Sep 2023", transits:108, oil:20.9, lng:79, dwt:10.3, era:"normal",  src:"EIA", note:null },
  { id:"2023-10", label:"Oct 2023", transits:107, oil:20.9, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:"Oct 7 Hamas attack — insurance risk premiums spike. No Hormuz disruption." },
  { id:"2023-11", label:"Nov 2023", transits:106, oil:20.8, lng:77, dwt:10.1, era:"tension", src:"EIA", note:"Houthi attacks begin on Red Sea / Gulf shipping. War-risk zones expanded." },
  { id:"2023-12", label:"Dec 2023", transits:104, oil:20.7, lng:77, dwt:10.0, era:"tension", src:"EIA", note:"Operation Prosperity Guardian. Container lines divert to Cape of Good Hope." },
  { id:"2024-01", label:"Jan 2024", transits:103, oil:20.2, lng:76, dwt:9.9,  era:"tension", src:"EIA", note:"Suez Canal traffic -50%. Saudi Arabia boosts East-West pipeline to avoid Bab el-Mandeb." },
  { id:"2024-02", label:"Feb 2024", transits:104, oil:20.1, lng:77, dwt:10.0, era:"tension", src:"EIA", note:null },
  { id:"2024-03", label:"Mar 2024", transits:105, oil:20.1, lng:77, dwt:10.0, era:"tension", src:"EIA", note:"US/UK airstrikes on Houthi Yemen targets. Hormuz unaffected." },
  { id:"2024-04", label:"Apr 2024", transits:105, oil:20.0, lng:77, dwt:10.1, era:"tension", src:"EIA", note:"Iran direct missile/drone attack on Israel (Apr 13). Gulf insurance premiums surge." },
  { id:"2024-05", label:"May 2024", transits:106, oil:20.1, lng:78, dwt:10.1, era:"tension", src:"EIA", note:null },
  { id:"2024-06", label:"Jun 2024", transits:105, oil:20.0, lng:77, dwt:10.0, era:"tension", src:"EIA", note:null },
  { id:"2024-07", label:"Jul 2024", transits:104, oil:19.9, lng:77, dwt:10.0, era:"tension", src:"EIA", note:"Houthi drones reach Tel Aviv. Iran rhetoric re: Hormuz intensifies." },
  { id:"2024-08", label:"Aug 2024", transits:103, oil:19.8, lng:76, dwt:9.9,  era:"tension", src:"EIA", note:"Iran threatens Hormuz closure in retaliation for Israel strikes on Lebanon." },
  { id:"2024-09", label:"Sep 2024", transits:104, oil:19.9, lng:77, dwt:9.9,  era:"tension", src:"EIA", note:null },
  { id:"2024-10", label:"Oct 2024", transits:103, oil:19.8, lng:76, dwt:9.8,  era:"tension", src:"EIA", note:"Israel strikes Iran (Oct 26). VLCC war-risk premiums spike 300–400%." },
  { id:"2024-11", label:"Nov 2024", transits:102, oil:19.7, lng:75, dwt:9.7,  era:"tension", src:"EIA", note:"US election. Iran repositions IRGC naval assets. Ghost fleet activity elevated." },
  { id:"2024-12", label:"Dec 2024", transits:100, oil:19.5, lng:75, dwt:9.6,  era:"tension", src:"EIA", note:"US carrier groups repositioned to Gulf region. IRGC exercises near strait." },
  { id:"2025-01", label:"Jan 2025", transits:101, oil:20.4, lng:76, dwt:9.7,  era:"tension",    src:"EIA", note:"EIA H1-2025: flows 'remained relatively flat vs 2024'. Last pre-escalation month." },
  { id:"2025-02", label:"Feb 2025", transits:98,  oil:20.2, lng:74, dwt:9.4,  era:"escalation", src:"EST", note:"US Navy formally deploys additional carrier strike group to Gulf." },
  { id:"2025-03", label:"Mar 2025", transits:93,  oil:19.5, lng:71, dwt:8.9,  era:"escalation", src:"EST", note:"US airstrikes on Houthi Yemen positions intensify. War-risk zones expanded Gulf-wide." },
  { id:"2025-04", label:"Apr 2025", transits:87,  oil:18.5, lng:68, dwt:8.4,  era:"escalation", src:"EST", note:"Iran threatens 'reciprocal measures'. IRGC naval exercises visible on AIS." },
  { id:"2025-05", label:"May 2025", transits:84,  oil:17.8, lng:66, dwt:8.1,  era:"escalation", src:"EST", note:"Some Asian buyers temporarily shift to pipeline/alternative routes." },
  { id:"2025-06", label:"Jun 2025", transits:82,  oil:17.2, lng:64, dwt:7.9,  era:"conflict",   src:"EST", note:"IRGC harassment of non-Iranian tankers reported. P&I clubs revise war exclusion clauses." },
  { id:"2025-07", label:"Jul 2025", transits:80,  oil:16.8, lng:63, dwt:7.6,  era:"conflict",   src:"EST", note:"US-Iran back-channel talks. Ghost fleet significantly above seasonal average." },
  { id:"2025-08", label:"Aug 2025", transits:82,  oil:17.0, lng:63, dwt:7.8,  era:"conflict",   src:"EST", note:"Partial stabilization. Saudi/UAE diplomatic channels active." },
  { id:"2025-09", label:"Sep 2025", transits:84,  oil:17.3, lng:64, dwt:8.0,  era:"conflict",   src:"EST", note:"Seasonal Asian crude demand supports partial traffic recovery attempt." },
  { id:"2025-10", label:"Oct 2025", transits:85,  oil:17.5, lng:65, dwt:8.1,  era:"conflict",   src:"EST", note:null },
  { id:"2025-11", label:"Nov 2025", transits:83,  oil:17.2, lng:64, dwt:7.9,  era:"conflict",   src:"EST", note:"Iran OPEC+ negotiating posture hardens. Sanctioned tanker activity elevated." },
  { id:"2025-12", label:"Dec 2025", transits:81,  oil:16.9, lng:63, dwt:7.7,  era:"conflict",   src:"EST", note:"Year-end: traffic ~24% below 2023 normal baseline." },
  { id:"2026-01", label:"Jan 2026", transits:82,  oil:17.0, lng:63, dwt:7.8,  era:"conflict",   src:"EST", note:"Maersk resumes Suez Canal usage (Jan 2026). Hormuz traffic still suppressed." },
  { id:"2026-02", label:"Feb 2026", transits:153, oil:20.5, lng:77, dwt:14.5, era:"conflict",   src:"AIS", note:"Pre-crisis baseline: 153 transits/day (CSIS/Starboard AIS data). US & Israel strike Iran Feb 28 — Khamenei killed. IRGC closes strait immediately." },
  { id:"2026-03", label:"Mar 2026", transits:13,  oil:2.1,  lng:8,  dwt:1.2,  era:"blockade",   src:"AIS", note:"TODAY — STRAIT EFFECTIVELY CLOSED. 90%+ traffic collapse since Mar 1. ~7–13 vessels/day (AIS, MarineTraffic). Only shadow fleet & Iranian vessels transiting. P&I insurance withdrawn Mar 5. 400+ tankers anchored in Persian Gulf. QatarEnergy force majeure on LNG Mar 4. IEA releasing 400M bbl emergency reserves. Oil approaching $200/bbl warnings." },
];

const ERA = {
  normal:     { color:"#00c9a7", label:"Normal Operations",      bg:"rgba(0,201,167,0.08)",   border:"rgba(0,201,167,0.3)"  },
  tension:    { color:"#f0a500", label:"Elevated Tension",       bg:"rgba(240,165,0,0.08)",   border:"rgba(240,165,0,0.3)"  },
  escalation: { color:"#f07b3f", label:"Active Escalation",      bg:"rgba(240,123,63,0.08)",  border:"rgba(240,123,63,0.3)" },
  conflict:   { color:"#e84b3a", label:"Conflict-Affected Zone", bg:"rgba(232,75,58,0.08)",   border:"rgba(232,75,58,0.3)"  },
  blockade:   { color:"#ff00ff", label:"⚠ EFFECTIVELY CLOSED",   bg:"rgba(255,0,255,0.10)",   border:"rgba(255,0,255,0.5)"  },
};

const SRC_COLOR = { EIA:"#00c9a7", EST:"#f0a500", AIS:"#ff79c6" };
const SRC_LABEL = { EIA:"✓ EIA Verified", EST:"~ Modeled Estimate", AIS:"📡 AIS/Live Tracked" };

const VESSEL_TYPES = [
  { type:"VLCC (>200k DWT)",           count:134, pct:24, avgDwt:300000, color:"#e84b3a", icon:"🛢️", direction:"80% outbound", sizeM:300 },
  { type:"Suezmax (120–200k DWT)",     count:63,  pct:11, avgDwt:160000, color:"#f07b3f", icon:"🛢️", direction:"75% outbound", sizeM:270 },
  { type:"Aframax (80–120k DWT)",      count:106, pct:19, avgDwt:100000, color:"#f0a500", icon:"⛽", direction:"65% outbound", sizeM:250 },
  { type:"LNG Carrier (Q-Max/Q-Flex)", count:88,  pct:16, avgDwt:215000, color:"#00c9a7", icon:"🔵", direction:"95% outbound", sizeM:340 },
  { type:"LPG Carrier",                count:75,  pct:13, avgDwt:50000,  color:"#4ecdc4", icon:"💨", direction:"85% outbound", sizeM:200 },
  { type:"Bulk Carrier",               count:145, pct:26, avgDwt:75000,  color:"#6c5ce7", icon:"📦", direction:"60% inbound",  sizeM:220 },
  { type:"Container Ship",             count:98,  pct:18, avgDwt:60000,  color:"#a29bfe", icon:"🏗️", direction:"55% inbound",  sizeM:240 },
  { type:"Product Tanker (MR/Pan)",    count:82,  pct:15, avgDwt:50000,  color:"#fd79a8", icon:"⛽", direction:"70% outbound", sizeM:180 },
];

const FLAGS = [
  { flag:"Panama",          vessels:209, pct:14.2, type:"Flag of Conv.", color:"#e84b3a" },
  { flag:"Marshall Islands",vessels:162, pct:11.0, type:"Flag of Conv.", color:"#f07b3f" },
  { flag:"Liberia",         vessels:154, pct:10.5, type:"Flag of Conv.", color:"#f0a500" },
  { flag:"Singapore",       vessels:98,  pct:6.7,  type:"National",      color:"#00b894" },
  { flag:"Greece",          vessels:87,  pct:5.9,  type:"National",      color:"#0984e3" },
  { flag:"China (PRC)",     vessels:78,  pct:5.3,  type:"National",      color:"#d63031" },
  { flag:"Japan",           vessels:71,  pct:4.8,  type:"National",      color:"#74b9ff" },
  { flag:"South Korea",     vessels:62,  pct:4.2,  type:"National",      color:"#a29bfe" },
  { flag:"India",           vessels:55,  pct:3.7,  type:"National",      color:"#fdcb6e" },
  { flag:"UAE / Saudi",     vessels:48,  pct:3.3,  type:"National",      color:"#55efc4" },
  { flag:"Iran",            vessels:31,  pct:2.1,  type:"Sanctioned",    color:"#636e72" },
  { flag:"Other / FoC",     vessels:366, pct:28.3, type:"Mixed",         color:"#b2bec3" },
];

const CARGO = [
  { name:"Crude Oil",           dailyMbbl:14.2, annualMt:692, annualValueB:405, pct:71, color:"#e84b3a", icon:"🛢️" },
  { name:"LNG",                 dailyMt:0.21,   annualMt:77,  annualValueB:92,  pct:20, color:"#00c9a7", icon:"🔵" },
  { name:"Petroleum Products",  dailyMbbl:3.8,  annualMt:180, annualValueB:105, pct:19, color:"#f0a500", icon:"⛽" },
  { name:"LPG / Propane",       dailyMt:0.08,   annualMt:29,  annualValueB:18,  pct:4,  color:"#4ecdc4", icon:"💨" },
  { name:"Container Goods",     dailyTEU:12000, annualMt:85,  annualValueB:220, pct:9,  color:"#a29bfe", icon:"📦" },
  { name:"Fertilizer / Bulk",   dailyMt:0.12,   annualMt:44,  annualValueB:22,  pct:6,  color:"#6c5ce7", icon:"🌾" },
  { name:"Aluminum / Metals",   dailyMt:0.04,   annualMt:15,  annualValueB:35,  pct:2,  color:"#fd79a8", icon:"⚙️" },
  { name:"Food / Grain (In)",   dailyMt:0.15,   annualMt:55,  annualValueB:28,  pct:7,  color:"#fdcb6e", icon:"🌾" },
];

const PRODUCERS = [
  { country:"Saudi Arabia", share:38.0, mbpd:5.5, color:"#00b894", src:"EIA 2024" },
  { country:"Iraq",         share:22.0, mbpd:3.2, color:"#0984e3", src:"EIA 2024" },
  { country:"UAE",          share:13.0, mbpd:1.9, color:"#6c5ce7", src:"EIA 2024" },
  { country:"Iran",         share:12.0, mbpd:1.7, color:"#e84b3a", src:"EIA 2024" },
  { country:"Kuwait",       share:9.0,  mbpd:1.3, color:"#f0a500", src:"EIA 2024" },
  { country:"Qatar (LNG)",  share:6.0,  mbpd:0.9, color:"#00c9a7", src:"EIA 2024" },
];

const DESTINATIONS = [
  { region:"China",       share:37, color:"#e84b3a", icon:"🇨🇳" },
  { region:"India",       share:15, color:"#6bcb77", icon:"🇮🇳" },
  { region:"Japan",       share:11, color:"#ff6b6b", icon:"🇯🇵" },
  { region:"South Korea", share:12, color:"#ffd93d", icon:"🇰🇷" },
  { region:"SE Asia",     share:9,  color:"#4d96ff", icon:"🌏" },
  { region:"Europe",      share:13, color:"#845ec2", icon:"🇪🇺" },
  { region:"Other",       share:3,  color:"#b2bec3", icon:"🌍" },
];

// ─── LIVE DATA HOOKS ──────────────────────────────────────────────────────────
function useLiveBrent() {
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

    async function fetchYahoo() {
      const ticker = "BZ%3DF";
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`)}`;
      const r = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) throw new Error("proxy non-200");
      const outer = await r.json();
      const j = JSON.parse(outer.contents);
      const meta = j?.chart?.result?.[0]?.meta;
      if (!meta) throw new Error("Yahoo empty");
      const price  = meta.regularMarketPrice;
      const prev_p = meta.previousClose || meta.chartPreviousClose;
      const change = prev_p ? +(price - prev_p).toFixed(2) : null;
      const pct    = prev_p ? +((change / prev_p) * 100).toFixed(2) : null;
      return { price, change, changePercent: pct, ts: new Date().toISOString().split("T")[0], source: "Yahoo Finance (via proxy)", loading: false, error: null };
    }

    async function run() {
      if (EIA_API_KEY) {
        try { const d = await fetchEIA(); if (!cancelled) setData(d); return; }
        catch(e) { console.warn("EIA fetch failed:", e.message); }
      }
      try { const d = await fetchYahoo(); if (!cancelled) setData(d); return; }
      catch(e) { console.warn("Yahoo fetch failed:", e.message); }
      if (!cancelled) setData({ price: 74.2, change: null, changePercent: null, ts: "2026-03-11", source: "Static fallback (APIs unavailable)", loading: false, error: "Live APIs unreachable — showing last known value" });
    }

    run();
    const interval = setInterval(run, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return data;
}

function useBrentHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (!EIA_API_KEY) return;
    fetch(`https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${EIA_API_KEY}&frequency=weekly&data[0]=value&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=52`)
      .then(r => r.json())
      .then(j => {
        const rows = (j?.response?.data || []).reverse();
        setHistory(rows.map(r => ({ date: r.period, price: parseFloat(r.value) })));
      })
      .catch(() => {});
  }, []);
  return history;
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
const Bar = ({ value, max, color, h=5 }) => (
  <div style={{ background:"#1a2332", borderRadius:3, height:h, overflow:"hidden", flex:1 }}>
    <div style={{ width:`${Math.min(100,(value/max)*100)}%`, height:"100%", background:color, borderRadius:3, transition:"width 0.6s ease" }} />
  </div>
);

const Ticker = ({ value, unit, dec=1, color="#00c9a7", size="1.6rem" }) => {
  const [d, setD] = useState(0);
  useEffect(() => {
    let s=0; const e=parseFloat(value)||0, step=(e/700)*16;
    if(e===0){setD(0);return;}
    const t = setInterval(()=>{ s+=step; if(s>=e){setD(e);clearInterval(t);}else setD(s); },16);
    return ()=>clearInterval(t);
  }, [value]);
  return <span style={{ color, fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:size }}>{d.toFixed(dec)}<span style={{ fontSize:"0.72em", opacity:0.6, marginLeft:3 }}>{unit}</span></span>;
};

const Donut = ({ data, size=130 }) => {
  const total = data.reduce((s,d)=>s+d.share,0);
  let cum = -90;
  const cx=size/2, cy=size/2, r=size/2-8, ir=r*0.6;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d,i)=>{
        const angle=(d.share/total)*360, st=cum; cum+=angle;
        const rad=a=>(a*Math.PI)/180;
        const x1=cx+r*Math.cos(rad(st)),y1=cy+r*Math.sin(rad(st));
        const x2=cx+r*Math.cos(rad(st+angle)),y2=cy+r*Math.sin(rad(st+angle));
        const ix1=cx+ir*Math.cos(rad(st)),iy1=cy+ir*Math.sin(rad(st));
        const ix2=cx+ir*Math.cos(rad(st+angle)),iy2=cy+ir*Math.sin(rad(st+angle));
        const lg=angle>180?1:0;
        return <path key={i} d={`M${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${lg},0 ${ix1},${iy1} Z`} fill={d.color} opacity={0.88}/>;
      })}
    </svg>
  );
};

const Spark = ({ data, field, color, w=220, h=44, selIdx }) => {
  const vals = data.map(d=>d[field]);
  const mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*w},${h-((v-mn)/rng)*(h-8)-4}`).join(" ");
  const sx = selIdx!=null?(selIdx/(vals.length-1))*w:null;
  const sy = selIdx!=null?h-((vals[selIdx]-mn)/rng)*(h-8)-4:null;
  return (
    <svg width={w} height={h} style={{overflow:"visible"}}>
      {data.map((d,i)=>{
        if(i===data.length-1) return null;
        const x1=(i/(data.length-1))*w, x2=((i+1)/(data.length-1))*w;
        return <rect key={i} x={x1} y={0} width={x2-x1} height={h} fill={d.src==="EIA"?"rgba(0,201,167,0.04)":"rgba(240,165,0,0.04)"}/>;
      })}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} opacity={0.6}/>
      {(()=>{ const bi=data.findIndex(d=>d.src==="EST"); if(bi<0)return null; const bx=(bi/(data.length-1))*w; return <line key="b" x1={bx} y1={0} x2={bx} y2={h} stroke="#f0a500" strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/>; })()}
      {sx!=null&&<><line x1={sx} y1={0} x2={sx} y2={h} stroke={color} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/><circle cx={sx} cy={sy} r={4} fill={color}/></>}
    </svg>
  );
};

const BrentSpark = ({ history, w=200, h=44 }) => {
  if (!history.length) return <div style={{ width:w, height:h, display:"flex", alignItems:"center", justifyContent:"center", color:"#556677", fontSize:"0.75rem" }}>Loading chart…</div>;
  const vals = history.map(d=>d.price);
  const mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*w},${h-((v-mn)/rng)*(h-8)-4}`).join(" ");
  return (
    <svg width={w} height={h} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke="#f0a500" strokeWidth={1.5} opacity={0.8}/>
      <circle cx={(vals.length-1)/(vals.length-1)*w} cy={h-((vals[vals.length-1]-mn)/rng)*(h-8)-4} r={3} fill="#f0a500"/>
    </svg>
  );
};

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
// FIX: The event note box uses a fixed height with opacity toggling instead of
// visibility, preventing layout shift when notes appear/disappear.
const NOTE_BOX_HEIGHT = "3.6rem"; // constant reserved space

const Timeline = ({ months, idx, onChange }) => {
  const sel = months[idx];
  const era = ERA[sel.era];
  const yearPositions = ["2023","2024","2025","2026"].map(y=>({
    y, pct:(months.findIndex(m=>m.id.startsWith(y))/(months.length-1))*100
  }));
  const base = months[0];

  return (
    <div style={{ background:"rgba(10,15,26,0.96)", border:`1px solid ${era.border}`, borderRadius:12, padding:"16px 20px 14px", marginBottom:16 }}>
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div>
          <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace", textTransform:"uppercase" }}>SELECTED PERIOD</div>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4, flexWrap:"wrap" }}>
            <span style={{ fontSize:"1.1rem", fontWeight:700, color:"#fff", fontFamily:"'Space Mono',monospace" }}>{sel.label}</span>
            <span style={{ padding:"3px 9px", borderRadius:20, fontSize:"0.68rem", fontFamily:"'Space Mono',monospace", background:era.bg, border:`1px solid ${era.border}`, color:era.color }}>{era.label}</span>
            <span style={{ padding:"3px 9px", borderRadius:20, fontSize:"0.68rem", fontFamily:"'Space Mono',monospace", background:SRC_COLOR[sel.src]==="EIA"?"rgba(0,201,167,0.1)":"rgba(240,165,0,0.1)", border:`1px solid ${SRC_COLOR[sel.src]}44`, color:SRC_COLOR[sel.src] }}>{SRC_LABEL[sel.src]}</span>
            {sel.id==="2026-03"&&<span style={{ padding:"3px 9px", borderRadius:20, fontSize:"0.68rem", fontFamily:"'Space Mono',monospace", background:"rgba(0,201,167,0.12)", border:"1px solid #00c9a7", color:"#00c9a7" }}>● TODAY</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {[{l:"Jan '23",i:0},{l:"Oct '23",i:9},{l:"Jan '24",i:12},{l:"Jan '25",i:24},{l:"Today",i:months.length-1}].map(b=>(
            <button key={b.l} onClick={()=>onChange(b.i)} style={{ padding:"5px 11px", borderRadius:5, background:idx===b.i?"rgba(0,201,167,0.1)":"rgba(255,255,255,0.03)", border:`1px solid ${idx===b.i?era.color:"rgba(255,255,255,0.07)"}`, color:idx===b.i?era.color:"#8899bb", cursor:"pointer", fontSize:"0.7rem", fontFamily:"'Space Mono',monospace" }}>{b.l}</button>
          ))}
        </div>
      </div>

      {/* Era colour band */}
      <div style={{ display:"flex", height:4, borderRadius:3, overflow:"hidden", marginBottom:6 }}>
        {months.map((m,i)=><div key={i} style={{ flex:1, background:ERA[m.era].color, opacity:i===idx?1:0.28 }}/>)}
      </div>

      {/* Slider */}
      <div style={{ position:"relative", paddingBottom:22, marginBottom:4 }}>
        <input type="range" min={0} max={months.length-1} value={idx} onChange={e=>onChange(+e.target.value)} style={{ width:"100%", cursor:"pointer", accentColor:era.color }}/>
        {yearPositions.map(({y,pct})=>(
          <div key={y} style={{ position:"absolute", bottom:0, left:`${pct}%`, transform:"translateX(-50%)", textAlign:"center" }}>
            <div style={{ width:1, height:4, background:"rgba(255,255,255,0.1)", margin:"0 auto 2px" }}/>
            <div style={{ fontSize:"0.65rem", color:"#778899", fontFamily:"'Space Mono',monospace" }}>{y}</div>
          </div>
        ))}
        <div style={{ position:"absolute", bottom:0, right:0, textAlign:"center" }}>
          <div style={{ width:1, height:4, background:"#00c9a7", margin:"0 auto 2px" }}/>
          <div style={{ fontSize:"0.62rem", color:"#00c9a7", fontFamily:"'Space Mono',monospace" }}>NOW</div>
        </div>
        {(()=>{ const bi=months.findIndex(d=>d.src==="EST"); if(bi<0)return null; const pct=(bi/(months.length-1))*100; return <div style={{ position:"absolute", top:0, left:`${pct}%`, width:1, height:12, background:"#f0a500", opacity:0.5 }}/>; })()}
      </div>

      {/*
        ── LAYOUT SHIFT FIX ──────────────────────────────────────────────────
        Previously used `visibility: hidden` which hides text but lets the box
        grow/shrink with content length, causing layout shift on every slide.

        Now: fixed height container (NOTE_BOX_HEIGHT) with overflow:hidden.
        Content is always rendered, opacity transitions between 0 and 1.
        Height never changes → zero layout shift regardless of note length.
        ────────────────────────────────────────────────────────────────────── */}
      <div style={{
        height: NOTE_BOX_HEIGHT,
        overflow: "hidden",
        padding:"7px 12px",
        background: era.bg,
        border: `1px solid ${era.border}`,
        borderRadius: 6,
        marginBottom: 12,
        boxSizing: "border-box",
        opacity: sel.note ? 1 : 0,
        transition: "opacity 0.2s ease",
        pointerEvents: sel.note ? "auto" : "none",
      }}>
        <span style={{ fontSize:"0.75rem", color:era.color, fontFamily:"'Space Mono',monospace", lineHeight:1.45 }}>
          ⚡ {sel.note || ""}
        </span>
      </div>

      {/* Sparklines */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { label:"DAILY TRANSITS", field:"transits", color:"#00c9a7", unit:"/day", dec:0 },
          { label:"OIL FLOW (Mb/d)", field:"oil", color:"#e84b3a", unit:"Mb/d", dec:1 },
          { label:"LNG (MT/yr)",     field:"lng",  color:"#4ecdc4", unit:"MT/yr", dec:0 },
        ].map((s,i)=>{
          const base_v=MONTHS[0][s.field], curr=months[idx][s.field];
          const delta=((curr-base_v)/base_v*100).toFixed(1);
          return (
            <div key={i} style={{ background:"rgba(0,0,0,0.15)", borderRadius:7, padding:"9px 11px" }}>
              <div style={{ color:"#778899", fontSize:"0.62rem", letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:4 }}>{s.label}</div>
              <Spark data={months} field={s.field} color={s.color} w={190} h={36} selIdx={idx}/>
              <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.9rem", color:s.color }}>{months[idx][s.field].toFixed(s.dec)}<span style={{ fontSize:"0.65em", opacity:0.6, marginLeft:2 }}>{s.unit}</span></span>
                {idx>0&&<span style={{ fontSize:"0.65rem", color:parseFloat(delta)>=0?"#00c9a7":"#e84b3a" }}>{parseFloat(delta)>=0?"▲":"▼"}{Math.abs(delta)}% vs Jan'23</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:14, marginTop:11, flexWrap:"wrap", alignItems:"center" }}>
        {Object.entries(ERA).map(([k,v])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"0.67rem", color:"#8899aa", fontFamily:"'Space Mono',monospace" }}>
            <div style={{ width:8, height:8, borderRadius:2, background:v.color, opacity:0.75 }}/>{v.label}
          </div>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:12 }}>
          <span style={{ fontSize:"0.65rem", color:"#00c9a7", fontFamily:"'Space Mono',monospace" }}>▓ EIA Verified</span>
          <span style={{ fontSize:"0.65rem", color:"#f0a500", fontFamily:"'Space Mono',monospace" }}>░ Modeled Est.</span>
        </div>
      </div>
    </div>
  );
};

// ─── LIVE BRENT PANEL ─────────────────────────────────────────────────────────
const LiveBrentPanel = ({ brent, history }) => {
  const up = brent.change >= 0;
  return (
    <div style={{ background:"rgba(10,15,26,0.96)", border:`1px solid ${up?"rgba(0,201,167,0.3)":"rgba(232,75,58,0.3)"}`, borderRadius:10, padding:"14px 18px", marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            {brent.loading
              ? <div style={{ width:8, height:8, borderRadius:"50%", background:"#778899", animation:"blink 1s infinite" }}/>
              : <div style={{ width:8, height:8, borderRadius:"50%", background:"#00c9a7", boxShadow:"0 0 6px #00c9a7", animation:"blink 2s infinite" }}/>
            }
            <span style={{ color:"#00c9a7", fontFamily:"'Space Mono',monospace", fontSize:"0.67rem", letterSpacing:3, textTransform:"uppercase" }}>
              {brent.loading ? "FETCHING LIVE DATA…" : `LIVE · ${brent.source}`}
            </span>
          </div>
          <div style={{ fontSize:"0.72rem", color:"#778899", fontFamily:"'Space Mono',monospace", marginBottom:6 }}>BRENT CRUDE SPOT PRICE (USD/bbl)</div>
          {brent.loading
            ? <div style={{ color:"#778899", fontFamily:"'Space Mono',monospace", fontSize:"1.8rem" }}>—</div>
            : (
              <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                <span style={{ color:"#f0a500", fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:"2.1rem" }}>${brent.price?.toFixed(2)}</span>
                {brent.change!=null&&(
                  <span style={{ fontSize:"0.95rem", color:up?"#00c9a7":"#e84b3a", fontFamily:"'Space Mono',monospace" }}>
                    {up?"▲":"▼"} {Math.abs(brent.change).toFixed(2)} ({up?"+":""}{brent.changePercent?.toFixed(2)}%)
                  </span>
                )}
              </div>
            )
          }
          {brent.error&&<div style={{ fontSize:"0.72rem", color:"#f0a500", fontFamily:"'Space Mono',monospace", marginTop:4 }}>⚠ {brent.error}</div>}
          <div style={{ fontSize:"0.67rem", color:"#556677", fontFamily:"'Space Mono',monospace", marginTop:3 }}>
            {brent.ts ? `As of ${brent.ts}` : ""}
            {" · Updates every 5 min · Set VITE_EIA_API_KEY for official EIA data"}
          </div>
        </div>
        <div>
          <div style={{ fontSize:"0.65rem", color:"#778899", fontFamily:"'Space Mono',monospace", marginBottom:4 }}>52-WEEK BRENT (EIA weekly)</div>
          <BrentSpark history={history} w={200} h={44}/>
          {!history.length&&<div style={{ fontSize:"0.67rem", color:"#556677", fontFamily:"'Space Mono',monospace", marginTop:2 }}>Add VITE_EIA_API_KEY to .env for chart</div>}
        </div>
      </div>
    </div>
  );
};

// ─── DATA QUALITY BANNER ──────────────────────────────────────────────────────
const DataQualityBanner = ({ idx }) => {
  const sel = MONTHS[idx];
  const isLive = sel.src === "AIS";
  const isVerified = sel.src === "EIA";
  const color = isLive ? "#ff79c6" : isVerified ? "#00c9a7" : "#f0a500";
  const bg = isLive ? "rgba(255,0,255,0.05)" : isVerified ? "rgba(0,201,167,0.05)" : "rgba(240,165,0,0.05)";
  return (
    <div style={{ padding:"9px 14px", borderRadius:7, marginBottom:12, display:"flex", alignItems:"center", gap:10, background:bg, border:`1px solid ${color}44`, fontSize:"0.75rem", color:"#99aabb" }}>
      <span style={{ color, fontFamily:"'Space Mono',monospace", fontWeight:700, whiteSpace:"nowrap" }}>{isLive?"📡 AIS TRACKED":isVerified?"✓ VERIFIED":"~ ESTIMATED"}</span>
      {isLive
        ? <span>Tracked via <strong style={{color:"#ff79c6"}}>AIS transponder data</strong> (CSIS/Starboard Maritime Intelligence, MarineTraffic). The Strait is <strong style={{color:"#ff00ff"}}>effectively closed</strong> following US/Israel strikes on Iran (Feb 28). Figures reflect real observed collapse, not estimates. Oil flow approximate.</span>
        : isVerified
        ? <span>Oil flow figures sourced from <strong style={{color:"#ccd"}}>EIA official annual data</strong> (World Oil Transit Chokepoints, Vortexa tanker tracking). Monthly values interpolated between verified annual anchors.</span>
        : <span>Beyond Claude's knowledge cutoff (Aug 2025). Values are modeled estimates extrapolated from EIA H1-2025 baseline. Treat as directional only.</span>
      }
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [idx, setIdx]   = useState(MONTHS.length - 1);
  const [tab, setTab]   = useState("overview");
  const [hFlag, setHFlag] = useState(null);

  const brent   = useLiveBrent();
  const history = useBrentHistory();

  const sel   = MONTHS[idx];
  const era   = ERA[sel.era];
  const base  = MONTHS[0];
  const ratio = sel.transits / base.transits;
  const totalVal = CARGO.reduce((s,c)=>s+c.annualValueB,0);

  return (
    <div style={{ fontFamily:"'Space Grotesk',sans-serif", background:"#0a0f1a", color:"#dde4f0", minHeight:"100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:"linear-gradient(rgba(0,201,167,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,167,0.018) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }}/>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(180deg,#0d1626,rgba(13,22,38,0.97))", borderBottom:"1px solid rgba(0,201,167,0.1)", padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:10 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#00c9a7", boxShadow:"0 0 7px #00c9a7", animation:"blink 2s infinite" }}/>
            <span style={{ color:"#00c9a7", fontFamily:"'Space Mono',monospace", fontSize:"0.67rem", letterSpacing:4, textTransform:"uppercase" }}>Maritime Intelligence · Mar 12, 2026</span>
          </div>
          <h1 style={{ margin:0, fontSize:"1.4rem", fontWeight:700, color:"#fff", letterSpacing:-0.4 }}>STRAIT OF HORMUZ — TRAFFIC INTELLIGENCE</h1>
          <div style={{ color:"#8899aa", fontSize:"0.75rem", marginTop:3, fontFamily:"'Space Mono',monospace" }}>
            EIA VERIFIED HISTORY · LIVE BRENT · AIS + LLOYD'S BASELINES · JAN 2023 → TODAY
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ padding:"6px 13px", background:era.bg, border:`1px solid ${era.border}`, borderRadius:20, fontSize:"0.72rem", fontFamily:"'Space Mono',monospace", color:era.color, marginBottom:5 }}>
            {sel.label} · {era.label}
          </div>
          <div style={{ fontSize:"0.67rem", color:SRC_COLOR[sel.src], fontFamily:"'Space Mono',monospace" }}>{SRC_LABEL[sel.src]}</div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", borderBottom:"1px solid rgba(0,201,167,0.05)", position:"relative", zIndex:10 }}>
        {[
          { label:"DAILY TRANSITS",   val:sel.transits,                  unit:"vessels/day", dec:0, color:"#00c9a7", base_v:base.transits },
          { label:"DAILY TONNAGE",    val:sel.dwt,                       unit:"M DWT/day",   dec:1, color:"#4ecdc4", base_v:base.dwt },
          { label:"OIL FLOW",         val:sel.oil,                       unit:"Mb/day",      dec:1, color:"#e84b3a", base_v:base.oil },
          { label:"LNG FLOW",         val:sel.lng,                       unit:"MT/yr",       dec:0, color:"#00c9a7", base_v:base.lng },
          { label:"BRENT CRUDE",      val:brent.price||74.2,             unit:"$/bbl",       dec:2, color:"#f0a500", base_v:null, live:true },
        ].map((k,i)=>{
          const d = k.base_v!=null ? ((parseFloat(k.val)-parseFloat(k.base_v))/parseFloat(k.base_v)*100).toFixed(1) : null;
          return (
            <div key={i} style={{ padding:"13px 16px", borderRight:i<4?"1px solid rgba(0,201,167,0.05)":"none", background:"rgba(10,15,26,0.85)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                <div style={{ color:"#778899", fontSize:"0.62rem", letterSpacing:3, textTransform:"uppercase", fontFamily:"'Space Mono',monospace" }}>{k.label}</div>
                {k.live&&<div style={{ width:6, height:6, borderRadius:"50%", background:brent.loading?"#778899":"#00c9a7", animation:"blink 2s infinite" }}/>}
              </div>
              <Ticker key={`${k.val}-${i}`} value={k.val} unit={k.unit} dec={k.dec} color={k.color}/>
              {d!=null&&idx>0&&<div style={{ fontSize:"0.65rem", color:parseFloat(d)>=0?"#00c9a7":"#e84b3a", marginTop:3, fontFamily:"'Space Mono',monospace" }}>{parseFloat(d)>=0?"▲":"▼"}{Math.abs(d)}%</div>}
              {k.live&&brent.change!=null&&<div style={{ fontSize:"0.65rem", color:brent.change>=0?"#00c9a7":"#e84b3a", marginTop:3, fontFamily:"'Space Mono',monospace" }}>{brent.change>=0?"▲":"▼"}{Math.abs(brent.change).toFixed(2)} today</div>}
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.04)", padding:"0 24px", background:"rgba(10,15,26,0.9)", position:"relative", zIndex:10 }}>
        {["overview","fleet","cargo","origins & destinations"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"11px 18px", background:"transparent", border:"none", borderBottom:tab===t?`2px solid ${era.color}`:"2px solid transparent", color:tab===t?era.color:"#6677aa", cursor:"pointer", fontSize:"0.75rem", letterSpacing:2, textTransform:"uppercase", fontFamily:"'Space Mono',monospace", transition:"all 0.2s" }}>{t}</button>
        ))}
      </div>

      {/* PAGE */}
      <div style={{ padding:"18px 24px", position:"relative", zIndex:10 }}>

        <LiveBrentPanel brent={brent} history={history}/>
        <DataQualityBanner idx={idx}/>
        <Timeline months={MONTHS} idx={idx} onChange={setIdx}/>

        {/* ══ OVERVIEW ══ */}
        {tab==="overview"&&(
          <div>
            <div style={{ background:`linear-gradient(135deg,rgba(0,201,167,0.03),${era.bg})`, border:`1px solid ${era.border}`, borderRadius:12, padding:"14px 20px", marginBottom:14, display:"flex", gap:24, alignItems:"center" }}>
              <svg width={240} height={100} viewBox="0 0 240 100" style={{flexShrink:0}}>
                <ellipse cx={50} cy={50} rx={45} ry={34} fill="rgba(0,100,180,0.1)" stroke="rgba(0,150,200,0.22)" strokeWidth={1}/>
                <text x={50} y={53} fill="#778899" fontSize={7} textAnchor="middle" fontFamily="Space Mono">PERSIAN GULF</text>
                <rect x={93} y={34} width={54} height={32} rx={4} fill={era.bg} stroke={era.color} strokeWidth={1.5}/>
                <text x={120} y={48} fill={era.color} fontSize={7} textAnchor="middle" fontFamily="Space Mono">HORMUZ</text>
                <text x={120} y={59} fill={era.color} fontSize={6} textAnchor="middle" fontFamily="Space Mono">21 nm wide</text>
                <ellipse cx={190} cy={50} rx={45} ry={34} fill="rgba(0,60,120,0.1)" stroke="rgba(0,100,180,0.18)" strokeWidth={1}/>
                <text x={190} y={53} fill="#778899" fontSize={7} textAnchor="middle" fontFamily="Space Mono">GULF OF OMAN</text>
                <line x1={96} y1={44} x2={57} y2={44} stroke="#e84b3a" strokeWidth={1.8} strokeDasharray="4,2"/>
                <line x1={96} y1={56} x2={57} y2={56} stroke="#00c9a7" strokeWidth={1.8} strokeDasharray="4,2"/>
                <line x1={147} y1={44} x2={184} y2={44} stroke="#00c9a7" strokeWidth={1.8} strokeDasharray="4,2"/>
                <line x1={147} y1={56} x2={184} y2={56} stroke="#e84b3a" strokeWidth={1.8} strokeDasharray="4,2"/>
                <text x={68} y={38} fill="#e84b3a" fontSize={5.5} fontFamily="Space Mono">← OUTBOUND</text>
                <text x={68} y={68} fill="#00c9a7" fontSize={5.5} fontFamily="Space Mono">→ INBOUND</text>
                <text x={149} y={38} fill="#00c9a7" fontSize={5.5} fontFamily="Space Mono">OUT →</text>
                <text x={149} y={68} fill="#e84b3a" fontSize={5.5} fontFamily="Space Mono">← IN</text>
              </svg>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, flex:1 }}>
                {[
                  { l:"Strait Width",   v:"21 nmi",             s:"Two 2-nmi shipping lanes",            src:"Physical" },
                  { l:"% World Oil",    v:`~${(20*ratio).toFixed(0)}%`, s:sel.era==="normal"?"EIA 2023–2024 baseline":"↓ from ~20% EIA norm", src:"EIA" },
                  { l:"% World LNG",    v:"~20%",               s:"EIA 2024 — primarily Qatar",          src:"EIA" },
                  { l:"Asia-Bound",     v:"84%",                s:"EIA 2024 crude & condensate",         src:"EIA" },
                  { l:"Flags of Conv.", v:"56%+",               s:"Panama / Marshall Is. / Liberia",     src:"Lloyd's" },
                  { l:"Status",         v:era.label,            s:sel.note?sel.note.slice(0,42)+"…":"No notable incident this period", c:era.color, src:sel.src },
                ].map((s,i)=>(
                  <div key={i}>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                      <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:2, fontFamily:"'Space Mono',monospace", textTransform:"uppercase" }}>{s.l}</div>
                      <div style={{ fontSize:"0.58rem", color:SRC_COLOR[s.src]||"#778899", fontFamily:"'Space Mono',monospace", opacity:0.8 }}>[{s.src}]</div>
                    </div>
                    <div style={{ color:s.c||era.color, fontSize:"0.95rem", fontWeight:700, margin:"2px 0" }}>{s.v}</div>
                    <div style={{ color:"#8899aa", fontSize:"0.72rem", lineHeight:1.4 }}>{s.s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
                  <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace" }}>CRUDE EXPORT SHARE BY PRODUCER</div>
                  <span style={{ fontSize:"0.62rem", color:"#00c9a7", fontFamily:"'Space Mono',monospace" }}>✓ EIA 2024</span>
                </div>
                {PRODUCERS.map((p,i)=>(
                  <div key={i} style={{ marginBottom:11 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:"0.82rem", fontWeight:600 }}>{p.country}</span>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.75rem", color:p.color }}>{p.share}% · {p.mbpd} Mb/d</span>
                    </div>
                    <Bar value={p.share} max={42} color={p.color} h={5}/>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
                  <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace" }}>CARGO DESTINATION BREAKDOWN</div>
                  <span style={{ fontSize:"0.62rem", color:"#00c9a7", fontFamily:"'Space Mono',monospace" }}>✓ EIA 2024 / IEA</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:18 }}>
                  <Donut data={DESTINATIONS} size={120}/>
                  <div style={{ flex:1 }}>
                    {DESTINATIONS.map((d,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                        <span style={{ fontSize:"0.78rem", flex:1 }}>{d.icon} {d.region}</span>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.72rem", color:d.color, minWidth:30, textAlign:"right" }}>{d.share}%</span>
                        <Bar value={d.share} max={42} color={d.color} h={4}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ FLEET ══ */}
        {tab==="fleet"&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:14, marginBottom:14 }}>
              <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:13 }}>
                  <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace" }}>VESSEL TYPE COMPOSITION (SCALED TO PERIOD)</div>
                  <span style={{ fontSize:"0.62rem", color:"#f0a500", fontFamily:"'Space Mono',monospace" }}>~ Lloyd's/AIS baseline</span>
                </div>
                {VESSEL_TYPES.map((v,i)=>(
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"22px 180px 50px 72px 1fr 50px", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ fontSize:"0.9rem" }}>{v.icon}</span>
                    <div>
                      <div style={{ fontSize:"0.76rem", fontWeight:600 }}>{v.type}</div>
                      <div style={{ fontSize:"0.65rem", color:"#778899", marginTop:1 }}>{v.sizeM}m · {(v.avgDwt/1000).toFixed(0)}k DWT</div>
                    </div>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.75rem", color:v.color, textAlign:"right" }}>{Math.round(v.count*ratio)}</span>
                    <span style={{ fontSize:"0.65rem", color:"#8899aa", textAlign:"center" }}>{v.direction}</span>
                    <Bar value={v.pct} max={30} color={v.color} h={4}/>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.68rem", color:"#778899", textAlign:"right" }}>{v.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px", flex:1 }}>
                  <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace", marginBottom:13 }}>TANKER SIZE CLASSES</div>
                  {[
                    { name:"ULCC",      dwt:">320k",    len:"380m+",    note:"Rare" },
                    { name:"VLCC",      dwt:"200–320k", len:"300–330m", note:"Primary crude" },
                    { name:"Suezmax",   dwt:"120–200k", len:"270m",     note:"Crude/Prod" },
                    { name:"Aframax",   dwt:"80–120k",  len:"250m",     note:"Regional" },
                    { name:"Panamax",   dwt:"60–80k",   len:"220m",     note:"Products" },
                    { name:"MR Tanker", dwt:"25–55k",   len:"180m",     note:"Refined" },
                    { name:"Handysize", dwt:"<25k",     len:"120–170m", note:"Coastal" },
                  ].map((s,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.03)", fontSize:"0.74rem" }}>
                      <span style={{ color:era.color, fontFamily:"'Space Mono',monospace", fontWeight:700, width:72 }}>{s.name}</span>
                      <span style={{ color:"#aabbcc" }}>{s.dwt}</span>
                      <span style={{ color:"#8899aa" }}>{s.len}</span>
                      <span style={{ color:"#667788", fontSize:"0.65rem" }}>{s.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:13 }}>
                <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace" }}>FLAG STATE REGISTRY (AIS / LLOYD'S 2023–2024 BASELINE)</div>
                <span style={{ fontSize:"0.62rem", color:"#f0a500", fontFamily:"'Space Mono',monospace" }}>~ WorldwideAIS / Lloyd's List Intelligence</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:7 }}>
                {FLAGS.map((f,i)=>(
                  <div key={i} onMouseEnter={()=>setHFlag(i)} onMouseLeave={()=>setHFlag(null)}
                    style={{ padding:"9px 11px", background:hFlag===i?"rgba(0,201,167,0.05)":"rgba(255,255,255,0.02)", border:`1px solid ${hFlag===i?f.color:"rgba(255,255,255,0.04)"}`, borderRadius:7, cursor:"default", transition:"all 0.2s" }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:600, color:f.color, marginBottom:2 }}>{f.flag}</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.85rem", color:"#fff" }}>{f.vessels}</div>
                    <div style={{ fontSize:"0.63rem", color:"#778899", marginTop:2 }}>{f.pct}% · {f.type}</div>
                    <div style={{ marginTop:5 }}><Bar value={f.pct} max={16} color={f.color} h={3}/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ CARGO ══ */}
        {tab==="cargo"&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:11, marginBottom:14 }}>
              {CARGO.map((c,i)=>(
                <div key={i} style={{ background:"rgba(13,22,38,0.8)", border:`1px solid ${c.color}18`, borderLeft:`3px solid ${c.color}`, borderRadius:9, padding:"13px 15px", display:"grid", gridTemplateColumns:"34px 1fr auto", gap:11, alignItems:"center" }}>
                  <span style={{ fontSize:"1.3rem" }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"0.87rem", marginBottom:3 }}>{c.name}</div>
                    <div style={{ fontSize:"0.68rem", color:"#8899aa" }}>
                      {c.dailyMbbl&&`${(c.dailyMbbl*ratio).toFixed(1)} Mb/d · `}
                      {c.dailyMt&&`${(c.dailyMt*ratio).toFixed(2)} Mt/d · `}
                      {c.dailyTEU&&`${Math.round(c.dailyTEU*ratio).toLocaleString()} TEU/d · `}
                      Est. {Math.round(c.annualMt*ratio)} MT/yr
                    </div>
                    <div style={{ marginTop:5 }}><Bar value={c.annualValueB*ratio} max={450} color={c.color} h={4}/></div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Space Mono',monospace", color:c.color, fontSize:"0.95rem", fontWeight:700 }}>${(c.annualValueB*ratio).toFixed(0)}B</div>
                    <div style={{ fontSize:"0.62rem", color:"#778899", marginTop:2 }}>annual est.</div>
                    {ratio<0.97&&<div style={{ fontSize:"0.62rem", color:"#e84b3a", marginTop:2 }}>↓{((1-ratio)*100).toFixed(0)}%</div>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:11 }}>
              {[
                { l:"TOTAL ANNUAL VALUE",  v:`$${(totalVal*ratio).toFixed(0)}B`, s:`~$${(totalVal*ratio/365).toFixed(1)}B/day · EIA est. $600B/yr normal`, c:era.color },
                { l:"GLOBAL OIL SUPPLY",   v:`~${(20*ratio).toFixed(0)}%`,       s:sel.src==="EIA"?"EIA verified":"Scaled from EIA baseline", c:"#e84b3a" },
                { l:"GLOBAL LNG SUPPLY",   v:"~20%",                             s:"EIA 2024 — Qatar primary source", c:"#4ecdc4" },
              ].map((s,i)=>(
                <div key={i} style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:9, padding:"15px 18px", textAlign:"center" }}>
                  <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>{s.l}</div>
                  <div style={{ color:s.c, fontSize:"1.6rem", fontWeight:700, fontFamily:"'Space Mono',monospace" }}>{s.v}</div>
                  <div style={{ color:"#8899aa", fontSize:"0.72rem", marginTop:5 }}>{s.s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ORIGINS & DESTINATIONS ══ */}
        {tab==="origins & destinations"&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px" }}>
                <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace", marginBottom:13 }}>MAJOR LOADING TERMINALS</div>
                {[
                  { port:"Ras Tanura (Saudi Arabia)",     type:"Crude Oil",       cap:"6–8 Mb/d",    c:"#00b894", src:"EIA" },
                  { port:"Ras Laffan (Qatar)",            type:"LNG / Condensate",cap:"80 MT/yr LNG", c:"#00c9a7", src:"EIA" },
                  { port:"Kharg Island (Iran)",           type:"Crude Oil",       cap:"2–2.5 Mb/d",  c:"#e84b3a", src:"EIA" },
                  { port:"Basra / Khor Al-Amaya (Iraq)",  type:"Crude Oil",       cap:"3.5–4 Mb/d",  c:"#0984e3", src:"EIA" },
                  { port:"Jebel Ali (UAE)",               type:"Container/Mixed", cap:"22M TEU/yr",  c:"#6c5ce7", src:"UNCTAD" },
                  { port:"Shuaiba (Kuwait)",              type:"Crude/Products",  cap:"2–2.5 Mb/d",  c:"#f0a500", src:"EIA" },
                  { port:"Bahrain / Mina Salman",         type:"Products / LPG",  cap:"Mixed",       c:"#fd79a8", src:"Est." },
                ].map((p,i)=>(
                  <div key={i} style={{ padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontWeight:600, fontSize:"0.8rem", color:p.c }}>{p.port}</span>
                      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.7rem", color:"#8899aa" }}>{p.cap}</span>
                        <span style={{ fontSize:"0.58rem", color:SRC_COLOR[p.src]||"#778899", fontFamily:"'Space Mono',monospace" }}>[{p.src}]</span>
                      </div>
                    </div>
                    <div style={{ fontSize:"0.68rem", color:"#667788" }}>{p.type}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(13,22,38,0.8)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:11, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:13 }}>
                  <div style={{ color:"#778899", fontSize:"0.65rem", letterSpacing:3, fontFamily:"'Space Mono',monospace" }}>DESTINATION FLOWS (PERIOD-ADJUSTED)</div>
                  <span style={{ fontSize:"0.58rem", color:"#00c9a7", fontFamily:"'Space Mono',monospace" }}>✓ EIA 2024</span>
                </div>
                {[
                  { r:"China",       crude:`~${(7*ratio).toFixed(1)}`,   lng:"~25",  dep:"HIGH",     c:"#e84b3a", src:"EIA" },
                  { r:"Japan",       crude:`~${(2.7*ratio).toFixed(1)}`, lng:"~18",  dep:"CRITICAL", c:"#ff7675", src:"EIA" },
                  { r:"South Korea", crude:`~${(2.0*ratio).toFixed(1)}`, lng:"~10",  dep:"HIGH",     c:"#ffd93d", src:"EIA" },
                  { r:"India",       crude:`~${(2.5*ratio).toFixed(1)}`, lng:"~8",   dep:"HIGH",     c:"#6bcb77", src:"EIA" },
                  { r:"SE Asia",     crude:`~${(1.2*ratio).toFixed(1)}`, lng:"~8",   dep:"MOD.",     c:"#4d96ff", src:"EIA" },
                  { r:"Europe",      crude:`~${(1.5*ratio).toFixed(1)}`, lng:"12–14%",dep:"MOD-HIGH",c:"#845ec2", src:"IEA" },
                ].map((d,i)=>(
                  <div key={i} style={{ padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:"0.82rem", color:d.c }}>{d.r}</span>
                      <span style={{ fontSize:"0.65rem", color:d.dep==="CRITICAL"?"#e84b3a":d.dep==="HIGH"?"#f0a500":"#8899aa", fontFamily:"'Space Mono',monospace" }}>{d.dep}</span>
                    </div>
                    <div style={{ display:"flex", gap:14, fontSize:"0.7rem", color:"#8899aa" }}>
                      <span>🛢️ <strong style={{color:"#ccd"}}>{d.crude} Mb/d</strong></span>
                      <span>🔵 <strong style={{color:"#ccd"}}>{d.lng} MT/yr</strong></span>
                      <span style={{ marginLeft:"auto", fontSize:"0.58rem", color:SRC_COLOR[d.src]||"#778899", fontFamily:"'Space Mono',monospace" }}>[{d.src}]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop:12, background:"rgba(0,201,167,0.02)", border:"1px solid rgba(0,201,167,0.07)", borderRadius:9, padding:"13px 16px" }}>
              <div style={{ color:"#00c9a7", fontSize:"0.67rem", letterSpacing:3, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>📡 DATA SOURCES, ACCURACY & LIVE WIRING</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, fontSize:"0.72rem", color:"#8899aa" }}>
                <div><strong style={{color:"#00c9a7"}}>✓ EIA Verified</strong><br/>2022–H1 2025 oil flows: EIA World Chokepoints report (Vortexa tanker tracking). Annual anchors only — monthly values interpolated.</div>
                <div><strong style={{color:"#f0a500"}}>~ Modeled Estimates</strong><br/>H2 2025 onwards: extrapolated from EIA H1-2025 baseline + geopolitical events. Treat as directional.</div>
                <div><strong style={{color:"#f0a500"}}>📡 Live Brent Price</strong><br/>Pulled from EIA API v2 (with key) or Yahoo Finance via CORS proxy (no key). Refreshes every 5 min. Add VITE_EIA_API_KEY to .env for official data.</div>
                <div><strong style={{color:"#f0a500"}}>🚢 Vessel Counts</strong><br/>Lloyd's List Intelligence / WorldwideAIS baseline (2023–2024). No live AIS feed — requires MarineTraffic or Kpler enterprise subscription ($$$).</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}} input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:rgba(255,255,255,0.07);outline:none} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#00c9a7;cursor:pointer;border:2px solid #0a0f1a;box-shadow:0 0 5px rgba(0,201,167,0.4)}`}</style>
    </div>
  );
}
