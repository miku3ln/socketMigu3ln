"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToMs = bytesToMs;
// Utilidades de audio (comentarios en español).
const env_1 = require("../config/env");
function bytesToMs(bytes) {
    // Convierte bytes PCM16 a milisegundos (comentarios en español).
    const bytesPerSecond = env_1.env.audioSampleRate * env_1.env.audioChannels * env_1.env.bytesPerSample;
    if (bytesPerSecond <= 0)
        return 0;
    return (bytes / bytesPerSecond) * 1000;
}
