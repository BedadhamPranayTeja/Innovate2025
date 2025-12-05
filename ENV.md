# Environment Variables

> **Strategy**: Type-Safe Configuration with Zod

---

## 1. Overview

We use `.env` files to manage secrets and configuration.
**NEVER commit `.env` files to Git.** Only commit `.env.example`.

---

## 2. Web (`apps/web`)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | Yes | URL of the Backend API. |
| `VITE_ENABLE_ANALYTICS` | No | Toggle for analytics. |

### Validation
We use `vite-plugin-environment` or manual Zod validation in `src/config.ts`.

```typescript
// apps/web/src/config.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
});

export const config = envSchema.parse(import.meta.env);
```

---

## 3. API (`apps/api`)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | Neon Postgres Connection String. |
| `JWT_SECRET` | Yes | Secret key for signing tokens. |
| `PORT` | No | Port to listen on (default: 3000). |

### Validation
We validate env vars on server startup. If validation fails, the app crashes immediately (Fail Fast).

```typescript
// apps/api/src/config.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
});

export const config = envSchema.parse(process.env);
```
