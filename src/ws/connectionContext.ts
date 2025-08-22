// Contexto por conexión: acumula métricas y genera payload de ACK (comentarios en español).
import { bytesToMs } from "../utils/audio";

export class ConnectionContext {
    totalBytes = 0;
    chunks = 0;
    totalDurationMs = 0;
    isAlive = true; // utilizado por heartbeat (comentarios en español)

    ackPayload(chunkBytes: number) {
        // Actualiza acumuladores y construye ACK (comentarios en español).
        this.totalBytes += chunkBytes;
        this.chunks += 1;

        const chunkDurationMs = bytesToMs(chunkBytes);
        this.totalDurationMs += chunkDurationMs;

        return {
            type: "ack" as const,
            chunkBytes,
            chunkDurationMs,
            totalBytes: this.totalBytes,
            totalDurationMs: this.totalDurationMs,
            chunks: this.chunks,
            receivedAt: new Date().toISOString(),
        };
    }
}
