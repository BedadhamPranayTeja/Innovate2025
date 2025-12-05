# Cypress Architecture

> **Scope**: Root (Integration)
> **Purpose**: End-to-End (E2E) Critical Flow Verification

## 1. Overview

Cypress is our **Integration Guardrail**. Unlike Unit Tests (Vitest) or Component Tests (Storybook), Cypress tests the **entire application stack** (Frontend + Backend + Database) working together.

### Core Principles
1.  **User-Centric**: Tests simulate real user interactions (clicks, typing), not code execution.
2.  **Critical Paths Only**: We do not test every edge case here. We test the "Happy Paths" that *must* work for the event to succeed.
3.  **Resilient Selectors**: Use `data-testid` attributes, never CSS classes or XPaths.

---

## 2. Directory Structure

Cypress lives at the root to access both apps if needed, but primarily targets the Web URL (`apps/web`).

```text
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.ts
│   │   └── register.cy.ts
│   ├── team/
│   │   ├── create-team.cy.ts
│   │   └── join-flow.cy.ts
│   └── submission/
│       └── submit-project.cy.ts
├── support/
│   ├── commands.ts       # Custom commands (e.g., cy.login())
│   └── e2e.ts
└── fixtures/             # Static test data
    ├── user.json
    └── project.json
```

---

## 3. Critical Flows (The "Golden Paths")

These are the scenarios we automate.

| Flow | Description | Success Criteria |
| :--- | :--- | :--- |
| **Registration** | User signs up -> Onboarding Wizard -> Dashboard | User lands on Dashboard with correct role. |
| **Team Formation** | User A creates Team -> User B requests join -> User A approves | Both users see the same Team ID. |
| **Submission** | Team fills form -> Uploads file -> Submits | Submission status becomes `SUBMITTED`. |
| **Judging** | Judge views queue -> Scores project -> Submits | Score is recorded in DB. |

---

## 4. Best Practices

### Custom Commands (`cy.login()`)
Don't repeat login logic. Use a custom command.

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password })
    .then((resp) => {
      window.localStorage.setItem('token', resp.body.token);
    });
});
```

### Selecting Elements
Use stable attributes.

-   ❌ `cy.get('.btn-primary')` (Brittle)
-   ❌ `cy.get('div > button:first')` (Brittle)
-   ✅ `cy.get('[data-testid="submit-btn"]')` (Stable)

### Database Reset
Before *every* test run, the database must be reset to a known clean state.
`cy.exec('pnpm --filter @innovate/db db:reset')`
