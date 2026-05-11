# Project Guidelines

## Architecture: Feature-Sliced Design (FSD)

```
src/
  features/        # domain-specific modules
    {feature}/
      components/  # presentational components
      containers/  # components with logic/data wiring
      hooks/       # custom hooks
      constants/
  pages/           # route-level components
  shared/          # cross-feature utilities, UI kit
  navigator/       # routing config
  styles/
```

Each feature is self-contained. Do not import from one feature into another — go through `shared/` instead.

---

## Code Conventions

### TypeScript

- Use `type`, never `interface`
- Type names: `PascalCase`, prefix with domain context — `export type TemperatureType`

### Components

- Declare as named function: `export function MyComponent() {}`
- Never use `export default`
- Component and hook names: `PascalCase`

### Variables

| Kind | Case | Example |
|---|---|---|
| Component / Hook | PascalCase | `UserCard`, `useAuth` |
| Constant | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| General variable | camelCase | `userId` |
| File / Folder | kebab-case | `user-card.tsx` |

---

## Git

### Branch naming

```
{type}/{issue-number}-{short-description}
```

Example: `feat/15-heatmap`

### Commit format (Gitmoji)

| Emoji | Type | When to use |
|---|---|---|
| ✨ | feat | New feature |
| 🐛 | fix | Bug fix or code correction |
| 📦 | chore | No behavior change (comments, config) |
| 📝 | docs | README or documentation |
| 🚀 | deploy | Deployment-related |
| 💄 | style | Design / UI only |
| ♻️ | refactor | Full rewrites, refactoring |
| ✅ | test | Add or update tests |

Example commit: `✨ feat: 히트맵 컴포넌트 추가`

### Issue & PR titles

```
[TYPE] description
```

Example: `[FEAT] projects 모듈 관련 마이그레이션`

### Branch strategy

Trunk-based development off `main`. Short-lived feature branches, merged via PR.

---

## What Claude should do by default

- Use `type` not `interface`
- Use named `export function` not `export default`
- Place new features under `src/features/{feature-name}/`
- Follow the FSD layer structure — components vs containers vs hooks
- Use kebab-case for new file and folder names
- Commit messages should follow Gitmoji format when creating commits
