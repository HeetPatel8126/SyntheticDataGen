FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install PyTorch CPU-only first (much smaller than full CUDA version)
RUN pip install --no-cache-dir --timeout=300 --retries=5 \
    torch --index-url https://download.pytorch.org/whl/cpu

# Install remaining Python dependencies
RUN pip install --no-cache-dir --timeout=300 --retries=5 -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN addgroup --system appuser && adduser --system --ingroup appuser appuser \
    && mkdir -p /app/generated_data \
    && chown -R appuser:appuser /app

USER appuser

# Expose port
EXPOSE 8000

# Default command (can be overridden)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
