"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
// Logger mínimo; en producción integrar pino/winston (comentarios en español).
exports.log = {
    info: (...args) => console.log("[INFO]", ...args),
    error: (...args) => console.error("[ERROR]", ...args),
};
