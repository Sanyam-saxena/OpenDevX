# OpenDevX Development Setup

## Supported Operating Systems

Development is planned and documented for current Linux, macOS, and Windows environments. Linux and macOS may use a native container runtime; Windows development is expected to use a supported Linux container environment such as WSL 2 with Docker Desktop or an equivalent setup.

## Development Prerequisites

The initial development environment will require the following tools:

- Git
- Python for the FastAPI service and Pytest
- Node.js for the React, TypeScript, Vite, Vitest, and Tailwind CSS toolchain
- Docker and Docker Compose
- Kind, Kubernetes tooling, and Helm for local cluster development
- Terraform for infrastructure workflow development

PostgreSQL, Redis, Prometheus, Grafana, Loki, Promtail, Nginx, GitHub Actions, and Jenkins are part of the planned platform ecosystem. Their local configuration guidance will be added with the relevant implementation milestones.

## Repository Cloning

Clone OpenDevX from its published repository and open the project root in your preferred editor. The canonical repository URL is [https://github.com/Sanyam-saxena/OpenDevX](https://github.com/Sanyam-saxena/OpenDevX).

Installation and run commands are intentionally not included yet. They will be added when implementation begins after the Sprint 1 Engineering Foundation is complete.

## Development Philosophy

Work in small, independently reviewable changes. Keep local configuration out of version control, protect infrastructure credentials, and update documentation when a change affects contributor setup or operational behavior. Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for repository standards.
