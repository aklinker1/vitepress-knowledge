FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

FROM base AS builder
RUN mkdir -p plugin server
COPY package.json bun.lock ./
COPY plugin/package.json ./plugin
COPY server/package.json ./server
RUN bun install --frozen-lockfile
COPY . .
RUN cd server && bun run build

FROM base AS release
COPY --from=builder /usr/src/app/server/dist .
USER bun
ENTRYPOINT [ "bun", "run", "main.js" ]
