# stt-service/Dockerfile
FROM python:3.11-slim

# Evita prompts
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias básicas (curl útil para pruebas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Instala requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY app ./app

# Vars por defecto (puedes sobreescribirlas en compose)
ENV FASTER_WHISPER_MODEL=small \
    FASTER_WHISPER_DEVICE=cpu \
    FASTER_WHISPER_COMPUTE=int8 \
    FASTER_WHISPER_LANG=es

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
