# Contributing to OpenDevX

Thank you for contributing to OpenDevX. Contributions from DevOps, platform, cloud, and application engineers help keep the project grounded in real operational needs.

## Development Philosophy

Prefer small, reviewable changes that improve clarity, safety, and maintainability. OpenDevX should integrate with established infrastructure tools without hiding their behavior or becoming their source of truth.

Read [ENGINEERING.md](ENGINEERING.md) before contributing. It is the engineering handbook for repository conventions, API and security standards, testing philosophy, dependency management, releases, and sprint workflow.

## Repository Standards

- Keep application, infrastructure, documentation, and test changes in their established directories.
- Add or update relevant tests when changing behavior, including error and authorization paths where applicable.
- Follow the formatting and linting rules introduced with each application.
- Do not commit credentials, generated secrets, local state, or environment-specific configuration.
- Keep documentation aligned with user-visible behavior and supported workflows.

## Branch Strategy

Create focused branches from `main` using one of the following patterns:

- `feature/short-description`
- `bugfix/short-description`
- `docs/short-description`
- `chore/short-description`

Keep branches narrowly scoped and rebase or merge the current `main` branch before requesting review when necessary.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) for all commits. Examples:

- `feat: add cluster summary view`
- `fix: handle expired provider token`
- `docs: clarify local setup prerequisites`
- `test: cover terraform workspace parsing`

## Pull Requests

Open a pull request against `main` using the provided template. A pull request should explain the problem, describe the change, identify any configuration impact, and include relevant tests and documentation updates. Update documentation with every feature or user-visible behavior change. Keep unrelated refactoring out of the same pull request.

## Code Review

Reviewers assess correctness, security, maintainability, tests, accessibility where applicable, and documentation. Address review feedback constructively and keep discussion tied to the change. Resolve review conversations before merging unless an exception is explicitly recorded. Maintainers may request smaller follow-up pull requests when a change combines unrelated concerns.

## Documentation

Document changes that affect setup, configuration, supported integrations, API behavior, or operations. Use concise Markdown, accurate terminology, and links to the relevant source or document. Do not describe planned work as available functionality.

## Reporting Issues

Use the repository issue templates and include a clear title, environment details, expected behavior, actual behavior, and reproducible steps where applicable. Do not report security vulnerabilities through public issues; follow [SECURITY.md](SECURITY.md) instead.
