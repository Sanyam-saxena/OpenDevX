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

## Design Principles

- Preserve underlying tools as sources of truth.
- Prefer explicit, auditable operations over opaque automation.
- Apply least privilege to users, services, and infrastructure integrations.
- Keep integrations modular so support can evolve independently.
- Make operational state understandable through clear status, errors, and links to source systems.
- Treat documentation, testing, and secure defaults as part of the platform contract.
