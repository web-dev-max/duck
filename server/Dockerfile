FROM node:22-alpine AS builder
ENV TZ=UTC
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat libstdc++

COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

CMD [ "node", "dist/main" ]
