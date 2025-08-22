# app/stt.py
import os, time
import numpy as np
from faster_whisper import WhisperModel

# Variables de entorno con valores por defecto
MODEL_NAME = os.getenv("FASTER_WHISPER_MODEL", "small")   # tiny|base|small|medium|large-v3...
DEVICE     = os.getenv("FASTER_WHISPER_DEVICE", "cpu")    # cpu|cuda
COMPUTE    = os.getenv("FASTER_WHISPER_COMPUTE", "int8")  # int8|int8_float16|float16|float32
DEF_LANG   = os.getenv("FASTER_WHISPER_LANG", "es")

_model: WhisperModel | None = None

def get_model() -> WhisperModel:
    global _model
    if _model is None:
        # cache_dir permite reutilizar el modelo entre arranques si montas un volumen
        _model = WhisperModel(
            MODEL_NAME,
            device=DEVICE,
            compute_type=COMPUTE,
            download_root=os.getenv("FASTER_WHISPER_CACHE", "/root/.cache/faster-whisper")
        )
    return _model

def transcribe_pcm16_chunk(pcm_bytes: bytes, sample_rate: int = 16000, language: str | None = None):
    """
    Recibe audio PCM16 mono (little-endian) en bytes y devuelve texto + tiempo de proceso.
    """
    if not pcm_bytes:
        return "", 0.0, language or DEF_LANG

    # PCM16 -> np.int16 -> np.float32 [-1..1]
    pcm = np.frombuffer(pcm_bytes, dtype=np.int16)
    if pcm.ndim != 1:
        raise ValueError("Se espera PCM16 MONO (1 canal).")
    audio = pcm.astype(np.float32) / 32768.0

    lang_used = language or DEF_LANG
    model = get_model()

    t0 = time.perf_counter()
    segments, info = model.transcribe(
        audio=audio,
        language=lang_used,
        task="transcribe",
        vad_filter=False,
        without_timestamps=True,
        beam_size=1
    )
    text = " ".join(seg.text.strip() for seg in segments if seg.text)
    elapsed = time.perf_counter() - t0
    return text.strip(), round(elapsed, 3), lang_used
