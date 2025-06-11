import http from "http";
import "./jobs/report";
import app from "./app";
import { PORT } from "./config/config";
import { WebSocketServer } from "ws";

const server = http.createServer(app);
export const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  ws.on("message", (message) => {
    console.log(`received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
