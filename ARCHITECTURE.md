# Innovate 2025 EOS — System Architecture

> **Status**: Active
> **Source of Truth**: `planning/lock/Technical Blueprint.md`

## 1. High-Level Overview

**Innovate 2025 EOS** is a full-stack hackathon operating system designed for high performance, type safety, and developer synergy. It uses a monorepo structure to share code between the Frontend (`apps/web`) and Backend (`apps/api`), ensuring end-to-end type safety.

### Core Principles
-   **Single Source of Truth**: Shared types and schemas drive both API contracts and UI forms.
-   **Domain-Driven Design**: Code is organized by feature/domain (Auth, User, Team) rather than technical layer.
-   **Type Safety**: TypeScript, Zod, and Drizzle ensure compile-time safety from Database to UI.

---

## 2. Monorepo Structure

We use **Turborepo** to manage the workspace.

```text
/
├── apps/
│   ├── web/                # React + Vite Frontend
│   └── api/                # Fastify + Drizzle Backend
│
├── packages/
│   ├── ui/                 # Shared UI Components (shadcn/ui, Radix)
│   ├── validators/         # Shared Zod Schemas (API Contracts)
│   ├── types/              # Shared TypeScript Interfaces (DTOs)
│   ├── db/                 # Drizzle ORM Schema & Migrations
│   └── config/             # Shared ESLint, TSConfig, Env vars
│
├── planning/               # Project Documentation & Blueprints
├── turbo.json              # Build pipeline configuration
└── package.json            # Root workspace config
```

---

## 3. Shared Packages Strategy

To maximize code reuse and consistency, we extract core logic into shared packages:

| Package | Purpose | Dependencies |
| :--- | :--- | :--- |
| **`@innovate/ui`** | Reusable UI components, design tokens, and layout primitives. | `react`, `tailwindcss`, `radix-ui` |
| **`@innovate/validators`** | Zod schemas for API requests, form validation, and env vars. | `zod` |
| **`@innovate/types`** | Pure TypeScript types shared between FE/BE (e.g., API Responses). | *(none)* |
| **`@innovate/db`** | Database schema definitions, migrations, and query client. | `drizzle-orm`, `postgres` |
| **`@innovate/config`** | Shared configuration for tools (ESLint, Prettier, TS). | *(dev dependencies)* |

---

## 4. Application Architecture

### Frontend (`apps/web`)
-   **Framework**: React 18 + Vite
-   **State**: Zustand (Global), TanStack Query (Server)
-   **Styling**: Tailwind CSS + Shadcn UI
-   **Architecture**: Domain-Driven (modules by feature)
-   **Documentation**: `apps/web/ARCHITECTURE.md`

### Backend (`apps/api`)
-   **Framework**: Fastify
-   **Database**: Neon (PostgreSQL) via Drizzle ORM
-   **Validation**: Zod (shared with frontend)
-   **Architecture**: Feature-Based (modules by feature)
-   **Documentation**: `apps/api/ARCHITECTURE.md`

---

## 5. Tooling & CI/CD

-   **Build System**: Turborepo (Caching, Orchestration)
-   **Package Manager**: PNPM (Workspace support)
-   **Linting**: ESLint + Prettier
-   **Testing**:
    -   **E2E**: Cypress (`apps/web`)
    -   **API**: Postman (`apps/api`)
    -   **Unit**: Vitest
-   **Documentation**:
    -   **Components**: Storybook (`apps/web`)
    -   **API**: Postman Collections (`apps/api`)
