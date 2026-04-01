# Git Workflow Standards

## Default Branch

- `main` is always stable and deployable.

## Branch Naming

- `feature/<scope>-<short-description>`
- `fix/<scope>-<short-description>`
- `chore/<scope>-<short-description>`
- `docs/<scope>-<short-description>`

Example:

- `feature/backend-auth-register-login`

## Commit Convention

Use Conventional Commits:

- `feat: add JWT login endpoint`
- `fix: prevent negative stock on sale`
- `docs: add API contract examples`
- `chore: configure eslint and prettier`

## Pull Request Rules

- One logical change per PR
- Link issue when available
- Include test notes and screenshots if relevant
- Request review before merge

## Merge Strategy

- Squash and merge for clean history

## Release Tags

- Semantic versioning: `vMAJOR.MINOR.PATCH`
