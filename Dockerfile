# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY backend/package*.json backend/
COPY frontend_Homepage/package*.json frontend_Homepage/

RUN npm ci --prefix backend
RUN npm ci --prefix frontend_Homepage

COPY backend backend
COPY frontend_Homepage frontend_Homepage

RUN npm run build --prefix frontend_Homepage

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

COPY backend/package*.json backend/
RUN npm ci --omit=dev --prefix backend

COPY backend backend
COPY --from=build /app/frontend_Homepage/dist frontend_Homepage/dist

WORKDIR /app/backend

EXPOSE 8000

CMD ["npm", "start"]
