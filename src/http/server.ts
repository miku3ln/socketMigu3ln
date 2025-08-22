// Servidor HTTP mínimo para health-check y montar WebSocket (comentarios en español).
import * as http from "http";
import { env } from "../config/env";
const startedAt = new Date();
export function createHttpServer() {
    const server = http.createServer((req, res) => {
        if (req.method === "GET" && req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("WS Audio ACK server is running Migu3ln\n");
            return;
        }  // ✅ GET /getData -> JSON con config y uptime
        if (req.method === "GET" && req.url?.startsWith("/getDataNode")) {
            const payload = {
                service: "audio-ws-server",
                host: env.host,
                port: env.port,
                wsPath: env.wsPath,
                audio: {
                    sampleRate: env.audioSampleRate,
                    channels: env.audioChannels,
                    bytesPerSample: env.bytesPerSample,
                },
                startedAt: startedAt.toISOString(),
                uptime_s: Math.floor(process.uptime()),
                now: new Date().toISOString(),
            };
            const body = JSON.stringify(payload);
            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": Buffer.byteLength(body),
            });
            res.end(body);
            return;
        }
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found\n");
    });

    server.listen(env.port, env.host, () => {
        // Escucha en todas las interfaces si host=0.0.0.0 (comentarios en español).
        console.log(`[INFO] HTTP listening on http://${env.host}:${env.port}`);
        console.log(
            `[INFO] WS listening on ws://${env.host}:${env.port}${env.wsPath}`
        );
        console.log(
            `[INFO] Audio params -> sampleRate=${env.audioSampleRate}Hz, channels=${env.audioChannels}, bytes/sample=${env.bytesPerSample}`
        );
    });

    return server;
}
