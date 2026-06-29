# ── VenueFlow API ────────────────────────────────────────────
FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Dependencies (cached layer)
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build / runtime
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 4000
# Runs migrations then starts the API
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
