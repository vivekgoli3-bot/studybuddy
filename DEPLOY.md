# Deploying Study Buddy

This branch is scoped to deployment-only fixes and is ready to connect to Render as a single Node web service.

## What This Branch Includes

- frontend API calls switched from hardcoded `localhost` URLs to relative `/api/...` requests
- Vite dev proxy for local development
- backend runtime config driven by environment variables
- production static serving for `frontend_Homepage/dist`
- Render Blueprint config in `render.yaml`
- Node version pinning for local and CI environments

## Render Setup

Render can read the root-level `render.yaml` Blueprint file directly:

- service type: `web`
- runtime: `node`
- build command: `npm install --prefix backend && npm install --prefix frontend_Homepage && npm run build --prefix frontend_Homepage`
- start command: `npm start --prefix backend`
- health check path: `/api/health`

## Required Environment Variables

Render should prompt for these values because they are marked `sync: false` in `render.yaml`:

- `MONGODB_URI`
- `COHERE_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIRECT_URI`

The Blueprint also sets these defaults:

- `NODE_ENV=production`
- `NODE_VERSION=22.12.0`
- `CLIENT_DIST_DIR=frontend_Homepage/dist`

## Local Notes

- Use `.nvmrc` or `.node-version` to switch to Node `22.12.0`
- Example backend env values live in `backend/.env.example`
