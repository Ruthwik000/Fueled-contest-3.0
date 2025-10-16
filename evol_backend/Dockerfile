# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed for numpy/scikit-learn)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files including embeddings
COPY celebrities.json .
COPY products.json .
COPY celebrities_with_vectors.json .
COPY products_with_vectors.json .
COPY celebrity_embeddings.pkl .
COPY product_embeddings.pkl .
COPY celebrity_embeddings_metadata.json .
COPY product_embeddings_metadata.json .
COPY main.py .
COPY recommender_engine.py .
COPY style_taxonomy.py .


# Expose port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Set environment variable for production
ENV PYTHONUNBUFFERED=1

# Run the application
# Cloud Run provides PORT environment variable, default to 8080
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
