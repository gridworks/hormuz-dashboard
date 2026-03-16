import http from "http";
import express from "express";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";

dotenv.config();

const AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream";

// Approximate bounding box for the wider Persian Gulf (lat, lon)
// This covers Kuwait / Iraq in the northwest down to the Strait of Hormuz.
const HORMUZ_BOUNDING_BOX = [
  [
    [23.0, 48.0], // south‑west corner (near Saudi/Qatar)
    [30.5, 58.0], // north‑east corner (near Iran / Gulf of Oman)
  ],
];

// Very light land-area boxes [minLat, maxLat, minLon, maxLon] to filter obvious inland points
// These are intentionally small so we keep most coastal / port traffic visible.
const LAND_EXCLUSION_BOXES = [
  [25.2, 25.5, 55.1, 55.4],   // Deep inland Dubai/Sharjah (far from channel)
  [24.7, 25.0, 51.4, 51.7],   // Inland Qatar (away from main channel)
  [25.9, 26.1, 50.5, 50.7],   // Bahrain interior (keep coastal anchorage)
];

function isOnLand(lat, lon) {
  return LAND_EXCLUSION_BOXES.some(
    ([minLat, maxLat, minLon, maxLon]) =>
      lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon
  );
}

const AISSTREAM_API_KEY = process.env.AISSTREAM_API_KEY;

if (!AISSTREAM_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    "[AISSTREAM] Missing AISSTREAM_API_KEY in server environment (.env). " +
      "Backend will start but no AIS data will be streamed."
  );
}

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ais" });

let upstream = null;
let clients = new Set();

function broadcast(message) {
  const data =
    typeof message === "string" ? message : JSON.stringify(message);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

function normalizeAisMessage(raw) {
  if (!raw || !raw.Message || !raw.Message.PositionReport) return null;
  const pr = raw.Message.PositionReport;
  const meta = raw.Metadata;
  if (!pr || pr.Latitude == null || pr.Longitude == null) return null;

  const mmsi =
    pr.MMSI ?? pr.Mmsi ?? meta?.MMSI ?? meta?.Mmsi ?? null;
  const lat = pr.Latitude;
  const lon = pr.Longitude;
  const ts = pr.Timestamp ?? meta?.Timestamp ?? null;
  const fallbackId = `pos-${lat}-${lon}-${ts ?? Date.now()}`;

  return {
    mmsi: mmsi ?? fallbackId,
    id: fallbackId,
    lat,
    lon,
    sog: pr.SpeedOverGround ?? pr.Sog ?? null,
    cog: pr.CourseOverGround ?? pr.Cog ?? null,
    name:
      pr.Name ??
      meta?.ShipName ??
      (mmsi ? `MMSI ${mmsi}` : `Vessel ${fallbackId.slice(0, 12)}`),
    navStatus: pr.NavigationalStatus,
    ts,
  };
}

function connectUpstream() {
  if (upstream || !AISSTREAM_API_KEY) return;

  upstream = new WebSocket(AISSTREAM_URL);

  upstream.on("open", () => {
    const subscription = {
      APIKey: AISSTREAM_API_KEY,
      BoundingBoxes: HORMUZ_BOUNDING_BOX,
      FilterMessageTypes: ["PositionReport"],
    };
    // Guard against race where upstream was closed and nulled before open fires
    if (upstream && upstream.readyState === WebSocket.OPEN) {
      upstream.send(JSON.stringify(subscription));
    }
    // eslint-disable-next-line no-console
    console.log("[AISSTREAM] Connected and subscribed");
  });

  upstream.on("message", (data) => {
    try {
      const raw = JSON.parse(data.toString());
      const v = normalizeAisMessage(raw);
      if (!v) return;
      if (isOnLand(v.lat, v.lon)) return; // skip positions on land
      broadcast(v);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[AISSTREAM] Decode error", e);
    }
  });

  upstream.on("close", (code, reason) => {
    // eslint-disable-next-line no-console
    console.warn(
      `[AISSTREAM] Upstream closed (${code}) ${reason?.toString() || ""}`
    );
    upstream = null;
    if (clients.size > 0) {
      // Attempt simple retry after a short delay
      setTimeout(connectUpstream, 5000);
    }
  });

  upstream.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("[AISSTREAM] Upstream error", err);
  });
}

wss.on("connection", (ws) => {
  clients.add(ws);
  // eslint-disable-next-line no-console
  console.log("[AISSTREAM] Client connected, total:", clients.size);

  if (!upstream && AISSTREAM_API_KEY) {
    connectUpstream();
  }

  ws.on("close", () => {
    clients.delete(ws);
    // eslint-disable-next-line no-console
    console.log("[AISSTREAM] Client disconnected, total:", clients.size);
    if (clients.size === 0 && upstream) {
      // Optionally close upstream when no listeners
      upstream.close();
      upstream = null;
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    clients: clients.size,
    upstreamConnected: !!upstream && upstream.readyState === WebSocket.OPEN,
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `[AISSTREAM] Backend listening on http://localhost:${PORT} (WS path: /ais)`
  );
});

