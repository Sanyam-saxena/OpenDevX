# OpenDevX Development Setup

## Supported Operating Systems

Development is supported on Linux, macOS, and Windows. Windows development uses Docker Desktop or WSL 2.

## Development Prerequisites

- **Git**
- **Python 3.12+**
- **Node.js 22+ & npm**
- **Docker & Docker Compose**

---

## Environment Configuration

### Backend Environment (`apps/api`)
Copy `.env.example` to `.env` at the repository root:
```bash
cp .env.example .env
```

### Frontend Environment (`apps/web`)
Copy `apps/web/.env.example` to `apps/web/.env`:
```bash
cp apps/web/.env.example apps/web/.env
```

The frontend uses `VITE_API_BASE_URL` to route requests to the backend:
```ini
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
```

---

## Running the Application Locally

### Option 1: Native Development Mode

1. **Start Backend (FastAPI)**:
   ```bash
   pip install -e "apps/api[dev]"
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Start Frontend (React + Vite)**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

- Frontend URL: [http://localhost:5173/](http://localhost:5173/)
- Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Docker Compose (Full Infrastructure Stack)

```bash
docker compose up --build
```

---

## Development Philosophy

Work in small, independently reviewable changes. Keep local configuration out of version control, protect infrastructure credentials, and update documentation when a change affects contributor setup or operational behavior. Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for repository standards.
