import numpy as np

def pcm16le_bytes_to_float_mono(data: bytes) -> np.ndarray:
    """Convierte PCM16 LE mono a float32 [-1,1] para faster-whisper."""
    if not data:
        return np.array([], dtype=np.float32)
    pcm = np.frombuffer(data, dtype=np.int16)
    return pcm.astype(np.float32) / 32768.0
