# OpenDevX Architecture

## Project Vision

OpenDevX is designed as a self-hostable Internal Developer Platform that gives teams a coherent view of cloud-native operations while preserving the systems they already use for infrastructure, delivery, and observability.

## High-Level Architecture

The platform is planned as a web application backed by an API service. The web application presents operational data and management workflows; the API service coordinates authenticated access to supported infrastructure, CI/CD, and monitoring systems. PostgreSQL will hold platform data and Redis will support caching and background coordination. Nginx will serve as the reverse-proxy boundary.

External systems, including Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, Prometheus, Grafana, Loki, and Promtail, remain the authoritative sources for their respective domains.

## Core Components

- **Web application** — React, TypeScript, Vite, Tailwind CSS, and shadcn/ui provide the operator-facing interface.
- **API service** — FastAPI and Python provide platform APIs, integration orchestration, and access controls.
- **Platform data** — PostgreSQL stores durable platform metadata; Redis supports cache and coordination needs.
- **Infrastructure integrations** — Docker, Kubernetes, Helm, and Terraform expose infrastructure context through supported interfaces.
- **Delivery integrations** — GitHub Actions and Jenkins provide pipeline and deployment context.
- **Observability integrations** — Prometheus, Grafana, Loki, and Promtail provide metrics, dashboards, and logs.
- **Edge and deployment layer** — Nginx, Docker Compose, Kubernetes, and Terraform support deployment environments.

## Application Directory Layout

The following layout defines the intended implementation boundaries. These directories describe the architecture and do not indicate that implementation has begun.

### Backend: `apps/api`

- `app/api/` — versioned FastAPI route modules, request handling, and API dependencies. Public routes begin at `/api/v1`.
- `app/core/` — application configuration, security primitives, logging setup, and shared framework-level concerns.
- `app/domain/` — domain rules and concepts that remain independent of transport, persistence, and provider details.
- `app/services/` — use-case orchestration and business workflows invoked by API routes or background work.
- `app/integrations/` — adapters for Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, Prometheus, Grafana, Loki, and other external systems.
- `app/models/` — durable data models and persistence mappings for platform-owned metadata.
- `app/schemas/` — validated request, response, and internal transfer schemas; API contracts must not expose persistence models directly.
- `app/utils/` — small, shared helpers with no domain ownership.
- `app/main.py` — FastAPI application composition and service entry point.
- `tests/` — API service unit and integration tests.
- `pyproject.toml` — Python package metadata, tool configuration, and dependencies.
- `Dockerfile` — future API container build definition.

### Frontend: `apps/web/src`

- `app/` — web application bootstrap, routing composition, and top-level providers.
- `pages/` — route-level screens composed from features and reusable components.
- `components/` — shared, reusable presentational UI components.
- `features/` — domain-oriented UI behavior, state, and feature-specific components.
- `services/` — API clients and frontend-facing external service adapters.
- `hooks/` — reusable React hooks.
- `layouts/` — reusable page and application layout compositions.
- `lib/` — framework-neutral client utilities and shared frontend helpers.
- `styles/` — global styling, design tokens, and stylesheet entry points.
- `types/` — shared TypeScript types that are not owned by a single feature.
- `assets/` — frontend-bundled images, icons, and other static assets.

## Design Principles

- Preserve underlying tools as sources of truth.
- Prefer explicit, auditable operations over opaque automation.
- Apply least privilege to users, services, and infrastructure integrations.
- Keep integrations modular so support can evolve independently.
- Make operational state understandable through clear status, errors, and links to source systems.
- Treat documentation, testing, and secure defaults as part of the platform contract.
