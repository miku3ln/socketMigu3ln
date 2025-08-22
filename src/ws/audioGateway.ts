// src/ws/audioGateway.ts
import type { Server } from "http";
import { WebSocketServer, WebSocket, RawData } from "ws";
import { env } from "../config/env";
import { log } from "../utils/logger";
import { rawDataByteLength } from "../utils/raw";
import { bufferFromRawData } from "../utils/raw-to-buffer";   // 👈 ruta corregida
import { rawDataToText } from "../utils/raw-to-string";       // 👈 NUEVO
import { ConnectionContext } from "./connectionContext";
import { SttClient } from "../stt/sttClient";

type AugmentedWebSocket = WebSocket & { ctx?: ConnectionContext };
const stt = new SttClient();

export function createAudioGateway(server: Server) {
    const wss = new WebSocketServer({ server, path: env.wsPath });

    const HEARTBEAT_MS = 30_000;
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            const s = ws as AugmentedWebSocket;
            if (!s.ctx) s.ctx = new ConnectionContext();
            if (!s.ctx.isAlive) { s.terminate(); return; }
            s.ctx.isAlive = false;
            s.ping();
        });
    }, HEARTBEAT_MS);

    wss.on("connection", (ws: AugmentedWebSocket) => {
        ws.ctx = new ConnectionContext();
        log.info("Client connected");

        ws.on("pong", () => { if (ws.ctx) ws.ctx.isAlive = true; });

        ws.on("message", async (data: RawData, isBinary: boolean) => {
            // ✅ Trata comandos de texto con helper (sin usar 'data' como string)
            if (!isBinary) {
                const text = rawDataToText(data);
                if (text === "ping") { ws.send("pong"); return; }
                if (text.startsWith("lang:") && ws.ctx) {
                    const lang = text.split(":")[1]?.trim();
                    if (lang) ws.ctx.language = lang;
                    ws.send(JSON.stringify({ type: "lang", ok: true, language: ws.ctx.language }));
                    return;
                }
                return; // otros textos ignorados
            }

            // 🔊 Binario: audio
            if (ws.ctx) {
                const buf = bufferFromRawData(data);
                const chunkBytes = buf.length || rawDataByteLength(data);
                const ack = ws.ctx.ackPayload(chunkBytes);

                try {
                    const sttRes = await stt.transcribeChunk(buf, ws.ctx.language, env.audioSampleRate);
                    const payload = {
                        ...ack,
                        stt: { text: sttRes.text, lang: sttRes.lang, time_s: sttRes.time_s },
                        audio: {
                            sampleRate: env.audioSampleRate,
                            channels: env.audioChannels,
                            bytesPerSample: env.bytesPerSample,
                        },
                    };
                    ws.send(JSON.stringify(payload));
                } catch (e: any) {
                    const payload = {
                        ...ack,
                        sttError: String(e?.message ?? e),
                        audio: {
                            sampleRate: env.audioSampleRate,
                            channels: env.audioChannels,
                            bytesPerSample: env.bytesPerSample,
                        },
                    };
                    ws.send(JSON.stringify(payload));
                }
            }
        });

        ws.on("close", () => {
            log.info("Client closed", {
                totalBytes: ws.ctx?.totalBytes,
                chunks: ws.ctx?.chunks,
                totalDurationMs: ws.ctx?.totalDurationMs,
                language: ws.ctx?.language,
            });
        });

        ws.on("error", (err) => log.error("WS error:", err));
    });

    wss.on("close", () => clearInterval(interval));
    log.info(`WebSocket ready at path ${env.wsPath}`);
    return wss;
}
