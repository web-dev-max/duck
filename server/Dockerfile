# server/Dockerfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=false

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN yarn build

# Final stage
FROM node:22
WORKDIR /app
COPY package.json ./
RUN yarn install --production=true

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY .env .env

CMD ["node", "dist/main"]