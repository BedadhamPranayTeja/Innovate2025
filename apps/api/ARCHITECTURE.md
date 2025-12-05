# Innovate 2025 EOS — Backend Architecture

> **Scope**: `apps/api`
> **Framework**: Fastify + Drizzle ORM + Zod

## 1. Overview

The backend is built for **high performance** and **type safety**. It leverages Fastify's low overhead and Drizzle's zero-cost abstractions to provide a robust API layer.

### Core Principles
-   **Feature-Based Structure**: Code is organized by feature (e.g., `auth`, `user`, `team`) rather than technical layer (controllers, services).
-   **Shared Validation**: Zod schemas are imported from `@innovate/validators` to ensure the API contract matches the Frontend.
-   **Type-Safe Database**: Drizzle ORM provides TypeScript types inferred directly from the SQL schema.

---

## 2. Folder Structure

```text
src/
├── features/           # Feature modules
│   ├── auth/
│   │   ├── auth.routes.ts       # Fastify route definitions
│   │   ├── auth.controller.ts   # Request handling logic
│   │   ├── auth.service.ts      # Business logic
│   │   └── auth.schema.ts       # Local schemas (if not shared)
│   ├── user/
│   ├── team/
│   └── ...
│
├── plugins/            # Fastify plugins
│   ├── db.ts           # Drizzle connection
│   ├── env.ts          # Environment variable validation
│   └── jwt.ts          # Authentication plugin
│
├── app.ts              # App factory
└── index.ts            # Entry point
```

---

## 3. Request Lifecycle

1.  **Request**: Incoming HTTP request hits Fastify.
2.  **Validation**: Fastify validates body/query/params using Zod schemas.
3.  **Guard**: `verifyJwt` plugin checks authentication (if protected).
4.  **Controller**: Extracts data and calls the Service.
5.  **Service**: Executes business logic, calls Database.
6.  **Database**: Drizzle executes SQL query on Neon Postgres.
7.  **Response**: Service returns data, Controller sends JSON response.

---

## 4. Feature Implementation Guide

### A. Define the Schema
Use `@innovate/validators` or define local Zod schemas.

```typescript
// features/auth/auth.schema.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### B. Create the Service
Implement business logic.

```typescript
// features/auth/auth.service.ts
export const loginUser = async (data: LoginInput) => {
  const user = await db.query.users.findFirst({ ... });
  if (!user) throw new Error("User not found");
  return user;
};
```

### C. Create the Controller
Handle HTTP specifics.

```typescript
// features/auth/auth.controller.ts
export const loginHandler = async (req, reply) => {
  const user = await authService.loginUser(req.body);
  return reply.send({ user });
};
```

### D. Register Routes
Bind controller to routes.

```typescript
// features/auth/auth.routes.ts
export const authRoutes = async (fastify) => {
  fastify.post('/login', { schema: { body: LoginSchema } }, loginHandler);
};
```

---

## 5. Database & ORM

We use **Drizzle ORM** with **Neon (PostgreSQL)**.

-   **Schema Definition**: Located in `packages/db/src/schema`.
-   **Migrations**: Managed via `drizzle-kit`.
-   **Querying**: Use the `db` instance injected via plugin.

```typescript
import { db } from '../../plugins/db';
import { users } from '@innovate/db/schema';

const result = await db.select().from(users);
```

---

## 6. Testing

-   **Unit Tests**: Vitest for Services and Utilities.
-   **API Tests**: Postman Collections (see `POSTMAN.md`).
