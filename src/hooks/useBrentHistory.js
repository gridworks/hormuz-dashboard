import { useState, useEffect } from "react";
import { EIA_API_KEY } from "../data/index.js";

export function useBrentHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    if (!EIA_API_KEY) return;
    fetch(`https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${EIA_API_KEY}&frequency=weekly&data[0]=value&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=52`)
      .then(r => r.json())
      .then(j => {
        const rows = (j?.response?.data || []).reverse();
        setHistory(rows.map(r => ({ date: r.period, price: parseFloat(r.value) })));
      })
      .catch(() => {});
  }, []);
  return history;
}
