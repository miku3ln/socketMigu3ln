// Utilidades de audio (comentarios en español).
import { env } from "../config/env";

export function bytesToMs(bytes: number): number {
    // Convierte bytes PCM16 a milisegundos (comentarios en español).
    const bytesPerSecond = env.audioSampleRate * env.audioChannels * env.bytesPerSample;
    if (bytesPerSecond <= 0) return 0;
    return (bytes / bytesPerSecond) * 1000;
}
