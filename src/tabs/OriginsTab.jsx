import { SRC_COLOR } from "../data/index.js";

export const OriginsTab = ({ ratio }) => (
  <div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px" }}>
        <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", marginBottom:13, fontWeight:"var(--fw-600)" }}>MAJOR LOADING TERMINALS</div>
        {[
          { port:"Ras Tanura (Saudi Arabia)",     type:"Crude Oil",       cap:"6–8 Mb/d",    c:"var(--color-normal)",  src:"EIA" },
          { port:"Ras Laffan (Qatar)",            type:"LNG / Condensate",cap:"80 MT/yr LNG", c:"var(--color-cyan)",   src:"EIA" },
          { port:"Kharg Island (Iran)",           type:"Crude Oil",       cap:"2–2.5 Mb/d",  c:"var(--color-conflict)", src:"EIA" },
          { port:"Basra / Khor Al-Amaya (Iraq)",  type:"Crude Oil",       cap:"3.5–4 Mb/d",  c:"var(--color-blue)",   src:"EIA" },
          { port:"Jebel Ali (UAE)",               type:"Container/Mixed", cap:"22M TEU/yr",  c:"var(--color-purple)", src:"UNCTAD" },
          { port:"Shuaiba (Kuwait)",              type:"Crude/Products",  cap:"2–2.5 Mb/d",  c:"var(--color-tension)", src:"EIA" },
          { port:"Bahrain / Mina Salman",         type:"Products / LPG",  cap:"Mixed",       c:"var(--color-pink)",   src:"Est." },
        ].map((p,i)=>(
          <div key={i} style={{ padding:"8px 0", borderBottom:"1px solid var(--color-border-row)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
              <span style={{ fontWeight:"var(--fw-600)", fontSize:"var(--fs-80)", color:p.c }}>{p.port}</span>
              <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-70)", color:"var(--color-text-3)", fontWeight:"var(--fw-500)" }}>{p.cap}</span>
                <span style={{ fontSize:"var(--fs-58)", color:SRC_COLOR[p.src]||"var(--color-text-4)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>[{p.src}]</span>
              </div>
            </div>
            <div style={{ fontSize:"var(--fs-68)", color:"var(--color-text-5)", fontWeight:"var(--fw-500)" }}>{p.type}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:13 }}>
          <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>DESTINATION FLOWS (PERIOD-ADJUSTED)</div>
          <span style={{ fontSize:"var(--fs-58)", color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>✓ EIA 2024</span>
        </div>
        {[
          { r:"China",       crude:`~${(7*ratio).toFixed(1)}`,   lng:"~25",  dep:"HIGH",     c:"var(--color-conflict)", src:"EIA" },
          { r:"Japan",       crude:`~${(2.7*ratio).toFixed(1)}`, lng:"~18",  dep:"CRITICAL", c:"var(--color-red-light)", src:"EIA" },
          { r:"South Korea", crude:`~${(2.0*ratio).toFixed(1)}`, lng:"~10",  dep:"HIGH",     c:"var(--color-yellow)",  src:"EIA" },
          { r:"India",       crude:`~${(2.5*ratio).toFixed(1)}`, lng:"~8",   dep:"HIGH",     c:"var(--color-green-2)", src:"EIA" },
          { r:"SE Asia",     crude:`~${(1.2*ratio).toFixed(1)}`, lng:"~8",   dep:"MOD.",     c:"var(--color-blue-light)", src:"EIA" },
          { r:"Europe",      crude:`~${(1.5*ratio).toFixed(1)}`, lng:"12–14%",dep:"MOD-HIGH",c:"var(--color-purple-dark)", src:"IEA" },
        ].map((d,i)=>(
          <div key={i} style={{ padding:"9px 0", borderBottom:"1px solid var(--color-border-row)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontWeight:"var(--fw-700)", fontSize:"var(--fs-82)", color:d.c }}>{d.r}</span>
              <span style={{ fontSize:"var(--fs-65)", color:d.dep==="CRITICAL"?"var(--color-conflict)":d.dep==="HIGH"?"var(--color-tension)":"var(--color-text-3)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>{d.dep}</span>
            </div>
            <div style={{ display:"flex", gap:14, fontSize:"var(--fs-70)", color:"var(--color-text-3)", fontWeight:"var(--fw-500)" }}>
              <span>🛢️ <strong style={{color:"var(--color-text-9)"}}>{d.crude} Mb/d</strong></span>
              <span>🔵 <strong style={{color:"var(--color-text-9)"}}>{d.lng} MT/yr</strong></span>
              <span style={{ marginLeft:"auto", fontSize:"var(--fs-58)", color:SRC_COLOR[d.src]||"var(--color-text-4)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>[{d.src}]</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ marginTop:12, background:"rgba(0,201,167,0.02)", border:"1px solid rgba(0,201,167,0.07)", borderRadius:9, padding:"13px 16px" }}>
      <div style={{ color:"var(--color-normal)", fontSize:"var(--fs-67)", letterSpacing:3, fontFamily:"var(--font-mono)", marginBottom:8, fontWeight:"var(--fw-600)" }}>📡 DATA SOURCES, ACCURACY & LIVE WIRING</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, fontSize:"var(--fs-72)", color:"var(--color-text-3)", fontWeight:"var(--fw-500)" }}>
        <div><strong style={{color:"var(--color-normal)"}}>✓ EIA Verified</strong><br/>2022–H1 2025 oil flows: EIA World Chokepoints report (Vortexa tanker tracking). Annual anchors only — monthly values interpolated.</div>
        <div><strong style={{color:"var(--color-tension)"}}>~ Modeled Estimates</strong><br/>H2 2025 onwards: extrapolated from EIA H1-2025 baseline + geopolitical events. Treat as directional.</div>
        <div><strong style={{color:"var(--color-tension)"}}>📡 Live Brent Price</strong><br/>Pulled from EIA API v2 (with key) or Yahoo Finance via CORS proxy (no key). Refreshes every 5 min. Add VITE_EIA_API_KEY to .env for official data.</div>
        <div><strong style={{color:"var(--color-tension)"}}>🚢 Vessel Counts</strong><br/>Lloyd's List Intelligence / WorldwideAIS baseline (2023–2024). No live AIS feed — requires MarineTraffic or Kpler enterprise subscription ($$$).</div>
      </div>
    </div>
  </div>
);
