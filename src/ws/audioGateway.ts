// Gateway WebSocket: gestiona conexión, heartbeat y ACK por chunk (comentarios en español).
import type { Server } from "http";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { env } from "../config/env";
import { log } from "../utils/logger";
import { rawDataByteLength /*, debugRawData*/ } from "../utils/raw";
import { ConnectionContext } from "./connectionContext";

type AugmentedWebSocket = WebSocket & { ctx?: ConnectionContext };

export function createAudioGateway(server: Server) {
    const wss = new WebSocketServer({ server, path: env.wsPath });

    // Heartbeat: cierra conexiones muertas y mantiene el canal saludable (comentarios en español).
    const HEARTBEAT_MS = 30_000;
    const heartbeat = () => {
        wss.clients.forEach((ws) => {
            const s = ws as AugmentedWebSocket;
            if (!s.ctx) s.ctx = new ConnectionContext();
            if (!s.ctx.isAlive) {
                s.terminate();
                return;
            }
            s.ctx.isAlive = false;
            s.ping(); // el cliente debe responder con 'pong'
        });
    };
    const interval = setInterval(heartbeat, HEARTBEAT_MS);

    wss.on("connection", (ws: AugmentedWebSocket) => {
        ws.ctx = new ConnectionContext();
        log.info("Client connected");

        ws.on("pong", () => {
            // Marca conexión viva cuando llega 'pong' (comentarios en español).
            if (ws.ctx) ws.ctx.isAlive = true;
        });

        ws.on("message", (data: RawData, isBinary: boolean) => {
            // debugRawData(data); // Útil si quieres inspeccionar el tipo real (comentarios en español).

            if (isBinary && ws.ctx) {
                // Chunk de audio binario → responde ACK con longitudes (comentarios en español).
                const chunkBytes = rawDataByteLength(data);
                const ack = ws.ctx.ackPayload(chunkBytes);

                // Incluye metadata de audio para el cliente (comentarios en español).
                const payload = {
                    ...ack,
                    audio: {
                        sampleRate: env.audioSampleRate,
                        channels: env.audioChannels,
                        bytesPerSample: env.bytesPerSample,
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
            log.info("Client closed", {
                totalBytes: ws.ctx?.totalBytes,
                chunks: ws.ctx?.chunks,
                totalDurationMs: ws.ctx?.totalDurationMs,
            });
        });

        ws.on("error", (err) => {
            log.error("WS error:", err);
        });
    });

    wss.on("close", () => clearInterval(interval));

    log.info(`WebSocket ready at path ${env.wsPath}`);
    return wss;
}
