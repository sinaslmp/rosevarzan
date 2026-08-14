FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

COPY apps/api apps/api
RUN npm run prisma:generate --workspace=@rosevarzan/api \
  && npm run build --workspace=@rosevarzan/api

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

USER node
EXPOSE 4010
CMD ["sh", "-c", "node_modules/.bin/prisma db push --skip-generate --schema apps/api/prisma/schema.prisma && node_modules/.bin/tsx apps/api/prisma/seed.ts && exec node apps/api/dist/main.js"]
