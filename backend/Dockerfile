FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Build args (can be overridden at build time)
ARG GEMINI_API_KEY=""
ARG GEMINI_MODEL="gemini-2.0-flash"
ARG ALLOWED_ORIGINS='["http://localhost:5173"]'
ARG MAX_HISTORY_MESSAGES=10

# Set environment variables in the image (these can be overridden by docker-compose at runtime)
ENV GEMINI_API_KEY=${GEMINI_API_KEY} \
    GEMINI_MODEL=${GEMINI_MODEL} \
    ALLOWED_ORIGINS=${ALLOWED_ORIGINS} \
    MAX_HISTORY_MESSAGES=${MAX_HISTORY_MESSAGES}

# Copy only requirements first for better caching
COPY requirements.txt ./

RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
    && pip install --upgrade pip \
    && pip install -r requirements.txt \
    && apt-get remove -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Copy project
COPY . .

EXPOSE 8000

# Adjust "main:app" below to match your FastAPI entrypoint
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
