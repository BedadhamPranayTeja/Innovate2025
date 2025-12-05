# Innovate 2025 — Full Technical Blueprint

## 1. Monorepo Structure (Turborepo)
```
/ 
  turbo.json
  package.json
  tsconfig.base.json
  .env
  apps/
    api/                # Fastify backend
      src/
        features/
          auth/
            auth.routes.ts
            auth.controller.ts
            auth.service.ts
            auth.schema.ts       # Zod shared schema
            auth.db.ts           # Drizzle queries
          user/
            user.routes.ts
            user.controller.ts
            user.service.ts
            user.schema.ts
            user.db.ts
        plugins/
        index.ts
      package.json
    web/                # React frontend
      src/
        domains/
          auth/
            LoginPage.tsx
            RegisterPage.tsx
            useAuth.ts
            auth.query.ts       # TanStack Query
            auth.store.ts       # Zustand
            auth.schema.ts      # shared Zod
          user/
            UserPage.tsx
            useUser.ts
            user.query.ts
            user.store.ts
            user.schema.ts
        components/
        hooks/
        routes/
        utils/
        main.tsx
      package.json
  packages/
    ui/                # Shared components, Radix + shadcn + motion + Tailwind Variants
      src/
        components/
        primitives/radix/
        motion/
        styling/
      package.json
    validators/        # Zod shared schemas
      auth.schema.ts
      user.schema.ts
      package.json
    types/             # Shared types
      AuthDTO.ts
      UserDTO.ts
      package.json
    db/                # Drizzle schema + migrations
      schema/
        auth.ts
        user.ts
      migrations/
      package.json
    config/            # Env, TS, lint configs
      env.ts
      tsconfig.base.json
      package.json
``` 

---

## 2. Backend Architecture (Fastify + Drizzle + Zod)
**Feature-based structure:**
- Each feature owns: routes, controller, service, schema, DB queries, types
- Zod schemas for validation and shared typing
- Drizzle for typed SQL queries
- Neon as cloud database

**Example Flow:**
```
POST /auth/register -> auth.routes -> auth.controller -> auth.service -> auth.schema (Zod) -> auth.db (Drizzle)
```

**RBAC & Access Control:**
- Guards middleware per role (Admin / Judge / Student)
- Feature-level permission checks

**Testing:**
- Unit tests per service (Jest)
- Integration tests for routes
- Postman collections for API verification

**Deployment:**
- Dockerized per app
- CI: lint, test, build pipelines
- Environment configs via .env + Zod validation

---

## 3. Frontend Architecture (React + Zustand + TanStack Query + UI Stack)
**Domain-driven structure:**
- Each domain owns pages, hooks, API adapters, state, types
- Zustand for local state
- TanStack Query for server data
- Shared Zod schemas for validation and typing

**UI System:**
- Radix primitives for accessibility
- shadcn components for patterns
- Tailwind Variants for consistent theming
- Framer Motion for animations
- Storybook for isolated component development

**Routing & Layouts:**
- React Router or equivalent
- Domain-specific layouts (dashboard, admin console, public pages)

**Testing:**
- Cypress for E2E tests
- Unit tests for hooks and utilities
- Storybook documentation serves as live component showcase

**Deployment:**
- Dockerized frontend
- CI pipelines: lint, test, build, deploy
- Environment configs via .env + Zod validation

---

## 4. Shared Packages / Synergy
| Package | Purpose |
|---------|---------|
| ui | Shared components, motion, styling, Radix, shadcn, variants |
| validators | Zod schemas shared between frontend & backend |
| types | DTOs, shared types for full stack |
| db | Drizzle schema + migrations, types for consistency |
| config | Env management, TS/ESLint configs |

This allows **type-safe roundtrip** from UI → API → DB → API → UI.

---

## 5. Tooling & DevOps
- **Turborepo**: orchestrates monorepo, builds, caching
- **Docker**: containerizes FE + BE
- **CI/CD**: pipelines for linting, testing, building, deploying
- **Postman**: API testing and documentation
- **.env** files validated via Zod
- **Storybook**: component library, UI documentation
- **Cypress**: end-to-end user flow tests

---

## 6. Development Flow
1. **Feature Planning:** define domain/feature → APIs → DB tables → UI components
2. **Backend Development:** write schema → controller → service → routes → tests
3. **Frontend Development:** build pages → state → API hooks → components → Storybook
4. **Integration:** connect API → frontend → server state → client state
5. **Testing & QA:** Cypress + unit tests + Postman collections
6. **Deployment:** Docker → cloud host
7. **Documentation:** Storybook + shared README + API docs

---

## 7. Example Feature Mapping
| Domain | Backend Feature | Frontend Domain | Shared Packages |
|--------|----------------|----------------|----------------|
| Auth | auth.routes/controller/service | auth page/hooks/store | validators, types, ui |
| User | user.routes/controller/service | user dashboard/hooks/store | validators, types, ui |
| Payments | payments.routes/controller/service | payments page/hooks/store | validators, types, ui |

This pattern repeats per feature, maintaining clear **vertical slices** in backend and **domain slices** in frontend.

---

## 8. Summary
- **Monorepo with Turborepo** for orchestrating FE/BE/shared packages
- **Feature-based Fastify backend** + **Drizzle ORM + Neon DB + Zod validation**
- **Domain-driven React frontend** + **Zustand + TanStack Query** + UI stack (Radix + shadcn + Tailwind Variants + Motion)
- **Storybook + Cypress + Postman** for documentation & testing
- **Docker + CI/CD** for deployment
- **Shared packages** enable type-safe end-to-end development
- Designed for **scalability, maintainability, and portfolio-ready projects**