# app/main.py
import os
import platform
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel

from app.stt import transcribe_pcm16_chunk

app = FastAPI(title="STT Service (faster-whisper)")

# ---------- MODELOS ----------
class ServiceInfo(BaseModel):
    endpoint: str = "/getData"
    status: str
    service: str = "stt-service"
    version: str = os.getenv("STT_SERVICE_VERSION", "0.1.0")
    python: str = platform.python_version()
    model: str = os.getenv("FASTER_WHISPER_MODEL", "small")
    device: str = os.getenv("FASTER_WHISPER_DEVICE", "cpu")

# ---------- ENDPOINTS ----------
@app.get("/healthz", response_class=PlainTextResponse)
def healthz():
    return "ok"

@app.get("/getData", response_model=ServiceInfo)
def get_data():
    """Ping JSON para verificar que el servicio corre y ver su config básica."""
    return ServiceInfo(status="running")

@app.post("/transcribe-chunk")
async def transcribe_chunk(
    audio: UploadFile = File(..., description="PCM16 mono raw"),
    language: str | None = Form(None),
    sample_rate: int = Form(16000),
):
    try:
        pcm_bytes = await audio.read()
        text, elapsed_s, lang_used = transcribe_pcm16_chunk(
            pcm_bytes=pcm_bytes,
            sample_rate=sample_rate,
            language=language,
        )
        return JSONResponse(
            {
                "text": text,
                "time_s": elapsed_s,
                "lang": lang_used,
                "sample_rate": sample_rate,
                "bytes": len(pcm_bytes),
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
