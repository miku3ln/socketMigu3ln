"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Bootstrap: crea HTTP server y monta gateway de audio (comentarios en español).
const server_1 = require("./http/server");
const audioGateway_1 = require("./ws/audioGateway");
// HTTP base
const server = (0, server_1.createHttpServer)();
// WebSocket gateway
(0, audioGateway_1.createAudioGateway)(server);
