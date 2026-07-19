# OpenDevX API

This directory contains the FastAPI service scaffold for OpenDevX. Sprint 1 establishes the project structure only; no routes, integrations, database configuration, authentication, or business logic are included.

## Local development

Create and activate a virtual environment, install the project, then start the development server:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
python -m uvicorn app.main:app --reload
```

The service exposes only the FastAPI application instance at this stage. API routes will begin under `/api/v1` when implementation work is approved.

## Quality commands

```powershell
python -m ruff check .
python -m black --check .
python -m pytest
```
