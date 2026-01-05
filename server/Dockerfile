FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=false  # чтобы prisma работал

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN yarn build

# Final stage
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install --production=true  # только prod-зависимости

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

CMD ["node", "dist/main"]