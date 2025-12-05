# Innovate 2025 - Tooling Architecture

> **Unified Documentation**: Storybook, Postman, Cypress

## 1. The Testing Pyramid

We use a multi-layered approach to quality assurance, ensuring speed and confidence at every level.

```mermaid
graph TD
    A[Cypress E2E] -->|Integration| B[Postman API Tests]
    B -->|Contract| C[Storybook UI Tests]
    C -->|Visual| D[Unit Tests (Vitest)]
```

| Layer | Tool | Scope | Responsibility |
| :--- | :--- | :--- | :--- |
| **E2E** | **Cypress** | Full Stack | Verify critical user flows (Login -> Team -> Submit). |
| **API** | **Postman** | Backend | Verify API contract, schema validation, and logic. |
| **UI** | **Storybook** | Frontend | Verify component isolation, states, and accessibility. |
| **Unit** | **Vitest** | Shared Logic | Verify utilities, hooks, and shared helpers. |

---

## 2. Storybook (Frontend Workshop)
**Location**: `apps/web/STORYBOOK.md`

Storybook is used to build and document UI components in isolation.
-   **Goal**: Ensure components look correct in all states (Loading, Error, Empty) before using them in pages.
-   **Key Feature**: "Autodocs" generates the design system documentation automatically.
-   **Workflow**: Create Component -> Create Story -> Verify Visuals -> Integrate into Page.

---

## 3. Postman (API Contract)
**Location**: `apps/api/POSTMAN.md`

Postman is the source of truth for the Backend API.
-   **Goal**: Ensure the Backend works independently of the Frontend.
-   **Key Feature**: Automated Test Scripts run after every request to validate JSON Schema.
-   **Workflow**: Define Route -> Implement Handler -> Test in Postman -> Push Code.

---

## 4. Cypress (Integration Guardrails)
**Location**: `CYPRESS.md`

Cypress tests the application as a real user would.
-   **Goal**: Catch regressions in critical paths that span multiple systems (FE + BE + DB).
-   **Key Feature**: Time-travel debugging and video recording of failures.
-   **Workflow**: Run locally before major merges. Run in CI/CD pipeline before deployment.

---

## 5. Vitest (Unit Testing)
**Location**: `VITEST.md` (Root)

Vitest handles our low-level logic verification.
-   **Goal**: Verify individual functions and hooks in isolation.
-   **Key Feature**: Native ESM support and instant HMR-like feedback.
-   **Workflow**: Write Code -> Write `*.test.ts` -> Run `pnpm test`.

---

## 6. Docker (Containerization)
**Location**: `DOCKER.md` (Root)

Docker ensures our app runs the same way everywhere.
-   **Goal**: Eliminate "it works on my machine" issues.
-   **Key Feature**: Multi-stage builds for optimized production images.
-   **Workflow**: `docker-compose up` for full stack dev. `turbo prune` for efficient builds.

---

## 7. Integration Strategy

How these tools work together in the **Turborepo** pipeline:

```json
// turbo.json
{
  "pipeline": {
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "test:e2e": {
      "dependsOn": ["^build"],
      "cache": false
    }
  }
}
```

1.  **`pnpm dev`**: Starts Frontend (Vite), Backend (Fastify), and Storybook.
2.  **`pnpm test`**: Runs Unit Tests and Postman Collection Runner (via Newman).
3.  **`pnpm test:e2e`**: Builds the app and runs Cypress against the production build.
