# Changelog

All notable changes to the OpenDevX Internal Developer Platform are documented here.

## [0.2.0] - 2026-07-26

### Added
- **Database Layer**: SQLAlchemy 2.x async engine, session factory, PostgreSQL connection pooling (`app/core/database.py`), and Redis client (`app/core/redis.py`).
- **Migrations**: Alembic async migration suite configured with `001_users` and `002_core` migrations.
- **Authentication & RBAC**: JWT access/refresh token issue & verification, bcrypt password hashing, `User` ORM model, and role-based permissions (`admin`, `operator`, `viewer`).
- **Auth Endpoints**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me`.
- **Core Domain Models & Repositories**: `Project`, `Environment`, `AuditLog` ORM models, generic `BaseRepository`, and specialized domain repositories.
- **Domain Services**: `ProjectService`, `EnvironmentService`, `AuditLogService`.
- **REST Endpoints**:
  - `GET/POST/PUT/DELETE /api/v1/projects` (paginated)
  - `GET/POST/PUT/DELETE /api/v1/projects/{id}/environments`
  - `GET/PUT /api/v1/users` (Admin only)
  - `GET /api/v1/audit-logs` (Operator+)
- **Middleware**: `RequestIDMiddleware` for correlation tracking via `X-Request-ID` header.
- **Observability**: Prometheus metrics middleware, `/api/v1/metrics` endpoint, and `prometheus.yml` scrape configuration.
- **Frontend API Integration**: Axios client with interceptors for token refresh, TypeScript API types, React Query custom hooks (`useProjects`, `useHealth`), `AuthProvider`, and `ProtectedRoute` guard.
- **Frontend Dashboard UI**: Platform health dashboard, project list page, project detail page, modal forms, badge components, and responsive Navbar.
- **CI/CD Quality Gates**: GitHub Actions workflows for continuous integration (`ci.yml`) and Docker Compose stack validation (`docker.yml`).
- **Production Hardening**: Production Docker Compose override (`docker-compose.prod.yml`).

## [0.1.0] - 2026-07-26
- Monorepo foundation, FastAPI scaffold, React 19 + Vite 8 frontend, and Docker Compose stack.
