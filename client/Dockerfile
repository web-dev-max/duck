# client/Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage: копируем только build
FROM scratch
COPY --from=builder /app/build /build