import { PRODUCERS, DESTINATIONS, SRC_COLOR } from "../data/index.js";
import { Bar } from "../components/Bar.jsx";
import { Donut } from "../components/Donut.jsx";
import HormuzLiveMap from "../HormuzLiveMap.jsx";

export const OverviewTab = ({ era, sel, ratio }) => (
  <div>
    <div style={{ background:`linear-gradient(135deg,rgba(0,201,167,0.03),${era.bg})`, border:`1px solid ${era.border}`, borderRadius:12, padding:"14px 20px", marginBottom:14, display:"flex", gap:24, alignItems:"center" }}>
      <svg width={240} height={100} viewBox="0 0 240 100" style={{flexShrink:0}}>
        <ellipse cx={50} cy={50} rx={45} ry={34} fill="rgba(0,100,180,0.1)" stroke="rgba(0,150,200,0.22)" strokeWidth={1}/>
        <text x={50} y={53} fill="#778899" fontSize={7} textAnchor="middle" fontFamily="JetBrains Mono">PERSIAN GULF</text>
        <rect x={93} y={34} width={54} height={32} rx={4} fill={era.bg} stroke={era.color} strokeWidth={1.5}/>
        <text x={120} y={48} fill={era.color} fontSize={7} textAnchor="middle" fontFamily="JetBrains Mono">HORMUZ</text>
        <text x={120} y={59} fill={era.color} fontSize={6} textAnchor="middle" fontFamily="JetBrains Mono">21 nm wide</text>
        <ellipse cx={190} cy={50} rx={45} ry={34} fill="rgba(0,60,120,0.1)" stroke="rgba(0,100,180,0.18)" strokeWidth={1}/>
        <text x={190} y={53} fill="#778899" fontSize={7} textAnchor="middle" fontFamily="JetBrains Mono">GULF OF OMAN</text>
        <line x1={96} y1={44} x2={57} y2={44} stroke="#e84b3a" strokeWidth={1.8} strokeDasharray="4,2"/>
        <line x1={96} y1={56} x2={57} y2={56} stroke="#00c9a7" strokeWidth={1.8} strokeDasharray="4,2"/>
        <line x1={147} y1={44} x2={184} y2={44} stroke="#00c9a7" strokeWidth={1.8} strokeDasharray="4,2"/>
        <line x1={147} y1={56} x2={184} y2={56} stroke="#e84b3a" strokeWidth={1.8} strokeDasharray="4,2"/>
        <text x={68} y={38} fill="#e84b3a" fontSize={5.5} fontFamily="JetBrains Mono">← OUTBOUND</text>
        <text x={68} y={68} fill="#00c9a7" fontSize={5.5} fontFamily="JetBrains Mono">→ INBOUND</text>
        <text x={149} y={38} fill="#00c9a7" fontSize={5.5} fontFamily="JetBrains Mono">OUT →</text>
        <text x={149} y={68} fill="#e84b3a" fontSize={5.5} fontFamily="JetBrains Mono">← IN</text>
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
              <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:2, fontFamily:"var(--font-mono)", textTransform:"uppercase", fontWeight:"var(--fw-500)" }}>{s.l}</div>
              <div style={{ fontSize:"var(--fs-58)", color:SRC_COLOR[s.src]||"var(--color-text-4)", fontFamily:"var(--font-mono)", opacity:0.8, fontWeight:"var(--fw-500)" }}>[{s.src}]</div>
            </div>
            <div style={{ color:s.c||era.color, fontSize:"var(--fs-95)", fontWeight:"var(--fw-700)", margin:"2px 0" }}>{s.v}</div>
            <div style={{ color:"var(--color-text-3)", fontSize:"var(--fs-72)", lineHeight:"var(--lh-tight)", fontWeight:"var(--fw-500)" }}>{s.s}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
          <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>CRUDE EXPORT SHARE BY PRODUCER</div>
          <span style={{ fontSize:"var(--fs-62)", color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>✓ EIA 2024</span>
        </div>
        {PRODUCERS.map((p,i)=>(
          <div key={i} style={{ marginBottom:11 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:"var(--fs-82)", fontWeight:"var(--fw-600)" }}>{p.country}</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-75)", color:p.color, fontWeight:"var(--fw-500)" }}>{p.share}% · {p.mbpd} Mb/d</span>
            </div>
            <Bar value={p.share} max={42} color={p.color} h={5}/>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--color-bg-card)", border:"1px solid var(--color-border-card)", borderRadius:11, padding:"16px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
          <div style={{ color:"var(--color-text-4)", fontSize:"var(--fs-65)", letterSpacing:3, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>CARGO DESTINATION BREAKDOWN</div>
          <span style={{ fontSize:"var(--fs-62)", color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-500)" }}>✓ EIA 2024 / IEA</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <Donut data={DESTINATIONS} size={120}/>
          <div style={{ flex:1 }}>
            {DESTINATIONS.map((d,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                <span style={{ fontSize:"var(--fs-78)", flex:1, fontWeight:"var(--fw-500)" }}>{d.icon} {d.region}</span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"var(--fs-72)", color:d.color, minWidth:30, textAlign:"right", fontWeight:"var(--fw-500)" }}>{d.share}%</span>
                <Bar value={d.share} max={42} color={d.color} h={4}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* LIVE AIS MAP – STRAIT OF HORMUZ */}
    <HormuzLiveMap />
  </div>
);
