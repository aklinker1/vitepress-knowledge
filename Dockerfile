FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# Install all dependencies into temp directory
FROM base AS builder
RUN mkdir -p plugin server
COPY package.json bun.lock ./
COPY plugin/package.json ./plugin
COPY server/package.json ./server
RUN bun install --frozen-lockfile
COPY . .
RUN cd server && bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=builder /usr/src/app/server/dist .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "main.js" ]
