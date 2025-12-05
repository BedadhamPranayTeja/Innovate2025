# Technology Stack Breakdown

> **Overview**: A comprehensive guide to the technologies chosen for this project, explaining "What" they are and "Why" we use them.

---

## 1. Monorepo & Build System

### **Turborepo**
-   **What**: A high-performance build system for JavaScript/TypeScript monorepos.
-   **Why**: It allows us to manage multiple applications (`web`, `api`) and shared packages (`shared`) in a single repository. It uses intelligent caching to ensure we never re-build the same code twice, significantly speeding up CI/CD and local development.

### **PNPM**
-   **What**: A fast, disk-space efficient package manager.
-   **Why**: It uses a unique content-addressable store, meaning dependencies are stored once on disk and linked. This is crucial for monorepos to prevent "phantom dependencies" and save gigabytes of space.

---

## 2. Frontend (`apps/web`)

### **Vite**
-   **What**: A next-generation frontend build tool.
-   **Why**: Unlike Webpack, Vite serves code via native ES modules during development, resulting in near-instant server start and Hot Module Replacement (HMR), regardless of app size.

### **React 18**
-   **What**: The library for web and native user interfaces.
-   **Why**: The industry standard for component-based UI. We use version 18 to leverage concurrent features and automatic batching.

### **TypeScript**
-   **What**: A strongly typed superset of JavaScript.
-   **Why**: It catches errors at compile-time rather than runtime. In a full-stack environment, it allows us to share types between Frontend and Backend, ensuring the API contract is always respected.

### **Tailwind CSS**
-   **What**: A utility-first CSS framework.
-   **Why**: It allows us to build custom designs without leaving your HTML. It enforces consistency via a configuration file and removes the need for separate CSS files that grow indefinitely.

### **Shadcn UI**
-   **What**: A collection of re-usable components built using Radix UI and Tailwind CSS.
-   **Why**: Unlike other component libraries (MUI, AntD), Shadcn gives you ownership of the code. The components are copied into your project, allowing for full customization and zero runtime overhead / vendor lock-in.

### **Zustand**
-   **What**: A small, fast, and scalable bearbones state-management solution.
-   **Why**: It is much simpler than Redux (no boilerplate) and solves the "prop drilling" problem without the complexity of Context API re-renders.

---

## 3. Backend (`apps/api`)

### **Fastify**
-   **What**: A web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture.
-   **Why**: It is significantly faster than Express. It has first-class support for TypeScript and schema-based validation, making it perfect for building robust APIs.

### **Drizzle ORM**
-   **What**: A TypeScript ORM that feels like writing SQL.
-   **Why**: Unlike Prisma, Drizzle has zero runtime overhead (it's just a wrapper around SQL queries). It is extremely lightweight, serverless-ready, and infers TypeScript types directly from your database schema.

### **Neon (PostgreSQL)**
-   **What**: Serverless PostgreSQL built for the cloud.
-   **Why**: It separates storage from compute, allowing it to scale to zero (saving costs) and scale up instantly. It supports branching (like Git) for databases, which is excellent for development workflows.

### **Zod**
-   **What**: TypeScript-first schema declaration and validation library.
-   **Why**: We use it to validate data at the edges of our system (API inputs, Environment variables, Forms). By sharing Zod schemas between Frontend and Backend, we guarantee type safety across the network boundary.

---

## 4. Quality Assurance & Tooling

### **Storybook**
-   **What**: A frontend workshop for building UI components and pages in isolation.
-   **Why**: It allows developers to build and test components without needing to run the backend or navigate through the app. It also serves as living documentation for the Design System.

### **Cypress**
-   **What**: A next-generation front end testing tool built for the modern web.
-   **Why**: It performs End-to-End (E2E) testing by running the application in a real browser. It verifies that the critical user flows (Login, Submit, Pay) actually work from the user's perspective.

### **Postman**
-   **What**: An API platform for building and using APIs.
-   **Why**: It allows backend developers to design, test, and document APIs independently of the frontend. Automated test scripts in Postman ensure the API contract remains valid.

### **Docker**
-   **What**: A platform for developing, shipping, and running applications in containers.
-   **Why**: It packages the application with all its dependencies (OS, Node version, etc.), ensuring that "it works on my machine" means it works everywhere.
