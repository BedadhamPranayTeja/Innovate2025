# Vitest Architecture

> **Scope**: Shared Logic (Packages, Utils, Hooks)
> **Purpose**: Fast, Headless Unit Testing

## 1. Overview

We use **Vitest** for unit testing because it is a native Vite-powered test runner. It is fast, supports ESM out of the box, and shares configuration with our Vite build.

### Core Principles
1.  **Speed**: Tests should run instantly. If it's slow, it's probably an Integration Test (use Cypress).
2.  **Isolation**: Unit tests verify a single function or component in isolation, mocking all dependencies.
3.  **Shared Config**: We use a root `vitest.workspace.yaml` or shared config package to ensure consistency.

---

## 2. What to Test

We do **NOT** aim for 100% coverage. We aim for **100% confidence** in critical logic.

| Scope | What to Test | Example |
| :--- | :--- | :--- |
| **`packages/validators`** | Zod schemas | Ensure invalid emails are rejected. |
| **`packages/ui`** | Component logic | Ensure a button click handler fires. |
| **`apps/web/src/hooks`** | Custom hooks | Ensure `useAuth` handles session expiry. |
| **`apps/api/src/services`** | Business logic | Ensure price calculation is correct. |

> **Note**: Do not unit test simple UI rendering (use Storybook) or database queries (use Cypress/Integration tests).

---

## 3. File Structure

Tests are co-located with the code they test.

```text
src/
├── utils/
│   ├── currency.ts
│   └── currency.test.ts   # Unit test
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx    # Component logic test
```

---

## 4. Configuration

We use a shared configuration strategy.

```typescript
// packages/config/vitest-preset.ts
import { defineConfig } from 'vitest/config';

export const vitestPreset = defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // or 'node' for api/packages
    include: ['**/*.test.{ts,tsx}'],
  },
});
```

---

## 5. Running Tests

-   **Run All**: `pnpm test` (Runs all unit tests in the monorepo)
-   **Watch Mode**: `pnpm test --watch`
-   **Filter**: `pnpm test currency` (Runs only currency tests)
