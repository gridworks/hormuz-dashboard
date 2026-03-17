import { MONTHS } from "../data/index.js";

export const DataQualityBanner = ({ idx }) => {
  const sel = MONTHS[idx];
  const isLive = sel.src === "AIS";
  const isVerified = sel.src === "EIA";
  const color = isLive ? "var(--color-ais)" : isVerified ? "var(--color-normal)" : "var(--color-tension)";
  const bg = isLive ? "rgba(255,0,255,0.05)" : isVerified ? "rgba(0,201,167,0.05)" : "rgba(240,165,0,0.05)";
  return (
    <div style={{ padding:"9px 14px", borderRadius:7, marginBottom:12, display:"flex", alignItems:"center", gap:10, background:bg, border:`1px solid ${color}44`, fontSize:"var(--fs-75)", color:"var(--color-text-2)", fontWeight:"var(--fw-500)" }}>
      <span style={{ color, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-700)", whiteSpace:"nowrap" }}>{isLive?"📡 AIS TRACKED":isVerified?"✓ VERIFIED":"~ ESTIMATED"}</span>
      {isLive
        ? <span>Tracked via <strong style={{color:"var(--color-ais)"}}>AIS transponder data</strong> (CSIS/Starboard Maritime Intelligence, MarineTraffic). The Strait is <strong style={{color:"var(--color-blockade)"}}>effectively closed</strong> following US/Israel strikes on Iran (Feb 28). Figures reflect real observed collapse, not estimates. Oil flow approximate.</span>
        : isVerified
        ? <span>Oil flow figures sourced from <strong style={{color:"var(--color-text-9)"}}>EIA official annual data</strong> (World Oil Transit Chokepoints, Vortexa tanker tracking). Monthly values interpolated between verified annual anchors.</span>
        : <span>Beyond Claude's knowledge cutoff (Aug 2025). Values are modeled estimates extrapolated from EIA H1-2025 baseline. Treat as directional only.</span>
      }
    </div>
  );
};
