# OpenDevX Engineering Handbook

This handbook defines the shared engineering practices for contributors to OpenDevX, an open-source Internal Developer Platform (IDP). It applies to documentation, application code, infrastructure configuration, tests, and operational integrations as the project progresses.

## Project Philosophy

OpenDevX helps platform and cloud engineering teams understand and operate cloud-native systems from one coherent interface. It complements Docker, Kubernetes, Terraform, CI/CD systems, and observability tools; it does not replace them as sources of truth. The project favors clear, auditable workflows, secure defaults, and incremental delivery over hidden automation or premature abstraction.

## Engineering Principles

- Preserve external systems as their domain authorities.
- Design integrations as modular boundaries with explicit permissions and failure modes.
- Prefer small, reviewable changes with documented behavior.
- Build secure and observable paths by default, applying least privilege throughout.
- Keep product, architecture, API, test, and operational documentation aligned.
- Avoid implementation work that is not required by the active sprint.

## Official Development Baselines

OpenDevX establishes strict version baselines for its runtime and execution environments:

- **Python**: Python 3.12
- **Node.js**: Node.js 22 LTS

Any future changes or upgrades to these version baselines require explicit review and corresponding documentation updates across the repository prior to adoption. No package managers or runtime dependencies are defined during this documentation phase.

## Repository Structure

- `apps/` contains the FastAPI API and React web application.
- `infrastructure/` contains future Docker, Kubernetes, Terraform, Nginx, and monitoring configuration.
- `packages/` contains future shared libraries.
- `docs/` contains long-form project and operational documentation.
- `assets/` contains logos, screenshots, and other project media.
- `scripts/` contains development and automation utilities.
- `tests/` contains cross-application, integration, and end-to-end tests.

The API is organized as `apps/api/app/api`, `core`, `domain`, `services`, `integrations`, `models`, `schemas`, `utils`, and `main.py`, with API tests in `apps/api/tests`. The React app is organized beneath `apps/web/src` into `app`, `pages`, `components`, `features`, `services`, `hooks`, `layouts`, `lib`, `styles`, `types`, and `assets`. Directory responsibilities are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## Folder Naming Conventions

- Use lowercase names for repository directories.
- Use concise, domain-oriented plural names for collections, such as `integrations` and `schemas`.
- Use kebab-case for frontend feature and component directories when a multiword name is needed.
- Keep cross-cutting utilities in the designated `utils` or `lib` directory; do not create catch-all folders elsewhere.
- Place a file in the narrowest directory that owns its responsibility.

## File Naming Conventions

- Use `snake_case.py` for Python modules and tests named `test_<subject>.py`.
- Use `PascalCase.tsx` for React components and `camelCase.ts` for TypeScript modules, hooks, and helpers.
- Use kebab-case for non-code configuration and documentation filenames unless a tool requires another convention.
- Name files for their responsibility, not their implementation detail; avoid generic names such as `helpers` or `misc`.

## Python Style Guidelines

- Target the Python version declared by the API service's `pyproject.toml`.
- Use type hints for public functions, service boundaries, and data passed between layers.
- Prefer small, cohesive modules and dependency injection at integration boundaries.
- Keep FastAPI route handlers thin; place business logic in services and domain logic in domain modules.
- Use Pydantic schemas for request and response contracts; do not expose persistence models directly.
- Follow the formatter, linter, and test tooling configured for the API service once introduced.

## TypeScript Style Guidelines

- Use TypeScript for application code and avoid `any` unless an integration boundary makes it unavoidable and documented.
- Keep UI components focused on rendering and accessibility; place feature behavior in feature modules and hooks.
- Define external API payloads and shared UI contracts explicitly in `types` or feature-owned type modules.
- Use semantic HTML, keyboard-accessible interactions, and clear loading, empty, and error states.
- Follow the formatter, linter, and test tooling configured for the web application once introduced.

## Formatting and Static Analysis

OpenDevX uses designated static analysis and formatting tooling to enforce consistency across codebases:

- **Backend**:
  - **Ruff**: Fast Python linter for enforcing style and detecting code flaws.
  - **Black**: Uncompromising Python code formatter for consistent code style.
- **Frontend**:
  - **ESLint**: Static code analysis tool for identifying patterns and errors in TypeScript/React.
  - **Prettier**: Opinionated code formatter for consistent JavaScript, TypeScript, and CSS styling.

Adherence to formatting and linting standards becomes mandatory for all code contributions once implementation begins. Configuration files will be introduced when code implementation starts in Sprint 1.

## API Design Standards

- Publish HTTP APIs through the FastAPI service and document supported contracts in [API_REFERENCE.md](API_REFERENCE.md).
- Use JSON request and response bodies except where an integration requires another documented format.
- Validate input at the API boundary and return typed, stable response schemas.
- Use standard HTTP status codes and avoid encoding status or errors solely in response text.
- Keep resource operations explicit, auditable, and appropriately authorized.

## REST Naming Conventions

- Use lowercase, plural, hyphenated resource paths, such as `/docker-containers`.
- Model resources with nouns; use HTTP methods for ordinary lifecycle actions.
- Use narrowly scoped action subresources only when an operation is not a normal resource lifecycle operation, such as `POST /pipelines/{pipeline_id}/runs`.
- Use query parameters for filtering, sorting, pagination, and time ranges.
- Use consistent identifiers and relationship paths across domains.

## API Versioning

All public API routes begin at `/api/v1`. Breaking API changes require a new versioned path and a documented migration or deprecation plan. Non-breaking additions should remain backward-compatible within the current version.

## Error Handling Standards

- Return a consistent JSON error envelope with a stable machine-readable code, human-readable message, and optional safe details.
- Do not expose stack traces, tokens, connection strings, provider responses containing secrets, or internal implementation details to clients.
- Distinguish validation, authorization, absence, conflict, provider, and unexpected server failures with appropriate HTTP status codes.
- Log complete diagnostic context internally while presenting actionable, safe user-facing messages.

## Logging Standards

- Use structured logs with timestamp, severity, service or component, request or correlation ID where available, and safe operational context.
- Log security-relevant administrative and infrastructure actions as auditable events.
- Never log credentials, tokens, passwords, kubeconfig content, Terraform state, or sensitive personal data.
- Use appropriate severity levels: debug for local diagnostics, info for lifecycle events, warning for recoverable issues, and error for failed operations requiring attention.

## Environment Variable Management

- Store environment-specific configuration in environment variables, not source code.
- Maintain a non-secret example configuration file when configuration is introduced, documenting each variable, its purpose, and safe default behavior.
- Validate required configuration during service startup and fail clearly when values are missing or invalid.
- Keep variable names explicit and namespaced by component where useful, such as `OPENDEVX_API_*`.

## Secrets Management

- Never commit credentials, access tokens, private keys, kubeconfig files, Terraform state, or populated `.env` files.
- Provide secrets through an approved secret-management mechanism for each environment.
- Grant service identities the minimum permissions needed for their integration.
- Rotate or revoke exposed secrets immediately and follow [SECURITY.md](SECURITY.md) for private reporting.

## Security Principles

- Apply least privilege, secure defaults, defense in depth, and explicit authorization.
- Treat Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, Prometheus, Grafana, Loki, PostgreSQL, and Redis connections as privileged boundaries.
- Validate all untrusted input and protect operational actions against accidental or unauthorized execution.
- Keep dependencies patched and review the security, license, and maintenance impact of additions.
- Document security-relevant design decisions and never disclose vulnerabilities in public issues.

## Testing Philosophy

- Test behavior at the most focused layer that proves the requirement.
- Add or update tests with every behavioral change, including error and authorization cases when applicable.
- Keep unit tests fast and deterministic; reserve integration and end-to-end tests for real boundary behavior.
- Do not merge known regressions, skipped tests without an issue reference, or untested behavior changes without explicit reviewer agreement.

## Quality Gates

To ensure code health, stability, and security, every future Pull Request must eventually satisfy automated quality gates across all codebase layers:

- **Backend**:
  - **Ruff**: Linting and style verification
  - **Black**: Code formatting check
  - **Pytest**: Unit and integration test execution
- **Frontend**:
  - **ESLint**: Linter check for code quality and patterns
  - **Prettier**: Code formatting check
  - **Vitest**: Unit and component test execution
- **Repository-Wide**:
  - **Secret scanning**: Automated checks to prevent credential or token leaks
  - **Dependency review**: Vulnerability and license auditing for added dependencies

These quality gate checks will be configured and enforced during Sprint 1 and later implementation phases—not during this initial documentation phase.

## Git Workflow

- Create a focused branch from the current `main` branch for each independent change.
- Keep commits cohesive, reviewable, and limited to the task scope.
- Rebase or merge current `main` as appropriate before review, resolving conflicts deliberately.
- Do not commit generated secrets, local state, unrelated formatting changes, or unrelated refactors.

## Conventional Commit Rules

Use Conventional Commits with a concise imperative summary. Valid types include `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `ci`, `chore`, and `perf`. Examples:

- `feat: add docker environment connection model`
- `fix: handle expired provider token`
- `docs: clarify API versioning policy`
- `test: cover terraform workspace parsing`

Use a scope when it improves clarity, such as `feat(api): add health endpoint`. Mark breaking changes with `!` and describe them in the commit body.

## Branch Naming Conventions

Use lowercase, slash-separated branches with a concise kebab-case description:

- `feature/short-description`
- `bugfix/short-description`
- `docs/short-description`
- `chore/short-description`
- `release/v0.1.0`

## Pull Request Checklist

- The branch and commits follow the repository conventions.
- The change has a focused purpose and no unrelated edits.
- Required tests and checks pass, or any limitation is explicitly documented.
- Documentation, API contracts, configuration examples, and changelog entries are updated where affected.
- Security, permissions, migration, and operational impacts are described.
- Screenshots or recordings are included for material user-interface changes when applicable.

## Code Review Expectations

Authors provide context, testing evidence, and known limitations. Reviewers evaluate correctness, security, maintainability, test coverage, accessibility where applicable, and documentation accuracy. Feedback should be specific, respectful, and tied to the change. Resolve conversations before merging or record the reason for any exception.

## Documentation Requirements

Documentation-first development is required for user-visible behavior, architecture, setup, configuration, supported integrations, API contracts, and operational effects. Update the appropriate documentation in the same pull request as the change. Do not present planned work as available functionality.

## Dependency Management

- Add dependencies only when they are necessary and actively maintained.
- Review security advisories, licensing, compatibility, transitive impact, and maintenance cost before adoption.
- Pin and update dependencies according to the package manager's lockfile and project policy once toolchains are introduced.
- Dependabot updates require the same review and test expectations as other changes.

## Release Strategy

Releases are prepared from stable, reviewed work with passing required checks and complete release notes. Each release must identify supported capabilities, upgrade notes, security considerations, and known limitations. Release branches use the `release/vX.Y.Z` convention when a stabilization branch is necessary.

## Semantic Versioning

OpenDevX follows Semantic Versioning: increment MAJOR for incompatible public changes, MINOR for backward-compatible capabilities, and PATCH for backward-compatible fixes. Until the first stable release, versioning and compatibility expectations must be stated clearly in release notes and API documentation.

## Sprint Workflow

Each sprint begins by confirming scope against [ROADMAP.md](ROADMAP.md), defining acceptance criteria, and documenting affected architecture or API decisions. Work proceeds in small pull requests with tests and documentation updated alongside behavior. At sprint close, record completed work, deferred items, and changes to planned scope in the roadmap or changelog as appropriate. Sprint 0 remains frozen as the repository foundation; Sprint 1 establishes engineering foundations without implementing product capabilities.
