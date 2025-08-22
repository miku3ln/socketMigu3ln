"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionContext = void 0;
// Contexto por conexión: acumula métricas y genera payload de ACK (comentarios en español).
const audio_1 = require("../utils/audio");
class ConnectionContext {
    totalBytes = 0;
    chunks = 0;
    totalDurationMs = 0;
    isAlive = true; // utilizado por heartbeat (comentarios en español)
    ackPayload(chunkBytes) {
        // Actualiza acumuladores y construye ACK (comentarios en español).
        this.totalBytes += chunkBytes;
        this.chunks += 1;
        const chunkDurationMs = (0, audio_1.bytesToMs)(chunkBytes);
        this.totalDurationMs += chunkDurationMs;
        return {
            type: "ack",
            chunkBytes,
            chunkDurationMs,
            totalBytes: this.totalBytes,
            totalDurationMs: this.totalDurationMs,
            chunks: this.chunks,
            receivedAt: new Date().toISOString(),
        };
    }
}
exports.ConnectionContext = ConnectionContext;
