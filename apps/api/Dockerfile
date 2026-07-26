# =============================================================================
# OpenDevX API — Development Dockerfile
# =============================================================================
# Multi-stage build:
#   builder  — installs Python dependencies into an isolated prefix
#   runtime  — slim final image that copies only the installed packages
#
# Design decisions:
#   • python:3.12-slim keeps the image small without Alpine compatibility risk.
#   • Dependencies are installed in the builder stage so that changing source
#     code does NOT invalidate the package-install layer (key for hot reload).
#   • Source code is bind-mounted at runtime (docker-compose.yml) so the image
#     itself does not embed application code — rebuilds are only needed when
#     pyproject.toml changes.
#   • A non-root user (appuser) is created to follow least-privilege practice.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1 — builder: install Python dependencies
# -----------------------------------------------------------------------------
FROM python:3.12-slim AS builder

WORKDIR /build

# Install pip build tools once; cached unless this layer changes.
RUN pip install --no-cache-dir --upgrade pip

# Copy dependency manifest, README, and package structure for Hatchling metadata generation.
COPY pyproject.toml README.md ./
COPY app ./app

# Install the project and its runtime dependencies into /install.
RUN pip install --no-cache-dir --prefix=/install ".[dev]"

# -----------------------------------------------------------------------------
# Stage 2 — runtime: minimal image for local development
# -----------------------------------------------------------------------------
FROM python:3.12-slim AS runtime

# Create a non-root user and group.
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy installed packages from the builder stage.
COPY --from=builder /install /usr/local

# Switch to non-root user.
USER appuser

# Expose the Uvicorn port.
EXPOSE 8000

# Start FastAPI with hot reload enabled.
# Source code is mounted by docker-compose.yml so changes are reflected live.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
