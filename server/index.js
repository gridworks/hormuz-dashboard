import http from "http";
import express from "express";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";

dotenv.config();

const AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream";

// Approximate bounding box for Strait of Hormuz (lat, lon)
const HORMUZ_BOUNDING_BOX = [
  [
    [24.5, 54.0], // south‑west corner
    [27.8, 60.0], // north‑east corner
  ],
];

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
  if (!raw || raw.MessageType !== "PositionReport") return null;
  const pr = raw.Message?.PositionReport;
  if (!pr || pr.Latitude == null || pr.Longitude == null) return null;

  return {
    mmsi: pr.MMSI,
    lat: pr.Latitude,
    lon: pr.Longitude,
    sog: pr.SpeedOverGround,
    cog: pr.CourseOverGround,
    name: pr.Name || `MMSI ${pr.MMSI}`,
    navStatus: pr.NavigationalStatus,
    ts: pr.Timestamp,
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
    upstream.send(JSON.stringify(subscription));
    // eslint-disable-next-line no-console
    console.log("[AISSTREAM] Connected and subscribed");
  });

  upstream.on("message", (data) => {
    try {
      const raw = JSON.parse(data.toString());
      const v = normalizeAisMessage(raw);
      if (!v) return;
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

