// Helpers para tratar RawData de 'ws' con type guards seguros (comentarios en español).
import type {RawData} from "ws";

export function isArrayBufferView(val: unknown): val is ArrayBufferView {
    // Verifica que sea objeto y que ArrayBuffer.isView sea true (comentarios en español).
    return typeof val === "object" && val !== null && ArrayBuffer.isView(val as any);
}

export function rawDataByteLength(data: RawData): number {
    debugRawData(data);
    if (typeof data === "string") return Buffer.byteLength(data);

    if (Buffer.isBuffer(data)) return data.length;

    if (Array.isArray(data)) {
        // ws puede entregar un arreglo de Buffers
        return data.reduce((sum, chunk) => sum + (Buffer.isBuffer(chunk) ? chunk.length : 0), 0);
    }

    if (data instanceof ArrayBuffer) return data.byteLength;

    if (isArrayBufferView(data)) {
        // Aquí TS ya sabe que es ArrayBufferView -> tiene byteLength
        return (data as ArrayBufferView).byteLength;
    }

    return 0; // Fallback seguro
}

// Útil temporalmente para diagnosticar tipos reales recibidos (comentarios en español).
export function debugRawData(data: RawData) {
    const anyData = data as any;
    console.log("[DEBUG raw]", {
        typeofData: typeof data,
        constructor: anyData?.constructor?.name,
        isBuffer: Buffer.isBuffer(data),
        isArray: Array.isArray(data),
        isArrayBuffer: data instanceof ArrayBuffer,
        isView: ArrayBuffer.isView(anyData),
        length: anyData?.length,
        byteLength: anyData?.byteLength,
        bufferByteLength: anyData?.buffer?.byteLength,
    });
}
