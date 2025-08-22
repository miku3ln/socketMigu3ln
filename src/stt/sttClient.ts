import { env } from "../config/env";

export type SttResponse = {
    text: string;
    lang: string;
    time_s?: number;
    duration_s?: number;
    model?: string;
};

export class SttClient {
    constructor(
        private base = env.sttUrl,
        private endpoint = env.sttEndpoint
    ) {}

    async transcribeChunk(buf: Buffer, lang = env.sttDefaultLang, sampleRate = env.audioSampleRate): Promise<SttResponse> {
        // Node 20 trae fetch/Blob/FormData vía undici
        const form = new FormData();
        form.append("language", lang);
        form.append("sample_rate", String(sampleRate));
        // usa Blob para adjuntar el binario con nombre de archivo "chunk.pcm"
        // @ts-ignore
        form.append("audio", new Blob([buf]), "chunk.pcm");

        const res = await fetch(new URL(this.endpoint, this.base), {
            method: "POST",
            body: form as any,
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(`STT ${res.status}: ${txt}`);
        }
        return (await res.json()) as SttResponse;
    }
}
