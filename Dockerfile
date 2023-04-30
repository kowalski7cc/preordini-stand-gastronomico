FROM node:18.15.0-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
FROM caddy:2.6.4-alpine
COPY --from=builder /app/public /usr/share/caddy