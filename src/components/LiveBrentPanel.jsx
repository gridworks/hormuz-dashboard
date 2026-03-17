import { BrentSpark } from "./Spark.jsx";

export const LiveBrentPanel = ({ brent, history }) => {
  const up = brent.change >= 0;
  return (
    <div style={{ background:"var(--color-bg-panel)", border:`1px solid ${up?"rgba(0,201,167,0.3)":"rgba(232,75,58,0.3)"}`, borderRadius:10, padding:"14px 18px", marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            {brent.loading
              ? <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--color-text-4)", animation:"blink 1s infinite" }}/>
              : <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--color-normal)", boxShadow:"0 0 6px var(--color-normal)", animation:"blink 2s infinite" }}/>
            }
            <span style={{ color:"var(--color-normal)", fontFamily:"var(--font-mono)", fontSize:"var(--fs-67)", letterSpacing:3, textTransform:"uppercase", fontWeight:"var(--fw-500)" }}>
              {brent.loading ? "FETCHING LIVE DATA…" : `LIVE · ${brent.source}`}
            </span>
          </div>
          <div style={{ fontSize:"var(--fs-72)", color:"var(--color-text-4)", fontFamily:"var(--font-mono)", marginBottom:6, fontWeight:"var(--fw-600)" }}>BRENT CRUDE SPOT PRICE (USD/bbl)</div>
          {brent.loading
            ? <div style={{ color:"var(--color-text-4)", fontFamily:"var(--font-mono)", fontSize:"var(--fs-180)", fontWeight:"var(--fw-500)" }}>—</div>
            : (
              <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                <span style={{ color:"var(--color-tension)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-700)", fontSize:"var(--fs-210)" }}>${brent.price?.toFixed(2)}</span>
                {brent.change!=null&&(
                  <span style={{ fontSize:"var(--fs-95)", color:up?"var(--color-normal)":"var(--color-conflict)", fontFamily:"var(--font-mono)", fontWeight:"var(--fw-600)" }}>
                    {up?"▲":"▼"} {Math.abs(brent.change).toFixed(2)} ({up?"+":""}{brent.changePercent?.toFixed(2)}%)
                  </span>
                )}
              </div>
            )
          }
          {brent.error&&<div style={{ fontSize:"var(--fs-72)", color:"var(--color-tension)", fontFamily:"var(--font-mono)", marginTop:4, fontWeight:"var(--fw-500)" }}>⚠ {brent.error}</div>}
          <div style={{ fontSize:"var(--fs-67)", color:"var(--color-text-7)", fontFamily:"var(--font-mono)", marginTop:3, fontWeight:"var(--fw-500)" }}>
            {brent.ts ? `As of ${brent.ts}` : ""}
            {" · Updates every 5 min · Set VITE_EIA_API_KEY for official EIA data"}
          </div>
        </div>
        <div>
          <div style={{ fontSize:"var(--fs-65)", color:"var(--color-text-4)", fontFamily:"var(--font-mono)", marginBottom:4, fontWeight:"var(--fw-500)" }}>52-WEEK BRENT (EIA weekly)</div>
          <BrentSpark history={history} w={200} h={44}/>
          {!history.length&&<div style={{ fontSize:"var(--fs-67)", color:"var(--color-text-7)", fontFamily:"var(--font-mono)", marginTop:2, fontWeight:"var(--fw-500)" }}>Add VITE_EIA_API_KEY to .env for chart</div>}
        </div>
      </div>
    </div>
  );
};
