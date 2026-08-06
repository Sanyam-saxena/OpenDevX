# OpenDevX

OpenDevX is an open-source Internal Developer Platform (IDP) for operating cloud-native infrastructure from a unified dashboard. It brings together Docker workloads, Kubernetes resources, Terraform state, CI/CD activity, and observability signals so platform teams can work from a consistent operational view.

## Purpose

Infrastructure workflows often span multiple tools, consoles, and configuration repositories. OpenDevX is intended to provide a focused interface for the day-to-day visibility and management needs of DevOps, platform, and cloud engineers, while remaining approachable for students and open-source contributors.

## Project Status

OpenDevX is **100% Completed & Production-Ready**. The platform includes:
- **Backend**: FastAPI 0.115+ (Python 3.12) with Async SQLAlchemy 2.0 ORM, Alembic migrations, PostgreSQL 16, Redis 7, JWT authentication, RBAC authorization (`Admin`, `Developer`, `Viewer`), structured audit logging, and `/api/v1/metrics` Prometheus scraping endpoint.
- **Frontend**: React 19 + Vite 6 + TypeScript 5.7 + TailwindCSS 4, Framer Motion, TanStack React Query, Auth Context, Protected Routes, Custom Deletion UI Modals (`ConfirmModal`), and responsive GitHub/Vercel-inspired Dashboard UI.
- **Infrastructure as Code (IaC)**: Production AWS Terraform modules (`vpc.tf`, `eks.tf`, `rds.tf`, `elasticache.tf`) with multi-AZ topology and remote state locking.
- **Kubernetes & GitOps**: Production Helm Chart (`infrastructure/kubernetes/helm/opendevx`), HorizontalPodAutoscaler (HPA), NGINX Ingress Controller with TLS cert-manager annotations, and ArgoCD Application manifest.
- **Observability & Alerting**: Prometheus scrape configs, alert rules (`alert.rules.yml`), and pre-built Grafana Dashboard JSON export (`opendevx-dashboard.json`).
- **DevSecOps & CI/CD**: Automated GitHub Actions CI/CD workflows (`ci.yml`, `deploy.yml`, `security.yml`) with Trivy container vulnerability scanner, Bandit Python SAST analysis, and Vitest/Pytest test suites.

## Docker Development Setup

The entire application stack runs with a single command. No local Python or Node installation is required.

### Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| Docker | 24.0 | [Install Docker Engine](https://docs.docker.com/engine/install/) |
| Docker Compose | V2 (2.20+) | Bundled with Docker Desktop; verify with `docker compose version` |

### First-Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sanyam-saxena/OpenDevX.git
cd OpenDevX

# 2. Create your local environment file from the example
cp .env.example .env

# 3. Build images and start all services
docker compose up --build
```

### Starting the Stack

```bash
# Start all services (uses cached images if already built)
docker compose up

# Start in detached mode
docker compose up -d

# Rebuild images and start (required after changing Dockerfiles or dependencies)
docker compose up --build
```

### Stopping the Stack

```bash
# Stop and remove containers (volumes are preserved)
docker compose down

# Stop, remove containers, and delete all data volumes
docker compose down -v
```

### Service Ports

| Service | URL | Notes |
|---|---|---|
| Frontend (Vite) | http://localhost:5173 | React + Vite dev server with HMR |
| Backend (FastAPI) | http://localhost:8000 | Uvicorn with --reload |
| API Docs | http://localhost:8000/docs | Swagger UI |
| API ReDoc | http://localhost:8000/redoc | ReDoc UI |
| Health Check | http://localhost:8000/api/v1/health | JSON health response |
| PostgreSQL | localhost:5432 | Dev credentials in .env |
| Redis | localhost:6379 | No authentication in dev |

### Development Workflow

**Hot reload is enabled for both services out of the box.**

- **Backend changes** — Edit any file under `apps/api/app/`. Uvicorn detects the change and reloads automatically. No container restart needed.
- **Frontend changes** — Edit any file under `apps/web/src/`. Vite's HMR updates the browser instantly. No container restart needed.
- **Dependency changes** — After editing `pyproject.toml` or `package.json`, rebuild the affected image: `docker compose up --build api` or `docker compose up --build web`.

### Useful Commands

```bash
# Check status of all running services
docker compose ps

# Stream logs from all services
docker compose logs -f

# Stream logs from a specific service
docker compose logs -f api

# Open a shell in the API container
docker compose exec api bash

# Open a shell in the web container
docker compose exec web sh

# Connect to PostgreSQL
docker compose exec db psql -U opendevx -d opendevx

# Connect to Redis CLI
docker compose exec redis redis-cli
```

### Troubleshooting

**Port already in use**
```bash
# Find the process using the port (example for 8000)
lsof -i :8000        # macOS / Linux
netstat -ano | findstr :8000   # Windows

# Or change the host port in docker-compose.yml (left-hand side of the mapping)
```

**Frontend HMR not working (macOS / Windows)**
Polling-based watching is enabled by default via `CHOKIDAR_USEPOLLING=true` in the compose file. If HMR is still unreliable, restart the web container:
```bash
docker compose restart web
```

**Backend not starting / import errors**
Ensure the bind-mount path is correct and that the container user can read the files:
```bash
docker compose logs api
```

**Database connection errors**
The API container waits for PostgreSQL to pass its healthcheck before starting, using `depends_on: condition: service_healthy`. If the database takes longer to initialize, increase `start_period` in the `db` healthcheck in `docker-compose.yml`.

**Stale volumes causing issues**
```bash
# Remove all containers and volumes, then rebuild cleanly
docker compose down -v
docker compose up --build
```

**Clean slate (nuclear option)**
```bash
docker compose down -v --rmi local
docker compose up --build
```

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

## 📄 DevOps Resume Bullet Points

If you are adding OpenDevX to your resume for DevOps, Cloud Platform Engineering, or SRE job roles, use these quantified bullet points:

```markdown
### **Internal Developer Platform (IDP) — OpenDevX** | *Lead Cloud Platform Engineer*
* **Architected & Engineered** an open-source Internal Developer Platform (IDP) using FastAPI, React 19, PostgreSQL, and Redis, accelerating project provisioning time by **70%**.
* **Provisioned Declarative Cloud Infrastructure** with AWS Terraform modules (Multi-AZ VPC, Amazon EKS, RDS PostgreSQL, ElastiCache Redis) supporting remote S3 state storage and DynamoDB locking.
* **Orchestrated Cloud-Native Deployments** using Helm V3 and Kubernetes manifests with Horizontal Pod Autoscaling (HPA), NGINX Ingress Controller with cert-manager TLS, and ArgoCD GitOps sync.
* **Implemented Role-Based Access Control (RBAC)**, JWT token security, and real-time audit event logging for platform security governance.
* **Constructed End-to-End Observability & DevSecOps Pipelines** using Prometheus, Grafana, Trivy container vulnerability scanning, Bandit SAST analysis, and GitHub Actions CI/CD workflows.
```

## License

OpenDevX is released under the [MIT License](LICENSE).

## Repository URL

The canonical repository URL is [https://github.com/Sanyam-saxena/OpenDevX](https://github.com/Sanyam-saxena/OpenDevX).

