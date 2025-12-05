# Documentation Alignment Report

> **Date**: December 5, 2025
> **Sources of Truth**:
> 1.  `planning/SSOT Blueprint.md` (Functional)
> 2.  `planning/STACK_BREAKDOWN.md` (Technical)

---

## 1. Executive Summary

The project is in a **Transition Phase** from a Mock/Prototype architecture to a Real Full-Stack architecture.
-   **High Alignment**: The new planning documents (`BACKEND_SPEC`, `TOOLING`, `DOCKER`) are fully aligned with the SSOT and Stack Breakdown.
-   **Low Alignment**: The existing frontend documentation (`apps/web/ARCHITECTURE.md`) describes the *Mock* architecture and is significantly outdated.

---

## 2. Document Inventory & Status

| Document | Location | Status | Notes |
| :--- | :--- | :--- | :--- |
| **SSOT Blueprint** | `planning/` | 🟢 **Valid** | The functional ground truth. |
| **Stack Breakdown** | `planning/` | 🟢 **Valid** | The technical ground truth. |
| **Backend Spec** | `planning/` | 🟢 **Valid** | Aligned with Fastify/Drizzle stack. |
| **Tooling** | `Root` | 🟢 **Valid** | Aligned with Storybook/Cypress/Postman. |
| **Docker** | `Root` | 🟢 **Valid** | Aligned with Turborepo structure. |
| **Env** | `Root` | 🟢 **Valid** | Aligned with Zod validation. |
| **Web Architecture** | `apps/web/` | 🔴 **Outdated** | Describes Mock API, localStorage, and single-repo structure. |
| **Review** | `planning/` | 🟡 **Historical** | Snapshot of the MVP state. References "Lovable Cloud". |

---

## 3. Alignment Matrix

### A. Architecture
| Component | SSOT/Stack Requirement | Current Documentation | Discrepancy |
| :--- | :--- | :--- | :--- |
| **Backend** | Fastify + Node.js | `web/ARCHITECTURE.md` says "Mock API Layer" | **Critical**: Frontend doc needs to point to Real API. |
| **Database** | Neon (Postgres) | `web/ARCHITECTURE.md` says "localStorage" | **Critical**: Data persistence model has changed. |
| **Repo** | Turborepo (Monorepo) | `web/ARCHITECTURE.md` implies Single Repo | Folder structure in doc is outdated (`src/api` vs `apps/web/src/api`). |

### B. Features (SSOT)
| Feature | SSOT Requirement | Backend Spec Support | Notes |
| :--- | :--- | :--- | :--- |
| **Phases** | PRE, LIVE, POST | ✅ Yes | `Phase` enum and logic present. |
| **Teams** | Invite Codes, Privacy | ✅ Yes | `Teams` table includes `inviteCode`, `privacy`. |
| **Payments** | Mandatory, QR Ticket | ✅ Yes | `Payments` table and `Ticket` logic present. |
| **Roles** | Student, Judge, Admin | ✅ Yes | `Users` table includes `role`. |

---

## 4. Recommendations

### Immediate Actions
1.  **Refactor `apps/web/ARCHITECTURE.md`**:
    -   Remove "Mock API Layer" section.
    -   Update "Folder Structure" to reflect `apps/web`.
    -   Update "Data Flow" to show `TanStack Query` -> `Real API` (not Mock).
2.  **Archive `planning/REVIEW.md`**:
    -   Rename to `planning/MVP_REVIEW_ARCHIVE.md` to avoid confusion.
3.  **Update `apps/web/README.md`**:
    -   Ensure it mentions how to run the app within the Turborepo context (`pnpm dev` from root).

### Long-Term
-   Ensure `apps/api/POSTMAN.md` is kept in sync with `BACKEND_SPEC.md` as implementation proceeds.
