export const Spark = ({ data, field, color, w=220, h=44, selIdx }) => {
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
      {(()=>{ const bi=data.findIndex(d=>d.src==="EST"); if(bi<0)return null; const bx=(bi/(data.length-1))*w; return <line key="b" x1={bx} y1={0} x2={bx} y2={h} stroke="var(--color-tension)" strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/>; })()}
      {sx!=null&&<><line x1={sx} y1={0} x2={sx} y2={h} stroke={color} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/><circle cx={sx} cy={sy} r={4} fill={color}/></>}
    </svg>
  );
};

export const BrentSpark = ({ history, w=200, h=44 }) => {
  if (!history.length) return <div style={{ width:w, height:h, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-7)", fontSize:"var(--fs-75)" }}>Loading chart…</div>;
  const vals = history.map(d=>d.price);
  const mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*w},${h-((v-mn)/rng)*(h-8)-4}`).join(" ");
  return (
    <svg width={w} height={h} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke="var(--color-tension)" strokeWidth={1.5} opacity={0.8}/>
      <circle cx={(vals.length-1)/(vals.length-1)*w} cy={h-((vals[vals.length-1]-mn)/rng)*(h-8)-4} r={3} fill="var(--color-tension)"/>
    </svg>
  );
};
