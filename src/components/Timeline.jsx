import { ERA, SRC_COLOR, SRC_LABEL, MONTHS } from "../data/index.js";
import { Spark } from "./Spark.jsx";

// FIX: The event note box uses a fixed height with opacity toggling instead of
// visibility, preventing layout shift when notes appear/disappear.
const NOTE_BOX_HEIGHT = "3.6rem"; // constant reserved space

export const Timeline = ({ months, idx, onChange }) => {
  const sel = months[idx];
  const era = ERA[sel.era];
  const yearPositions = ["2023","2024","2025","2026"].map(y=>({
    y, pct:(months.findIndex(m=>m.id.startsWith(y))/(months.length-1))*100
  }));

  return (
    <div style={{ background:"var(--color-bg-panel)", border:`1px solid ${era.border}`, borderRadius:12, padding:"16px 20px 14px", marginBottom:16 }}>
      {/* Top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div>
          <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", textTransform:"uppercase", fontWeight:"var(--fw-500)" }}>SELECTED PERIOD</div>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4, flexWrap:"wrap" }}>
            <span style={{ fontSize:"var(--fs-110)", fontWeight:"var(--fw-700)", color:"var(--color-white)", fontFamily:"var(--font-mono)" }}>{sel.label}</span>
            <span style={{ padding:"3px 9px", borderRadius:20, fontSize:"var(--fs-68)", fontFamily:"var(--font-mono)", background:era.bg, border:`1px solid ${era.border}`, color:era.color, fontWeight:"var(--fw-500)" }}>{era.label}</span>
            <span style={{ padding:"3px 9px", borderRadius:20, fontSize:"var(--fs-68)", fontFamily:"var(--font-mono)", background:SRC_COLOR[sel.src]==="EIA"?"rgba(0,201,167,0.1)":"rgba(240,165,0,0.1)", border:`1px solid ${SRC_COLOR[sel.src]}44`, color:SRC_COLOR[sel.src], fontWeight:"var(--fw-500)" }}>{SRC_LABEL[sel.src]}</span>
            {sel.id==="2026-03"&&<span style={{ padding:"3px 9px", borderRadius:20, fontSize:"var(--fs-68)", fontFamily:"var(--font-mono)", background:"rgba(0,201,167,0.12)", border:"1px solid var(--color-normal)", color:"var(--color-normal)", fontWeight:"var(--fw-500)" }}>● TODAY</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {[{l:"Jan '23",i:0},{l:"Oct '23",i:9},{l:"Jan '24",i:12},{l:"Jan '25",i:24},{l:"Today",i:months.length-1}].map(b=>(
            <button key={b.l} onClick={()=>onChange(b.i)} style={{ padding:"5px 11px", borderRadius:5, background:idx===b.i?"rgba(0,201,167,0.1)":"rgba(255,255,255,0.03)", border:`1px solid ${idx===b.i?era.color:"var(--color-border-btn)"}`, color:idx===b.i?era.color:"var(--color-text-8)", cursor:"pointer", fontSize:"var(--fs-70)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>{b.l}</button>
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
            <div style={{ width:1, height:4, background:"var(--color-border-subtle)", margin:"0 auto 2px" }}/>
            <div style={{ fontSize:"var(--fs-65)", color:"var(--color-text-4)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>{y}</div>
          </div>
        ))}
        <div style={{ position:"absolute", bottom:0, right:0, textAlign:"center" }}>
          <div style={{ width:1, height:4, background:"var(--color-normal)", margin:"0 auto 2px" }}/>
          <div style={{ fontSize:"var(--fs-62)", color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>NOW</div>
        </div>
        {(()=>{ const bi=months.findIndex(d=>d.src==="EST"); if(bi<0)return null; const pct=(bi/(months.length-1))*100; return <div style={{ position:"absolute", top:0, left:`${pct}%`, width:1, height:12, background:"var(--color-tension)", opacity:0.5 }}/>; })()}
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
        <span style={{ fontSize:"var(--fs-75)", color:era.color, fontFamily:"var(--font-mono)", lineHeight:"var(--lh-note)", fontWeight:"var(--fw-500)" }}>
          ⚡ {sel.note || ""}
        </span>
      </div>

      {/* Sparklines */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { label:"DAILY TRANSITS", field:"transits", color:"var(--color-normal)", unit:"/day", dec:0 },
          { label:"OIL FLOW (Mb/d)", field:"oil", color:"var(--color-conflict)", unit:"Mb/d", dec:1 },
          { label:"LNG (MT/yr)",     field:"lng",  color:"var(--color-teal)", unit:"MT/yr", dec:0 },
        ].map((s,i)=>{
          const base_v=MONTHS[0][s.field], curr=months[idx][s.field];
          const delta=((curr-base_v)/base_v*100).toFixed(1);
          return (
            <div key={i} style={{ background:"var(--color-bg-spark)", borderRadius:7, padding:"9px 11px" }}>
              <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-62)", letterSpacing:2, fontFamily:"var(--font-mono)", marginBottom:4, fontWeight:"var(--fw-500)" }}>{s.label}</div>
              <Spark data={months} field={s.field} color={s.color} w={190} h={36} selIdx={idx}/>
              <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-90)", color:s.color, fontWeight:"var(--fw-600)" }}>{months[idx][s.field].toFixed(s.dec)}<span style={{ fontSize:"0.65em", opacity:0.6, marginLeft:2 }}>{s.unit}</span></span>
                {idx>0&&<span style={{ fontSize:"var(--fs-65)", color:parseFloat(delta)>=0?"var(--color-normal)":"var(--color-conflict)", fontWeight:"var(--fw-500)" }}>{parseFloat(delta)>=0?"▲":"▼"}{Math.abs(delta)}% vs Jan'23</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:14, marginTop:11, flexWrap:"wrap", alignItems:"center" }}>
        {Object.entries(ERA).map(([k,v])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"var(--fs-67)", color:"var(--color-text-3)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>
            <div style={{ width:8, height:8, borderRadius:2, background:v.color, opacity:0.75 }}/>{v.label}
          </div>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:12 }}>
          <span style={{ fontSize:"var(--fs-65)", color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>▓ EIA Verified</span>
          <span style={{ fontSize:"var(--fs-65)", color:"var(--color-tension)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>░ Modeled Est.</span>
        </div>
      </div>
    </div>
  );
};
