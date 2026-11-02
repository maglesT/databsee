# The platform image: core and every product, run with different commands (deploy/compose.yml).
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build
USER node
