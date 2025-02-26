# Build the app outside docker to avoid issues with the monorepo and lockfile
FROM oven/bun:1-alpine
WORKDIR /usr/src/app
COPY .output .
USER bun
ENTRYPOINT [ "bun", "run", "server-entry.js" ]
