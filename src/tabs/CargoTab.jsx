import { CARGO } from "../data/index.js";
import { Bar } from "../components/Bar.jsx";

export const CargoTab = ({ era, sel, ratio }) => {
  const totalVal = CARGO.reduce((s,c)=>s+c.annualValueB,0);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:11, marginBottom:14 }}>
        {CARGO.map((c,i)=>(
          <div key={i} style={{ background:"var(--color-bg-card)", border:`1px solid ${c.color}18`, borderLeft:`3px solid ${c.color}`, borderRadius:9, padding:"13px 15px", display:"grid", gridTemplateColumns:"34px 1fr auto", gap:11, alignItems:"center" }}>
            <span style={{ fontSize:"1.3rem" }}>{c.icon}</span>
            <div>
              <div style={{ fontWeight:"var(--fw-700)", fontSize:"var(--fs-87)", marginBottom:3 }}>{c.name}</div>
              <div style={{ fontSize:"var(--fs-68)", color:"var(--color-text-3)", fontWeight:"var(--fw-500)" }}>
                {c.dailyMbbl&&`${(c.dailyMbbl*ratio).toFixed(1)} Mb/d · `}
                {c.dailyMt&&`${(c.dailyMt*ratio).toFixed(2)} Mt/d · `}
                {c.dailyTEU&&`${Math.round(c.dailyTEU*ratio).toLocaleString()} TEU/d · `}
                Est. {Math.round(c.annualMt*ratio)} MT/yr
              </div>
              <div style={{ marginTop:5 }}><Bar value={c.annualValueB*ratio} max={450} color={c.color} h={4}/></div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"var(--font-mono)", color:c.color, fontSize:"var(--fs-95)", fontWeight:"var(--fw-700)" }}>${(c.annualValueB*ratio).toFixed(0)}B</div>
              <div style={{ fontSize:"var(--fs-62)", color:"var(--color-text-4)", marginTop:2, fontWeight:"var(--fw-500)" }}>annual est.</div>
              {ratio<0.97&&<div style={{ fontSize:"var(--fs-62)", color:"var(--color-conflict)", marginTop:2, fontWeight:"var(--fw-500)" }}>↓{((1-ratio)*100).toFixed(0)}%</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:11 }}>
        {[
          { l:"TOTAL ANNUAL VALUE",  v:`$${(totalVal*ratio).toFixed(0)}B`, s:`~$${(totalVal*ratio/365).toFixed(1)}B/day · EIA est. $600B/yr normal`, c:era.color },
          { l:"GLOBAL OIL SUPPLY",   v:`~${(20*ratio).toFixed(0)}%`,       s:sel.src==="EIA"?"EIA verified":"Scaled from EIA baseline", c:"var(--color-conflict)" },
          { l:"GLOBAL LNG SUPPLY",   v:"~20%",                             s:"EIA 2024 — Qatar primary source", c:"var(--color-teal)" },
        ].map((s,i)=>(
          <div key={i} style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:9, padding:"15px 18px", textAlign:"center" }}>
            <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", marginBottom:8, fontWeight:"var(--fw-600)" }}>{s.l}</div>
            <div style={{ color:s.c, fontSize:"var(--fs-160)", fontWeight:"var(--fw-700)", fontFamily:"var(--font-mono)" }}>{s.v}</div>
            <div style={{ color:"var(--color-text-3)", fontSize:"var(--fs-72)", marginTop:5, fontWeight:"var(--fw-500)" }}>{s.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
