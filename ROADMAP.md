# OpenDevX Roadmap

This roadmap describes the planned progression of OpenDevX. Priorities may change as the project gains implementation experience and contributor feedback.

## Sprint 0 — Planning

- Define the platform scope, user roles, and supported integration boundaries.
- Document the initial architecture, technology choices, and repository standards.
- Establish contribution, security, and release documentation.
- Prepare initial dashboard workflows and interface concepts.

## Sprint 1 — Foundation

- Establish the FastAPI service and React application foundations.
- Define authentication, authorization, and platform configuration requirements.
- Introduce PostgreSQL and Redis integration patterns.
- Set up baseline testing, linting, and GitHub Actions checks.

## Sprint 2 — Docker

- Connect Docker environments through a defined integration boundary.
- Surface container, image, volume, and network status in the dashboard.
- Provide safe operational actions with clear status feedback.
- Add automated tests for Docker integration behavior.

## Sprint 3 — Kubernetes

- Connect Kubernetes clusters, beginning with local Kind environments.
- Visualize namespaces, workloads, pods, services, and events.
- Define role-aware Kubernetes operations and audit expectations.
- Document supported cluster access and configuration practices.

## Sprint 4 — Terraform

- Integrate Terraform workspace and state metadata.
- Present plan, apply, and drift-related context without obscuring Terraform as the source of truth.
- Define credential and state-access safeguards.
- Add documentation and tests for supported Terraform workflows.

## Sprint 5 — CI/CD

- Integrate GitHub Actions and Jenkins pipeline status.
- Display pipeline runs, stages, logs, and links to the originating provider.
- Connect deployment activity to relevant infrastructure context.
- Define configuration and access requirements for CI/CD providers.

## Sprint 6 — Monitoring

- Integrate Prometheus metrics and Grafana dashboards.
- Surface Loki logs through Promtail-backed collection workflows.
- Provide resource-level links between platform views and observability data.
- Document retention, access, and operational considerations.

## Sprint 7 — Platform Features

- Refine role-based access control, settings, and integration management.
- Improve search, filtering, operational history, and error handling.
- Complete performance, accessibility, and security review work.
- Expand automated integration and end-to-end coverage.

## Sprint 8 — Documentation & Release

- Publish MkDocs Material documentation for users and contributors.
- Complete installation, upgrade, and operational guidance.
- Finalize supported-version and security-reporting policies.
- Prepare the first stable release based on documented acceptance criteria.
