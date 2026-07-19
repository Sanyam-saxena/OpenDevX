# OpenDevX

OpenDevX is an open-source Internal Developer Platform (IDP) for operating cloud-native infrastructure from a unified dashboard. It brings together Docker workloads, Kubernetes resources, Terraform state, CI/CD activity, and observability signals so platform teams can work from a consistent operational view.

## Purpose

Infrastructure workflows often span multiple tools, consoles, and configuration repositories. OpenDevX is intended to provide a focused interface for the day-to-day visibility and management needs of DevOps, platform, and cloud engineers, while remaining approachable for students and open-source contributors.

## Project Status

Sprint 0, Repository Foundation, is complete. Sprint 1, Engineering Foundation, is the current milestone; it prepares project standards and implementation boundaries without adding product capabilities. OpenDevX uses documentation-first development, follows [Conventional Commits](https://www.conventionalcommits.org/), and follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Engineering standards are defined in [ENGINEERING.md](ENGINEERING.md). Public API versioning will begin at `/api/v1` when the FastAPI service is introduced.

## Vision

OpenDevX aims to become a transparent, self-hostable platform layer that helps teams understand and operate their infrastructure without replacing the underlying tools and practices they already use.

## Planned Capabilities

- A unified dashboard for infrastructure status and operational context.
- Docker workload visibility and management.
- Kubernetes cluster and resource visualization.
- Terraform workspace and state visibility.
- CI/CD pipeline integration for GitHub Actions and Jenkins.
- Monitoring and log visibility through Prometheus, Grafana, Loki, and Promtail.
- Secure, role-aware access to platform settings and infrastructure connections.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python |
| Data | PostgreSQL, Redis |
| Infrastructure | Docker, Docker Compose, Kubernetes (Kind), Helm, Terraform, Nginx |
| Monitoring | Prometheus, Grafana, Loki, Promtail |
| CI/CD | GitHub Actions, Jenkins |
| Testing | Pytest, Vitest |
| Documentation | MkDocs Material |

## Repository Structure

- `apps/` — API and web application sources.
- `infrastructure/` — Docker, Kubernetes, Helm, Terraform, Nginx, and monitoring configuration.
- `packages/` — Shared packages and libraries.
- `docs/` — Project, setup, architecture, API, and decision documentation.
- `assets/` — Project images, logos, GIFs, and screenshots.
- `scripts/` — Development and automation utilities.
- `tests/` — Cross-application, integration, and end-to-end tests.

## Planned Architecture

The React web application will communicate with a FastAPI service that coordinates integrations with supported infrastructure and CI/CD systems. PostgreSQL will store platform data, Redis will support caching and asynchronous work where needed, and Nginx will provide reverse-proxy duties. Observability integrations will surface data from the selected monitoring stack without replacing those systems as sources of truth.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the high-level design principles and component overview.

## Documentation

- [Architecture overview](ARCHITECTURE.md)
- [Engineering handbook](ENGINEERING.md)
- [Development setup](SETUP.md)
- [API reference](API_REFERENCE.md)
- [Repository documentation](docs/)
- [Roadmap](ROADMAP.md)

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

## License

OpenDevX is released under the [MIT License](LICENSE).

## Repository URL

The canonical repository URL is [https://github.com/Sanyam-saxena/OpenDevX](https://github.com/Sanyam-saxena/OpenDevX).
