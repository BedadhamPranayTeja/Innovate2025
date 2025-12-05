# Environment Variables

> **Strategy**: Type-Safe Configuration with Shared Zod Schemas

## 1. Overview

We use `.env` files to manage secrets and configuration.
**NEVER commit `.env` files to Git.** Only commit `.env.example`.

We leverage **`@innovate/validators`** to share environment schemas between the app and the config loader.

---

## 2. Web (`apps/web`)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | Yes | URL of the Backend API. |
| `VITE_ENABLE_ANALYTICS` | No | Toggle for analytics. |

### Validation

We use manual Zod validation in `src/config.ts`, importing the schema from our shared package.

```typescript
// apps/web/src/config.ts
import { WebEnvSchema } from '@innovate/validators';

export const config = WebEnvSchema.parse(import.meta.env);
```

---

## 3. API (`apps/api`)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | Neon Postgres Connection String. |
| `JWT_SECRET` | Yes | Secret key for signing tokens. |
| `PORT` | No | Port to listen on (default: 3000). |

### Validation

We validate env vars on server startup using a Fastify plugin or direct parsing.

```typescript
// apps/api/src/plugins/env.ts
import { ApiEnvSchema } from '@innovate/validators';
import dotenv from 'dotenv';

dotenv.config();

export const config = ApiEnvSchema.parse(process.env);
```
