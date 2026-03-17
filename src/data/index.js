export const EIA_API_KEY = import.meta?.env?.VITE_EIA_API_KEY || "";

export const MONTHS = [
  { id:"2023-01", label:"Jan 2023", transits:106, oil:21.0, lng:77, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-02", label:"Feb 2023", transits:105, oil:21.0, lng:77, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-03", label:"Mar 2023", transits:107, oil:21.0, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-04", label:"Apr 2023", transits:108, oil:21.0, lng:78, dwt:10.3, era:"normal",  src:"EIA", note:null },
  { id:"2023-05", label:"May 2023", transits:107, oil:20.9, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:"IRGC seized Marshall Is. tanker. OPEC+ voluntary cuts begin reducing crude volumes." },
  { id:"2023-06", label:"Jun 2023", transits:106, oil:20.8, lng:77, dwt:10.1, era:"normal",  src:"EIA", note:"OPEC+ cuts take effect — crude & condensate volumes decline, partially offset by products." },
  { id:"2023-07", label:"Jul 2023", transits:108, oil:20.8, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-08", label:"Aug 2023", transits:107, oil:20.8, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:null },
  { id:"2023-09", label:"Sep 2023", transits:108, oil:20.9, lng:79, dwt:10.3, era:"normal",  src:"EIA", note:null },
  { id:"2023-10", label:"Oct 2023", transits:107, oil:20.9, lng:78, dwt:10.2, era:"normal",  src:"EIA", note:"Oct 7 Hamas attack — insurance risk premiums spike. No Hormuz disruption." },
  { id:"2023-11", label:"Nov 2023", transits:106, oil:20.8, lng:77, dwt:10.1, era:"tension", src:"EIA", note:"Houthi attacks begin on Red Sea / Gulf shipping. War-risk zones expanded." },
  { id:"2023-12", label:"Dec 2023", transits:104, oil:20.7, lng:77, dwt:10.0, era:"tension", src:"EIA", note:"Operation Prosperity Guardian. Container lines divert to Cape of Good Hope." },
  { id:"2024-01", label:"Jan 2024", transits:103, oil:20.2, lng:76, dwt:9.9,  era:"tension", src:"EIA", note:"Suez Canal traffic -50%. Saudi Arabia boosts East-West pipeline to avoid Bab el-Mandeb." },
  { id:"2024-02", label:"Feb 2024", transits:104, oil:20.1, lng:77, dwt:10.0, era:"tension", src:"EIA", note:null },
  { id:"2024-03", label:"Mar 2024", transits:105, oil:20.1, lng:77, dwt:10.0, era:"tension", src:"EIA", note:"US/UK airstrikes on Houthi Yemen targets. Hormuz unaffected." },
  { id:"2024-04", label:"Apr 2024", transits:105, oil:20.0, lng:77, dwt:10.1, era:"tension", src:"EIA", note:"Iran direct missile/drone attack on Israel (Apr 13). Gulf insurance premiums surge." },
  { id:"2024-05", label:"May 2024", transits:106, oil:20.1, lng:78, dwt:10.1, era:"tension", src:"EIA", note:null },
  { id:"2024-06", label:"Jun 2024", transits:105, oil:20.0, lng:77, dwt:10.0, era:"tension", src:"EIA", note:null },
  { id:"2024-07", label:"Jul 2024", transits:104, oil:19.9, lng:77, dwt:10.0, era:"tension", src:"EIA", note:"Houthi drones reach Tel Aviv. Iran rhetoric re: Hormuz intensifies." },
  { id:"2024-08", label:"Aug 2024", transits:103, oil:19.8, lng:76, dwt:9.9,  era:"tension", src:"EIA", note:"Iran threatens Hormuz closure in retaliation for Israel strikes on Lebanon." },
  { id:"2024-09", label:"Sep 2024", transits:104, oil:19.9, lng:77, dwt:9.9,  era:"tension", src:"EIA", note:null },
  { id:"2024-10", label:"Oct 2024", transits:103, oil:19.8, lng:76, dwt:9.8,  era:"tension", src:"EIA", note:"Israel strikes Iran (Oct 26). VLCC war-risk premiums spike 300–400%." },
  { id:"2024-11", label:"Nov 2024", transits:102, oil:19.7, lng:75, dwt:9.7,  era:"tension", src:"EIA", note:"US election. Iran repositions IRGC naval assets. Ghost fleet activity elevated." },
  { id:"2024-12", label:"Dec 2024", transits:100, oil:19.5, lng:75, dwt:9.6,  era:"tension", src:"EIA", note:"US carrier groups repositioned to Gulf region. IRGC exercises near strait." },
  { id:"2025-01", label:"Jan 2025", transits:101, oil:20.4, lng:76, dwt:9.7,  era:"tension",    src:"EIA", note:"EIA H1-2025: flows 'remained relatively flat vs 2024'. Last pre-escalation month." },
  { id:"2025-02", label:"Feb 2025", transits:98,  oil:20.2, lng:74, dwt:9.4,  era:"escalation", src:"EST", note:"US Navy formally deploys additional carrier strike group to Gulf." },
  { id:"2025-03", label:"Mar 2025", transits:93,  oil:19.5, lng:71, dwt:8.9,  era:"escalation", src:"EST", note:"US airstrikes on Houthi Yemen positions intensify. War-risk zones expanded Gulf-wide." },
  { id:"2025-04", label:"Apr 2025", transits:87,  oil:18.5, lng:68, dwt:8.4,  era:"escalation", src:"EST", note:"Iran threatens 'reciprocal measures'. IRGC naval exercises visible on AIS." },
  { id:"2025-05", label:"May 2025", transits:84,  oil:17.8, lng:66, dwt:8.1,  era:"escalation", src:"EST", note:"Some Asian buyers temporarily shift to pipeline/alternative routes." },
  { id:"2025-06", label:"Jun 2025", transits:82,  oil:17.2, lng:64, dwt:7.9,  era:"conflict",   src:"EST", note:"IRGC harassment of non-Iranian tankers reported. P&I clubs revise war exclusion clauses." },
  { id:"2025-07", label:"Jul 2025", transits:80,  oil:16.8, lng:63, dwt:7.6,  era:"conflict",   src:"EST", note:"US-Iran back-channel talks. Ghost fleet significantly above seasonal average." },
  { id:"2025-08", label:"Aug 2025", transits:82,  oil:17.0, lng:63, dwt:7.8,  era:"conflict",   src:"EST", note:"Partial stabilization. Saudi/UAE diplomatic channels active." },
  { id:"2025-09", label:"Sep 2025", transits:84,  oil:17.3, lng:64, dwt:8.0,  era:"conflict",   src:"EST", note:"Seasonal Asian crude demand supports partial traffic recovery attempt." },
  { id:"2025-10", label:"Oct 2025", transits:85,  oil:17.5, lng:65, dwt:8.1,  era:"conflict",   src:"EST", note:null },
  { id:"2025-11", label:"Nov 2025", transits:83,  oil:17.2, lng:64, dwt:7.9,  era:"conflict",   src:"EST", note:"Iran OPEC+ negotiating posture hardens. Sanctioned tanker activity elevated." },
  { id:"2025-12", label:"Dec 2025", transits:81,  oil:16.9, lng:63, dwt:7.7,  era:"conflict",   src:"EST", note:"Year-end: traffic ~24% below 2023 normal baseline." },
  { id:"2026-01", label:"Jan 2026", transits:82,  oil:17.0, lng:63, dwt:7.8,  era:"conflict",   src:"EST", note:"Maersk resumes Suez Canal usage (Jan 2026). Hormuz traffic still suppressed." },
  { id:"2026-02", label:"Feb 2026", transits:153, oil:20.5, lng:77, dwt:14.5, era:"conflict",   src:"AIS", note:"Pre-crisis baseline: 153 transits/day (CSIS/Starboard AIS data). US & Israel strike Iran Feb 28 — Khamenei killed. IRGC closes strait immediately." },
  { id:"2026-03", label:"Mar 2026", transits:13,  oil:2.1,  lng:8,  dwt:1.2,  era:"blockade",   src:"AIS", note:"TODAY — STRAIT EFFECTIVELY CLOSED. 90%+ traffic collapse since Mar 1. ~7–13 vessels/day (AIS, MarineTraffic). Only shadow fleet & Iranian vessels transiting. P&I insurance withdrawn Mar 5. 400+ tankers anchored in Persian Gulf. QatarEnergy force majeure on LNG Mar 4. IEA releasing 400M bbl emergency reserves. Oil approaching $200/bbl warnings." },
];

export const ERA = {
  normal:     { color:"#00c9a7", label:"Normal Operations",      bg:"rgba(0,201,167,0.08)",   border:"rgba(0,201,167,0.3)"  },
  tension:    { color:"#f0a500", label:"Elevated Tension",       bg:"rgba(240,165,0,0.08)",   border:"rgba(240,165,0,0.3)"  },
  escalation: { color:"#f07b3f", label:"Active Escalation",      bg:"rgba(240,123,63,0.08)",  border:"rgba(240,123,63,0.3)" },
  conflict:   { color:"#e84b3a", label:"Conflict-Affected Zone", bg:"rgba(232,75,58,0.08)",   border:"rgba(232,75,58,0.3)"  },
  blockade:   { color:"#ff00ff", label:"⚠ EFFECTIVELY CLOSED",   bg:"rgba(255,0,255,0.10)",   border:"rgba(255,0,255,0.5)"  },
};

export const SRC_COLOR = { EIA:"#00c9a7", EST:"#f0a500", AIS:"#ff79c6" };
export const SRC_LABEL = { EIA:"✓ EIA Verified", EST:"~ Modeled Estimate", AIS:"📡 AIS/Live Tracked" };

export const VESSEL_TYPES = [
  { type:"VLCC (>200k DWT)",           count:134, pct:24, avgDwt:300000, color:"#e84b3a", icon:"🛢️", direction:"80% outbound", sizeM:300 },
  { type:"Suezmax (120–200k DWT)",     count:63,  pct:11, avgDwt:160000, color:"#f07b3f", icon:"🛢️", direction:"75% outbound", sizeM:270 },
  { type:"Aframax (80–120k DWT)",      count:106, pct:19, avgDwt:100000, color:"#f0a500", icon:"⛽", direction:"65% outbound", sizeM:250 },
  { type:"LNG Carrier (Q-Max/Q-Flex)", count:88,  pct:16, avgDwt:215000, color:"#00c9a7", icon:"🔵", direction:"95% outbound", sizeM:340 },
  { type:"LPG Carrier",                count:75,  pct:13, avgDwt:50000,  color:"#4ecdc4", icon:"💨", direction:"85% outbound", sizeM:200 },
  { type:"Bulk Carrier",               count:145, pct:26, avgDwt:75000,  color:"#6c5ce7", icon:"📦", direction:"60% inbound",  sizeM:220 },
  { type:"Container Ship",             count:98,  pct:18, avgDwt:60000,  color:"#a29bfe", icon:"🏗️", direction:"55% inbound",  sizeM:240 },
  { type:"Product Tanker (MR/Pan)",    count:82,  pct:15, avgDwt:50000,  color:"#fd79a8", icon:"⛽", direction:"70% outbound", sizeM:180 },
];

export const FLAGS = [
  { flag:"Panama",          vessels:209, pct:14.2, type:"Flag of Conv.", color:"#e84b3a" },
  { flag:"Marshall Islands",vessels:162, pct:11.0, type:"Flag of Conv.", color:"#f07b3f" },
  { flag:"Liberia",         vessels:154, pct:10.5, type:"Flag of Conv.", color:"#f0a500" },
  { flag:"Singapore",       vessels:98,  pct:6.7,  type:"National",      color:"#00b894" },
  { flag:"Greece",          vessels:87,  pct:5.9,  type:"National",      color:"#0984e3" },
  { flag:"China (PRC)",     vessels:78,  pct:5.3,  type:"National",      color:"#d63031" },
  { flag:"Japan",           vessels:71,  pct:4.8,  type:"National",      color:"#74b9ff" },
  { flag:"South Korea",     vessels:62,  pct:4.2,  type:"National",      color:"#a29bfe" },
  { flag:"India",           vessels:55,  pct:3.7,  type:"National",      color:"#fdcb6e" },
  { flag:"UAE / Saudi",     vessels:48,  pct:3.3,  type:"National",      color:"#55efc4" },
  { flag:"Iran",            vessels:31,  pct:2.1,  type:"Sanctioned",    color:"#636e72" },
  { flag:"Other / FoC",     vessels:366, pct:28.3, type:"Mixed",         color:"#b2bec3" },
];

export const CARGO = [
  { name:"Crude Oil",           dailyMbbl:14.2, annualMt:692, annualValueB:405, pct:71, color:"#e84b3a", icon:"🛢️" },
  { name:"LNG",                 dailyMt:0.21,   annualMt:77,  annualValueB:92,  pct:20, color:"#00c9a7", icon:"🔵" },
  { name:"Petroleum Products",  dailyMbbl:3.8,  annualMt:180, annualValueB:105, pct:19, color:"#f0a500", icon:"⛽" },
  { name:"LPG / Propane",       dailyMt:0.08,   annualMt:29,  annualValueB:18,  pct:4,  color:"#4ecdc4", icon:"💨" },
  { name:"Container Goods",     dailyTEU:12000, annualMt:85,  annualValueB:220, pct:9,  color:"#a29bfe", icon:"📦" },
  { name:"Fertilizer / Bulk",   dailyMt:0.12,   annualMt:44,  annualValueB:22,  pct:6,  color:"#6c5ce7", icon:"🌾" },
  { name:"Aluminum / Metals",   dailyMt:0.04,   annualMt:15,  annualValueB:35,  pct:2,  color:"#fd79a8", icon:"⚙️" },
  { name:"Food / Grain (In)",   dailyMt:0.15,   annualMt:55,  annualValueB:28,  pct:7,  color:"#fdcb6e", icon:"🌾" },
];

export const PRODUCERS = [
  { country:"Saudi Arabia", share:38.0, mbpd:5.5, color:"#00b894", src:"EIA 2024" },
  { country:"Iraq",         share:22.0, mbpd:3.2, color:"#0984e3", src:"EIA 2024" },
  { country:"UAE",          share:13.0, mbpd:1.9, color:"#6c5ce7", src:"EIA 2024" },
  { country:"Iran",         share:12.0, mbpd:1.7, color:"#e84b3a", src:"EIA 2024" },
  { country:"Kuwait",       share:9.0,  mbpd:1.3, color:"#f0a500", src:"EIA 2024" },
  { country:"Qatar (LNG)",  share:6.0,  mbpd:0.9, color:"#00c9a7", src:"EIA 2024" },
];

export const DESTINATIONS = [
  { region:"China",       share:37, color:"#e84b3a", icon:"🇨🇳" },
  { region:"India",       share:15, color:"#6bcb77", icon:"🇮🇳" },
  { region:"Japan",       share:11, color:"#ff6b6b", icon:"🇯🇵" },
  { region:"South Korea", share:12, color:"#ffd93d", icon:"🇰🇷" },
  { region:"SE Asia",     share:9,  color:"#4d96ff", icon:"🌏" },
  { region:"Europe",      share:13, color:"#845ec2", icon:"🇪🇺" },
  { region:"Other",       share:3,  color:"#b2bec3", icon:"🌍" },
];
