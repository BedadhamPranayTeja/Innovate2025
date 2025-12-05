FROM node:18-alpine AS base

# 1. Prune
FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@innovate/api --docker

# 2. Install
FROM base AS installer
WORKDIR /app
RUN npm install -g pnpm
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# 3. Build
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm run build --filter=@innovate/api...

# 4. Runner
FROM base AS runner
WORKDIR /app
COPY --from=installer /app .
CMD ["node", "apps/api/dist/app.js"]
