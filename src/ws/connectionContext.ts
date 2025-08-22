// src/ws/connectionContext.ts
import { bytesToMs } from "../utils/audio";
import { env } from "../config/env";

export class ConnectionContext {
    totalBytes = 0;
    chunks = 0;
    totalDurationMs = 0;
    isAlive = true;

    // 👇 idioma actual de la conexión (default desde .env)
    language: string = env.sttDefaultLang;

    setLanguage(lang?: string) {
        if (lang && lang.trim()) this.language = lang.trim();
    }

    ackPayload(chunkBytes: number) {
        this.totalBytes += chunkBytes;
        this.chunks += 1;

        const chunkDurationMs = bytesToMs(chunkBytes);
        this.totalDurationMs += chunkDurationMs;

        return {
            textConvert: "",
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
