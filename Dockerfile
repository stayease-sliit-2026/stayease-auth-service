FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY openapi.yaml ./openapi.yaml

EXPOSE 8080

CMD ["npm", "start"]
