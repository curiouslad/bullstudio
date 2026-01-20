# Base image with Bun
FROM oven/bun:1.2.22 AS base

# Install turbo CLI globally using Bun
FROM base AS turbo-cli
RUN bun add -g turbo

# Builder stage - prune worker workspace
FROM turbo-cli AS builder
WORKDIR /app
COPY . .
RUN turbo prune workers --docker --out-dir=out/worker

# Installer stage
FROM base AS installer
WORKDIR /app

# Copy package.json files from worker pruned workspace
COPY --from=builder /app/out/worker/json/ .

# Copy full source from worker pruned workspace
COPY --from=builder /app/out/worker/full/ .

# Remove any lockfile that might have been copied
RUN rm -f bun.lock
# Generate a fresh lockfile
RUN bun install

FROM installer AS runner

# Set the worker directory as working directory
WORKDIR /app/apps/workers
ENV NODE_ENV=production
EXPOSE 3001
CMD ["bun", "run", "src/index.ts"]