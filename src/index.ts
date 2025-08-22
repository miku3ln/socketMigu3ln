// Bootstrap: crea HTTP server y monta gateway de audio (comentarios en español).
import {createHttpServer} from "./http/server";
import {createAudioGateway} from "./ws/audioGateway";

// HTTP base
const server = createHttpServer();

// WebSocket gateway
createAudioGateway(server);
