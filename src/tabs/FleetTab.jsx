import { VESSEL_TYPES, FLAGS } from "../data/index.js";
import { Bar } from "../components/Bar.jsx";

export const FleetTab = ({ era, ratio, hFlag, setHFlag }) => (
  <div>
    <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:14, marginBottom:14 }}>
      <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:13 }}>
          <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>VESSEL TYPE COMPOSITION (SCALED TO PERIOD)</div>
          <span style={{ fontSize:"var(--fs-62)", color:"var(--color-tension)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>~ Lloyd's/AIS baseline</span>
        </div>
        {VESSEL_TYPES.map((v,i)=>(
          <div key={i} style={{ display:"grid", gridTemplateColumns:"22px 180px 50px 72px 1fr 50px", alignItems:"center", gap:8, padding:"8px 0", borderBottom:"1px solid var(--color-border-row)" }}>
            <span style={{ fontSize:"0.9rem" }}>{v.icon}</span>
            <div>
              <div style={{ fontSize:"var(--fs-76)", fontWeight:"var(--fw-600)" }}>{v.type}</div>
              <div style={{ fontSize:"var(--fs-65)", color:"var(--color-text-4)", marginTop:1, fontWeight:"var(--fw-500)" }}>{v.sizeM}m · {(v.avgDwt/1000).toFixed(0)}k DWT</div>
            </div>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-75)", color:v.color, textAlign:"right", fontWeight:"var(--fw-500)" }}>{Math.round(v.count*ratio)}</span>
            <span style={{ fontSize:"var(--fs-65)", color:"var(--color-text-3)", textAlign:"center", fontWeight:"var(--fw-500)" }}>{v.direction}</span>
            <Bar value={v.pct} max={30} color={v.color} h={4}/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-68)", color:"var(--color-text-4)", textAlign:"right", fontWeight:"var(--fw-500)" }}>{v.pct}%</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px", flex:1 }}>
          <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", marginBottom:13, fontWeight:"var(--fw-600)" }}>TANKER SIZE CLASSES</div>
          {[
            { name:"ULCC",      dwt:">320k",    len:"380m+",    note:"Rare" },
            { name:"VLCC",      dwt:"200–320k", len:"300–330m", note:"Primary crude" },
            { name:"Suezmax",   dwt:"120–200k", len:"270m",     note:"Crude/Prod" },
            { name:"Aframax",   dwt:"80–120k",  len:"250m",     note:"Regional" },
            { name:"Panamax",   dwt:"60–80k",   len:"220m",     note:"Products" },
            { name:"MR Tanker", dwt:"25–55k",   len:"180m",     note:"Refined" },
            { name:"Handysize", dwt:"<25k",     len:"120–170m", note:"Coastal" },
          ].map((s,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--color-border-row)", fontSize:"var(--fs-74)" }}>
              <span style={{ color:era.color, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-700)", width:72 }}>{s.name}</span>
              <span style={{ color:"var(--color-text-1)", fontWeight:"var(--fw-500)" }}>{s.dwt}</span>
              <span style={{ color:"var(--color-text-3)", fontWeight:"var(--fw-500)" }}>{s.len}</span>
              <span style={{ color:"var(--color-text-5)", fontSize:"var(--fs-65)", fontWeight:"var(--fw-500)" }}>{s.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:13 }}>
        <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>FLAG STATE REGISTRY (AIS / LLOYD'S 2023–2024 BASELINE)</div>
        <span style={{ fontSize:"var(--fs-62)", color:"var(--color-tension)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>~ WorldwideAIS / Lloyd's List Intelligence</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:7 }}>
        {FLAGS.map((f,i)=>(
          <div key={i} onMouseEnter={()=>setHFlag(i)} onMouseLeave={()=>setHFlag(null)}
            style={{ padding:"9px 11px", background:hFlag===i?"rgba(0,201,167,0.05)":"rgba(255,255,255,0.02)", border:`1px solid ${hFlag===i?f.color:"var(--color-border-card)"}`, borderRadius:7, cursor:"default", transition:"all 0.2s" }}>
            <div style={{ fontSize:"var(--fs-78)", fontWeight:"var(--fw-600)", color:f.color, marginBottom:2 }}>{f.flag}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-85)", color:"var(--color-white)", fontWeight:"var(--fw-500)" }}>{f.vessels}</div>
            <div style={{ fontSize:"var(--fs-63)", color:"var(--color-text-4)", marginTop:2, fontWeight:"var(--fw-500)" }}>{f.pct}% · {f.type}</div>
            <div style={{ marginTop:5 }}><Bar value={f.pct} max={16} color={f.color} h={3}/></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
