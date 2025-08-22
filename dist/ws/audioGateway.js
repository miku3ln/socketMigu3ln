"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAudioGateway = createAudioGateway;
const ws_1 = require("ws");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const raw_1 = require("../utils/raw");
const connectionContext_1 = require("./connectionContext");
function createAudioGateway(server) {
    const wss = new ws_1.WebSocketServer({ server, path: env_1.env.wsPath });
    // Heartbeat: cierra conexiones muertas y mantiene el canal saludable (comentarios en español).
    const HEARTBEAT_MS = 30_000;
    const heartbeat = () => {
        wss.clients.forEach((ws) => {
            const s = ws;
            if (!s.ctx)
                s.ctx = new connectionContext_1.ConnectionContext();
            if (!s.ctx.isAlive) {
                s.terminate();
                return;
            }
            s.ctx.isAlive = false;
            s.ping(); // el cliente debe responder con 'pong'
        });
    };
    const interval = setInterval(heartbeat, HEARTBEAT_MS);
    wss.on("connection", (ws) => {
        ws.ctx = new connectionContext_1.ConnectionContext();
        logger_1.log.info("Client connected");
        ws.on("pong", () => {
            // Marca conexión viva cuando llega 'pong' (comentarios en español).
            if (ws.ctx)
                ws.ctx.isAlive = true;
        });
        ws.on("message", (data, isBinary) => {
            // debugRawData(data); // Útil si quieres inspeccionar el tipo real (comentarios en español).
            if (isBinary && ws.ctx) {
                // Chunk de audio binario → responde ACK con longitudes (comentarios en español).
                const chunkBytes = (0, raw_1.rawDataByteLength)(data);
                const ack = ws.ctx.ackPayload(chunkBytes);
                // Incluye metadata de audio para el cliente (comentarios en español).
                const payload = {
                    ...ack,
                    audio: {
                        sampleRate: env_1.env.audioSampleRate,
                        channels: env_1.env.audioChannels,
                        bytesPerSample: env_1.env.bytesPerSample,
                    },
                };
                ws.send(JSON.stringify(payload));
                return;
            }
            // Mensajes de texto/control (opcional) (comentarios en español).
            if (typeof data === "string") {
                if (data === "ping") {
                    ws.send("pong");
                    return;
                }
                // try { const msg = JSON.parse(data); /* ... */ } catch { /* noop */ }
            }
        });
        ws.on("close", () => {
            logger_1.log.info("Client closed", {
                totalBytes: ws.ctx?.totalBytes,
                chunks: ws.ctx?.chunks,
                totalDurationMs: ws.ctx?.totalDurationMs,
            });
        });
        ws.on("error", (err) => {
            logger_1.log.error("WS error:", err);
        });
    });
    wss.on("close", () => clearInterval(interval));
    logger_1.log.info(`WebSocket ready at path ${env_1.env.wsPath}`);
    return wss;
}
