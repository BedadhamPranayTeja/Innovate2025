# Innovate 2025 EOS — Frontend Architecture

> **Scope**: `apps/web`
> **Framework**: React 18 + Vite + TypeScript
> **State**: Zustand + TanStack Query

## 1. Overview

The frontend is a **Phase-Aware Hackathon Platform**. It is built using a **Domain-Driven Architecture** to ensure scalability and maintainability.

### Core Principles
-   **Domain-Driven**: Code is organized by business domain (e.g., `auth`, `dashboard`, `judging`) rather than technical layer.
-   **Type Safety**: Imports shared types and schemas from `@innovate/types` and `@innovate/validators`.
-   **Component Driven**: UI is built using atomic components from `@innovate/ui` and documented in Storybook.

---

## 2. Folder Structure

```text
src/
├── domains/            # Business Domains
│   ├── auth/
│   │   ├── components/ # Domain-specific components
│   │   ├── hooks/      # Domain-specific hooks
│   │   ├── stores/     # Zustand stores (local state)
│   │   ├── api.ts      # API integration (TanStack Query)
│   │   └── types.ts    # Domain-specific types
│   ├── user/
│   ├── team/
│   └── ...
│
├── components/         # App-wide components (Layouts, etc.)
├── hooks/              # App-wide hooks (useTheme, etc.)
├── lib/                # Utilities
├── routes/             # Route definitions
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

---

## 3. State Management Strategy

We use a hybrid approach:

1.  **Server State (TanStack Query)**:
    -   Used for all async data (fetching teams, submissions, user profile).
    -   Handles caching, loading states, and re-fetching.
    -   **Pattern**: Custom hooks wrapping `useQuery` / `useMutation`.

2.  **Global Client State (Zustand)**:
    -   Used for synchronous global state (Auth session, UI preferences, Sidebar toggle).
    -   **Pattern**: Small, atomic stores (e.g., `useAuthStore`, `useUIStore`).

3.  **Form State (React Hook Form + Zod)**:
    -   Used for all forms.
    -   **Validation**: Uses shared Zod schemas from `@innovate/validators`.

---

## 4. Integration with Shared Packages

### UI Components
Import primitives from the shared UI package.

```typescript
import { Button, Card } from '@innovate/ui';
```

### Validation
Use shared schemas for form validation.

```typescript
import { LoginSchema } from '@innovate/validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(LoginSchema)
});
```

### Types
Use shared types for API responses.

```typescript
import type { User } from '@innovate/types';
```

---

## 5. Routing & Access Control

We use **React Router v6** with a custom `RoleGuard` wrapper.

-   **Public Routes**: Landing, Login, Register.
-   **Protected Routes**: Dashboard, Profile.
-   **Role-Based Routes**:
    -   `/admin/*` -> Requires `Role.ADMIN`
    -   `/judge/*` -> Requires `Role.JUDGE`

---

## 6. Testing & Documentation

-   **Component Development**: Storybook (`pnpm storybook`).
-   **E2E Testing**: Cypress (`pnpm cypress:open`).
-   **Unit Testing**: Vitest.
