# Security Policy

## Supported Versions

OpenDevX has not yet reached a stable release. Security support will be defined and published before the first stable release.

| Version | Supported |
| --- | --- |
| Unreleased development versions | Best-effort only |
| Stable releases | Policy to be published before the first stable release |

## Reporting a Vulnerability

Security reporting will be supported before the first stable release. Until then, please use GitHub Private Security Advisories to report suspected vulnerabilities privately.

Do not report security vulnerabilities through public GitHub issues. Provide a clear description, affected component or version, reproducible steps where safe, impact assessment, and any suggested mitigation.

## Responsible Disclosure

Please allow maintainers reasonable time to investigate and address a report before disclosing it publicly. Do not access data that does not belong to you, disrupt services, or expand testing beyond what is necessary to demonstrate the issue.

## Dependency Management

Dependencies are tracked through repository tooling and should be updated deliberately. Contributors must review security implications, licensing, compatibility, and test coverage when adding or upgrading dependencies.

## Secret Handling

Never commit credentials, tokens, private keys, kubeconfig files, Terraform state, or `.env` files containing secrets. Use local environment configuration and the appropriate secret-management mechanism for each deployment environment. If a secret is exposed, revoke or rotate it promptly and report the exposure privately.

## Deployment Guidance

Deploy OpenDevX behind a TLS-enabled reverse proxy such as Nginx, restrict platform access appropriately, keep hosts and runtimes patched, and apply least-privilege access controls to infrastructure integrations.
