# Docker Architecture

> **Scope**: Root (Infrastructure)
> **Purpose**: Containerization & Orchestration

## 1. Overview

We use Docker to containerize our applications for consistent deployment across environments (Local, Staging, Production).

### Core Principles
1.  **Multi-Stage Builds**: We use multi-stage builds to keep production images small.
2.  **Pruning**: We use `turbo prune` to isolate package dependencies (including shared packages like `@innovate/ui`), ensuring that a change in `web` doesn't invalidate the cache for `api`.
3.  **Environment Parity**: The container running locally via `docker-compose` should be nearly identical to the one running in production.

---

## 2. Container Strategy

We have two primary containers managed via `docker-compose.yml`.

| Service | Context | Dockerfile | Port |
| :--- | :--- | :--- | :--- |
| **web** | `.` | `apps/web/Dockerfile` | `80` (Nginx) |
| **api** | `.` | `apps/api/Dockerfile` | `3000` |

> **Note**: We do NOT containerize the Database for production. We use managed Neon Postgres. For local dev, you *can* add a Postgres service, but we recommend connecting to a Dev branch in Neon.

---

## 3. Dockerfile Strategy (Turborepo)

Building a monorepo in Docker is tricky because of shared dependencies. We use `turbo prune` to generate a "sliced" view of the monorepo for each app.

### Standard Build Flow
1.  **Prune**: `turbo prune --scope=@innovate/web --docker` (Generates a minimal `out` folder)
2.  **Install**: Copy `out/json` and run `pnpm install` (Cached layer)
3.  **Build**: Copy `out/full` and run `pnpm build`
4.  **Runner**: Copy build artifacts to a lightweight runtime image (Alpine/Distroless)

---

## 4. Docker Compose (Local Development)

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:3000
  
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - apps/api/.env
```
