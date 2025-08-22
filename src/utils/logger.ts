// Logger mínimo; en producción integrar pino/winston (comentarios en español).
export const log = {
    info: (...args: unknown[]) => console.log("[INFO]", ...args),
    error: (...args: unknown[]) => console.error("[ERROR]", ...args),
};
