// Carga y valida variables de entorno (comentarios en español).
import dotenv from "dotenv";
dotenv.config();

function toNumber(value: string | undefined, fallback: number): number {
    // Convierte a número con fallback seguro (comentarios en español).
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

export const env = Object.freeze({
    host: process.env.HOST ?? "0.0.0.0",
    port: toNumber(process.env.PORT, 3000),
    wsPath: process.env.WS_PATH ?? "/audio",

    // Audio params: deben coincidir con la app Flutter (comentarios en español).
    audioSampleRate: toNumber(process.env.AUDIO_SAMPLE_RATE, 16000),
    audioChannels: toNumber(process.env.AUDIO_CHANNELS, 1),

    // PCM16 = 16 bits = 2 bytes (constante) (comentarios en español).
    bytesPerSample: 2
});
