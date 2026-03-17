export const Bar = ({ value, max, color, h=5 }) => (
  <div style={{ background:"var(--color-bg-bar)", borderRadius:3, height:h, overflow:"hidden", flex:1 }}>
    <div style={{ width:`${Math.min(100,(value/max)*100)}%`, height:"100%", background:color, borderRadius:3, transition:"width 0.6s ease" }} />
  </div>
);
