# Install
pnpm install --frozen-lockfile
# Prisma
pnpx prisma migrate deploy --schema ./packages/prisma/schema.prisma
pnpx prisma generate --schema ./packages/prisma/schema.prisma

# Build
pnpm build -F web
