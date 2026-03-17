import { useState, useEffect } from "react";

export const Ticker = ({ value, unit, dec=1, color="var(--color-normal)", size="var(--fs-160)" }) => {
  const [d, setD] = useState(0);
  useEffect(() => {
    let s=0; const e=parseFloat(value)||0, step=(e/700)*16;
    if(e===0){setD(0);return;}
    const t = setInterval(()=>{ s+=step; if(s>=e){setD(e);clearInterval(t);}else setD(s); },16);
    return ()=>clearInterval(t);
  }, [value]);
  return <span style={{ color, fontFamily:"var(--font-mono)", fontWeight:"var(--fw-700)", fontSize:size }}>{d.toFixed(dec)}<span style={{ fontSize:"0.72em", opacity:0.6, marginLeft:3 }}>{unit}</span></span>;
};
