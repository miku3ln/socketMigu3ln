"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// Carga y valida variables de entorno (comentarios en español).
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function toNumber(value, fallback) {
    // Convierte a número con fallback seguro (comentarios en español).
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}
exports.env = Object.freeze({
    host: process.env.HOST ?? "0.0.0.0",
    port: toNumber(process.env.PORT, 3001),
    wsPath: process.env.WS_PATH ?? "/audio",
    // Audio params: deben coincidir con la app Flutter (comentarios en español).
    audioSampleRate: toNumber(process.env.AUDIO_SAMPLE_RATE, 16000),
    audioChannels: toNumber(process.env.AUDIO_CHANNELS, 1),
    // PCM16 = 16 bits = 2 bytes (constante) (comentarios en español).
    bytesPerSample: 2
});
