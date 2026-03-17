export const Donut = ({ data, size=130 }) => {
  const total = data.reduce((s,d)=>s+d.share,0);
  let cum = -90;
  const cx=size/2, cy=size/2, r=size/2-8, ir=r*0.6;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d,i)=>{
        const angle=(d.share/total)*360, st=cum; cum+=angle;
        const rad=a=>(a*Math.PI)/180;
        const x1=cx+r*Math.cos(rad(st)),y1=cy+r*Math.sin(rad(st));
        const x2=cx+r*Math.cos(rad(st+angle)),y2=cy+r*Math.sin(rad(st+angle));
        const ix1=cx+ir*Math.cos(rad(st)),iy1=cy+ir*Math.sin(rad(st));
        const ix2=cx+ir*Math.cos(rad(st+angle)),iy2=cy+ir*Math.sin(rad(st+angle));
        const lg=angle>180?1:0;
        return <path key={i} d={`M${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${lg},0 ${ix1},${iy1} Z`} fill={d.color} opacity={0.88}/>;
      })}
    </svg>
  );
};
