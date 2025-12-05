# Project Conventions & Structure

> **Goal**: Minimal Friction, Maximum Synergy.
> **Philosophy**: "Colocation over Abstraction" and "Schema as Contract".

---

## 1. The "Synergy" Core (Shared Package)

To avoid redundancy, **Types and Validation Schemas** live in one place.

**Location**: `packages/shared/src/`

-   **Naming**: `[feature].schema.ts`
-   **Exports**:
    -   `[Feature]Schema` (Zod Object)
    -   `[Feature]Dto` (TypeScript Type inferred from Zod)

**Example**:
```typescript
// packages/shared/src/auth.schema.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof LoginSchema>;
```

---

## 2. Backend Structure (`apps/api`)

We use a **Feature-Based** structure. Everything related to a feature stays together.

**Pattern**: `src/modules/[feature]/`

```text
src/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts      # Fastify Routes
│   │   ├── auth.service.ts     # Business Logic
│   │   └── auth.test.ts        # Unit Tests
│   └── teams/
│       ├── team.routes.ts
│       └── ...
├── db/
│   ├── schema.ts               # Drizzle Tables
│   └── index.ts                # Connection
└── app.ts                      # Entry Point
```

**Naming Conventions**:
-   **Files**: `kebab-case.ts` (e.g., `auth-routes.ts`) or `camelCase.ts` (consistent with project).
-   **Routes**: `registerRoutes(fastify)`
-   **Handlers**: `loginHandler`, `registerHandler`

---

## 3. Frontend Structure (`apps/web`)

We mirror the backend's feature focus using a **Domain-Driven** approach.

**Pattern**: `src/features/[feature]/`

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/         # UI Components (LoginForm)
│   │   ├── hooks/              # Data Fetching (useLogin)
│   │   └── stores/             # State (authStore)
│   └── teams/
│       ├── components/
│       └── ...
├── components/
│   └── ui/                     # Shared Design System (Button, Input)
└── pages/                      # Route Definitions
```

**Naming Conventions**:
-   **Components**: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
-   **Hooks**: `use[Action].ts` (e.g., `useLogin.ts`)
-   **Stores**: `[feature]Store.ts` (e.g., `authStore.ts`)

---

## 4. The "No Friction" Workflow

1.  **Define**: Create the Schema in `packages/shared`.
    -   *Result*: `LoginSchema` is available.
2.  **Backend**: Import Schema in `auth.routes.ts`.
    -   *Result*: API automatically validates inputs. Types are inferred.
3.  **Frontend**: Import Schema in `LoginForm.tsx`.
    -   *Result*: Form validation uses the EXACT same rules.

**Why this works**:
-   **Zero Redundancy**: You write the validation rule ONCE.
-   **Max Freedom**: Inside `auth.service.ts` or `LoginForm.tsx`, you can write code however you want, as long as you respect the Schema contract.
-   **Type Safety**: If you change the Schema, both Frontend and Backend build processes will fail, preventing bugs.
