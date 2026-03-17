import { useState } from "react";

import { MONTHS, ERA, SRC_COLOR, SRC_LABEL } from "./data/index.js";
import { useLiveBrent } from "./hooks/useLiveBrent.js";
import { useBrentHistory } from "./hooks/useBrentHistory.js";
import { Ticker } from "./components/Ticker.jsx";
import { Timeline } from "./components/Timeline.jsx";
import { LiveBrentPanel } from "./components/LiveBrentPanel.jsx";
import { DataQualityBanner } from "./components/DataQualityBanner.jsx";
import { OverviewTab } from "./tabs/OverviewTab.jsx";
import { FleetTab } from "./tabs/FleetTab.jsx";
import { CargoTab } from "./tabs/CargoTab.jsx";
import { OriginsTab } from "./tabs/OriginsTab.jsx";

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

  return (
    <div style={{ fontFamily:"var(--font-display)", background:"var(--color-bg)", color:"var(--color-text)", minHeight:"100vh", width:"100%" }}>
      <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:`linear-gradient(var(--color-grid) 1px,transparent 1px),linear-gradient(90deg,var(--color-grid) 1px,transparent 1px)`, backgroundSize:"40px 40px", pointerEvents:"none" }}/>

      {/* HEADER */}
      <div style={{ background:`linear-gradient(180deg,var(--color-bg-header),rgba(13,22,38,0.97))`, borderBottom:"1px solid rgba(0,201,167,0.1)", padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:10 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--color-normal)", boxShadow:"0 0 7px var(--color-normal)", animation:"blink 2s infinite" }}/>
            <span style={{ color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontSize:"var(--fs-67)", letterSpacing:4, textTransform:"uppercase", fontWeight:"var(--fw-500)" }}>Maritime Intelligence · Mar 12, 2026</span>
          </div>
          <h1 style={{ margin:0, fontSize:"var(--fs-140)", fontWeight:"var(--fw-700)", color:"var(--color-white)", letterSpacing:-0.4 }}>STRAIT OF HORMUZ — TRAFFIC INTELLIGENCE</h1>
          <div style={{ color:"var(--color-text-3)", fontSize:"var(--fs-75)", marginTop:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>
            EIA VERIFIED HISTORY · LIVE BRENT · AIS + LLOYD'S BASELINES · JAN 2023 → TODAY
          </div>
        </div>
        <div style={{ textAlign:"right", minWidth:260, flexShrink:0 }}>
          <div style={{ padding:"6px 13px", background:era.bg, border:`1px solid ${era.border}`, borderRadius:20, fontSize:"var(--fs-72)", fontFamily:"var(--font-mono)", color:era.color, marginBottom:5, fontWeight:"var(--fw-600)" }}>
            {sel.label} · {era.label}
          </div>
          <div style={{ fontSize:"var(--fs-67)", color:SRC_COLOR[sel.src], fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>{SRC_LABEL[sel.src]}</div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", borderBottom:"1px solid rgba(0,201,167,0.05)", position:"relative", zIndex:10 }}>
        {[
          { label:"DAILY TRANSITS",   val:sel.transits,      unit:"vessels/day", dec:0, color:"var(--color-normal)", base_v:base.transits },
          { label:"DAILY TONNAGE",    val:sel.dwt,           unit:"M DWT/day",   dec:1, color:"var(--color-teal)",   base_v:base.dwt },
          { label:"OIL FLOW",         val:sel.oil,           unit:"Mb/day",      dec:1, color:"var(--color-conflict)", base_v:base.oil },
          { label:"LNG FLOW",         val:sel.lng,           unit:"MT/yr",       dec:0, color:"var(--color-normal)", base_v:base.lng },
          { label:"BRENT CRUDE",      val:brent.price||74.2, unit:"$/bbl",       dec:2, color:"var(--color-tension)", base_v:null, live:true },
        ].map((k,i)=>{
          const d = k.base_v!=null ? ((parseFloat(k.val)-parseFloat(k.base_v))/parseFloat(k.base_v)*100).toFixed(1) : null;
          return (
            <div key={i} style={{ padding:"13px 16px", borderRight:i<4?"1px solid rgba(0,201,167,0.05)":"none", background:"var(--color-bg-kpi)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-62)", letterSpacing:3, textTransform:"uppercase", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>{k.label}</div>
                {k.live&&<div style={{ width:6, height:6, borderRadius:"50%", background:brent.loading?"var(--color-text-4)":"var(--color-normal)", animation:"blink 2s infinite" }}/>}
              </div>
              <Ticker key={`${k.val}-${i}`} value={k.val} unit={k.unit} dec={k.dec} color={k.color}/>
              {d!=null&&idx>0&&<div style={{ fontSize:"var(--fs-65)", color:parseFloat(d)>=0?"var(--color-normal)":"var(--color-conflict)", marginTop:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>{parseFloat(d)>=0?"▲":"▼"}{Math.abs(d)}%</div>}
              {k.live&&brent.change!=null&&<div style={{ fontSize:"var(--fs-65)", color:brent.change>=0?"var(--color-normal)":"var(--color-conflict)", marginTop:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>{brent.change>=0?"▲":"▼"}{Math.abs(brent.change).toFixed(2)} today</div>}
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--color-border-card)", padding:"0 24px", background:"var(--color-bg-tabs)", position:"relative", zIndex:10 }}>
        {["overview","fleet","cargo","origins & destinations"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"11px 18px", background:"transparent", border:"none", borderBottom:tab===t?`2px solid ${era.color}`:"2px solid transparent", color:tab===t?era.color:"var(--color-text-6)", cursor:"pointer", fontSize:"var(--fs-75)", letterSpacing:2, textTransform:"uppercase", fontFamily:"var(--font-mono)", transition:"all 0.2s", fontWeight:"var(--fw-600)" }}>{t}</button>
        ))}
      </div>

      {/* PAGE */}
      <div style={{ padding:"18px 24px", position:"relative", zIndex:10 }}>

        <LiveBrentPanel brent={brent} history={history}/>
        <DataQualityBanner idx={idx}/>
        <Timeline months={MONTHS} idx={idx} onChange={setIdx}/>

        {tab==="overview"&&<OverviewTab era={era} sel={sel} ratio={ratio}/>}
        {tab==="fleet"&&<FleetTab era={era} ratio={ratio} hFlag={hFlag} setHFlag={setHFlag}/>}
        {tab==="cargo"&&<CargoTab era={era} sel={sel} ratio={ratio}/>}
        {tab==="origins & destinations"&&<OriginsTab ratio={ratio} sel={sel}/>}
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}} input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:rgba(255,255,255,0.07);outline:none} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#00c9a7;cursor:pointer;border:2px solid #0a0f1a;box-shadow:0 0 5px rgba(0,201,167,0.4)}`}</style>
    </div>
  );
}
