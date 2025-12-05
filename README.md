# Innovate 2025 - Hackathon Operating System (EOS)

## 🧠 What is this?
This is a **Monorepo** (Multi-package repository) containing the entire code for the Innovate 2025 platform. Instead of having separate folders for "Frontend" and "Backend", they live together here to share code easily.

## 🏗 Architecture (The Mental Model)
Think of this repository as a **Workspace** with different zones:

### 1. `apps/` (The "Houses")
These are the actual applications that run in the browser or server.
- **`apps/web`**: The **Frontend**. 
  - *Tech*: React, Vite, Tailwind CSS.
  - *Role*: This is what users see. It talks to `apps/api`.
- **`apps/api`**: The **Backend**. 
  - *Tech*: Fastify (Node.js), Zod.
  - *Role*: The "Brain". It receives requests from the Frontend, checks permissions, and talks to the Database.

### 2. `packages/` (The "Bricks")
These are shared libraries. We build them once and use them everywhere.
- **`packages/ui`**: Our custom design system (Buttons, Inputs, Cards).
- **`packages/db`**: The **Database** layer.
  - *Tech*: Drizzle ORM, PostgreSQL (Neon).
  - *Role*: The "Memory". It holds the actual data (`users`, `teams`, etc.).
- **`packages/config`**: Shared settings (Environment variables, TypeScript configs) so we don't repeat ourselves.

## 🚀 How Data Moves
1. **User** clicks "Login" in `apps/web`.
2. **Frontend** sends a request to `apps/api` (Port 3002).
3. **Backend** validates the data using `packages/config` & `Zod`.
4. **Backend** uses `packages/db` to check the **Neon Database**.
5. **Database** replies, and the message travels all the way back up.

## 🛠 Usage
### Start Development
Runs all apps (Web + API) simultaneously.
```bash
pnpm dev
```

### Clean Project
Removes build artifacts and temporary files (useful if things get "weird").
```bash
pnpm clean
```

## ✅ Current Status
- **Authentication**: ✅ Verified. You can Register/Login via API.
- **Database**: ✅ Connected. `users` table exists.
- **Frontend**: ✅ Connected. Can talk to the Backend.
