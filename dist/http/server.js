"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpServer = createHttpServer;
// Servidor HTTP mínimo para health-check y montar WebSocket (comentarios en español).
const http = __importStar(require("http"));
const env_1 = require("../config/env");
function createHttpServer() {
    const server = http.createServer((req, res) => {
        if (req.method === "GET" && req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("WS Audio ACK server is running Migu3ln\n");
            return;
        }
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found\n");
    });
    server.listen(env_1.env.port, env_1.env.host, () => {
        // Escucha en todas las interfaces si host=0.0.0.0 (comentarios en español).
        console.log(`[INFO] HTTP listening on http://${env_1.env.host}:${env_1.env.port}`);
        console.log(`[INFO] WS listening on ws://${env_1.env.host}:${env_1.env.port}${env_1.env.wsPath}`);
        console.log(`[INFO] Audio params -> sampleRate=${env_1.env.audioSampleRate}Hz, channels=${env_1.env.audioChannels}, bytes/sample=${env_1.env.bytesPerSample}`);
    });
    return server;
}
