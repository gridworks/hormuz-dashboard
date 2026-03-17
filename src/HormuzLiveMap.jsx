import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

const LOCAL_WS_URL =
  import.meta.env.VITE_AIS_LOCAL_WS_URL || "ws://localhost:4000/ais";

function vesselKey(v) {
  return v.mmsi ?? v.id ?? `v-${v.lat}-${v.lon}-${v.ts ?? ""}`;
}

function upsertVessel(list, v) {
  const key = vesselKey(v);
  const idx = list.findIndex((x) => vesselKey(x) === key);
  if (idx === -1) return [...list, v];
  const copy = list.slice();
  copy[idx] = { ...copy[idx], ...v };
  return copy;
}

export default function HormuzLiveMap() {
  const [vessels, setVessels] = useState([]);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(LOCAL_WS_URL);

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const v = JSON.parse(event.data);
        if (!v || v.lat == null || v.lon == null) return;
        setVessels((prev) => upsertVessel(prev, v));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Local AIS WS decode error", e);
      }
    };

    ws.onerror = () => {
      setError("AIS backend unreachable. Start it with: npm run server");
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Centered on the broader Persian Gulf, zoomed to show Hormuz plus Gulf traffic
  const center = [26.5, 52.5]; // [lat, lon]

  return (
    <div
      style={{
        background: "var(--color-bg-map)",
        border: "1px solid rgba(0,201,167,0.3)",
        borderRadius: 12,
        padding: "14px 16px",
        marginTop: 16,
      }}
    >
      <div
        style={{
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "var(--color-text-4)",
            fontSize: "var(--fs-70)",
            letterSpacing: 3,
            fontFamily: "var(--font-mono)",
          }}
        >
          LIVE AIS · PERSIAN GULF & STRAIT OF HORMUZ (REAL‑TIME)
        </div>
        <div
          style={{
            fontSize: "var(--fs-70)",
            color: connected ? "var(--color-normal)" : "var(--color-conflict)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {connected ? `${vessels.length} vessels` : "offline"}
        </div>
      </div>

      {error && (
        <div
          style={{
            color: "var(--color-conflict)",
            fontSize: "var(--fs-75)",
            marginBottom: 8,
            fontFamily: "var(--font-mono)",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {!connected && !error && (
        <div
          style={{
            color: "var(--color-text-3)",
            fontSize: "var(--fs-72)",
            marginBottom: 8,
            fontFamily: "var(--font-mono)",
          }}
        >
          Live AIS is only available when running locally with{" "}
          <span style={{ color: "var(--color-normal)" }}>npm run server</span>. On GitHub
          Pages this section will show the base map but no vessels.
        </div>
      )}

      <div style={{ height: 420, borderRadius: 10, overflow: "hidden" }}>
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {vessels.map((v) => (
            <CircleMarker
              key={vesselKey(v)}
              center={[v.lat, v.lon]}
              radius={4}
              pathOptions={{
                color: "var(--color-ais)",
                fillColor: "var(--color-ais)",
                fillOpacity: 0.9,
              }}
            >
              <Tooltip direction="top">
                <div style={{ fontSize: "var(--fs-70)" }}>
                  <div>
                    <strong>{v.name}</strong>
                  </div>
                  <div>MMSI: {v.mmsi}</div>
                  {v.sog != null && <div>SOG: {v.sog} kn</div>}
                  {v.cog != null && <div>COG: {v.cog}°</div>}
                  {v.navStatus && <div>Status: {v.navStatus}</div>}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
