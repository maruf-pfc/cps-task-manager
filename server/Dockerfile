# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# ---- Production Stage ----
FROM node:22-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app /app
ENV NODE_ENV=production
EXPOSE 5000

CMD ["pnpm", "start"]
