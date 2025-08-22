// src/utils/raw-to-buffer.ts
import type { RawData } from "ws";

export function bufferFromRawData(d: RawData): Buffer {
    if (Buffer.isBuffer(d)) return d;
    if (Array.isArray(d)) return Buffer.concat(d.filter(Buffer.isBuffer));
    if (d instanceof ArrayBuffer) return Buffer.from(d);
    if (ArrayBuffer.isView(d as any)) {
        const view = d as ArrayBufferView;
        return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    }
    return Buffer.alloc(0);
}
