# =============================================================================
# OpenDevX Web — Development Dockerfile
# =============================================================================
# Design decisions:
#   • node:20-slim (LTS) provides a stable, small base image.
#   • Dependencies are installed in a dedicated layer (COPY package*.json first)
#     so that npm install is re-run only when package.json or package-lock.json
#     changes — not on every source file edit.
#   • Source code is bind-mounted at runtime (docker-compose.yml), enabling
#     Vite's native HMR to pick up changes without container rebuilds.
#   • A non-root user (appuser) is created to follow least-privilege practice.
#   • CHOKIDAR_USEPOLLING is set for reliable HMR inside Docker on macOS/Windows
#     where inotify events may not propagate to the host filesystem mount.
# =============================================================================

FROM node:22-slim AS runtime

# Create a non-root user and group.
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching.
# npm install only re-runs when these files change.
COPY --chown=appuser:appgroup package.json package-lock.json ./

# Install all dependencies (including devDependencies for Vite).
RUN npm ci && chown -R appuser:appgroup /app

# Switch to non-root user before running the server.
USER appuser

# Expose Vite's default development port.
EXPOSE 5173

# Enable polling-based file watching for reliable HMR in bind-mounted volumes.
ENV CHOKIDAR_USEPOLLING=true

# Start Vite development server.
# --host exposes the server on 0.0.0.0 so it is reachable from the host.
CMD ["npm", "run", "dev", "--", "--host"]
