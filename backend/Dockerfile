# syntax=docker/dockerfile:1

# ---- builder: compile a static Go binary ----
FROM golang:1.26-alpine AS builder
WORKDIR /app

# Download dependencies first (better layer caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy the source and build a static binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/prophet ./cmd/server

# ---- runner: minimal Alpine image ----
FROM alpine:3.21 AS runner
WORKDIR /app

# Install ca-certificates (needed for HTTPS calls to GitHub, Reddit, RSS feeds, etc.)
RUN apk --no-cache add ca-certificates && \
    addgroup --system --gid 1001 golang && \
    adduser --system --uid 1001 --ingroup golang appuser

# Copy the compiled binary
COPY --from=builder --chown=appuser:golang /app/prophet ./prophet

USER appuser

EXPOSE 8080
ENV PORT=8080

CMD ["./prophet"]
