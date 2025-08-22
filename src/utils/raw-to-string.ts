// src/utils/raw-to-string.ts
import type { RawData } from "ws";

export function rawDataToText(d: RawData): string {
    // Aunque RawData no contempla string, por robustez dejamos la rama:
    if (typeof (d as any) === "string") return d as unknown as string;
    if (Buffer.isBuffer(d)) return d.toString("utf8");
    if (Array.isArray(d)) return Buffer.concat(d.filter(Buffer.isBuffer)).toString("utf8");
    if (d instanceof ArrayBuffer) return Buffer.from(d).toString("utf8");
    if (ArrayBuffer.isView(d as any)) {
        const view = d as ArrayBufferView;
        return Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString("utf8");
    }
    return "";
}
