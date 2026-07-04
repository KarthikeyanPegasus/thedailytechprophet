# syntax=docker/dockerfile:1

# ---- deps: install all node_modules (including dev) for building ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder: compile the standalone Next.js server ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Use a placeholder that gets replaced at container startup.
# This allows the API URL to be set at runtime without rebuilding.
ARG NEXT_PUBLIC_API_URL=__NEXT_PUBLIC_API_URL_PLACEHOLDER__
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# ---- runner: minimal production image ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry at runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server (includes minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets that the standalone build references
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy the public folder (manifest, favicons, svgs)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# At startup, replace the placeholder in all built JS files with the
# actual NEXT_PUBLIC_API_URL, then start the server.
# The standalone output puts server chunks under .next/server and
# client chunks under .next/static — both need substitution.
CMD ["sh", "-c", "find .next -name '*.js' -type f -exec sed -i 's|__NEXT_PUBLIC_API_URL_PLACEHOLDER__|${NEXT_PUBLIC_API_URL:-http://localhost:8080}|g' {} + && node server.js"]
