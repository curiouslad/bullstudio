# syntax=docker/dockerfile:1

# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace packages that workers depends on
COPY packages/typescript-config ./packages/typescript-config
COPY packages/connect-types ./packages/connect-types
COPY packages/email ./packages/email
COPY packages/prisma ./packages/prisma
COPY packages/queue ./packages/queue

# Copy workers app
COPY apps/workers ./apps/workers

# Install dependencies using bun
RUN bun install --frozen-lockfile

# Generate Prisma client
WORKDIR /app/packages/prisma
RUN bunx prisma generate

# Build the workers app
WORKDIR /app/apps/workers
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Copy the bundled output
COPY --from=builder /app/apps/workers/dist ./dist

# Copy Prisma client (needed at runtime)
COPY --from=builder /app/packages/prisma/generated ./packages/prisma/generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set environment
ENV NODE_ENV=production

# Run the bundled worker
CMD ["bun", "run", "dist/index.js"]
