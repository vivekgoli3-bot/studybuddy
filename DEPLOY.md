# Deploying Study Buddy

This branch is prepared for Vercel as a no-card hosting option for the app layer.

## What This Branch Includes

- frontend API calls switched from hardcoded `localhost` URLs to relative `/api/...` requests
- Vite dev proxy for local development
- backend runtime config driven by environment variables
- Vercel serverless wrapper for the Express API
- Vercel build step that publishes the React app to `public/`
- Node version pinning for local and CI environments

## Vercel Setup

Deploy this repo from GitHub with these choices:

1. Import the repository into Vercel.
2. Select the branch `codex-deploy-vercel`.
3. Keep the project root at the repository root.
4. Let Vercel read `vercel.json`.

The project uses:

- `installCommand`: `npm install --prefix backend && npm install --prefix frontend_Homepage`
- `buildCommand`: builds `frontend_Homepage` and copies the output to `public/`
- `api/[...route].js`: serves the Express backend on `/api/*`

## Required Environment Variables

- `MONGODB_URI`
- `COHERE_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIRECT_URI`

Recommended values:

- `NODE_ENV=production`
- `CLIENT_DIST_DIR=frontend_Homepage/dist`

For production OAuth callbacks, set:

- `REDIRECT_URI=https://<your-vercel-domain>/api/oauth2callback`

## Important Note

Vercel Hobby is the strongest no-card hosting option I found for the app itself. The remaining possible blocker is your database provider and any third-party APIs, which may have their own signup requirements.

## Local Notes

- Use `.nvmrc` or `.node-version` to switch to Node `22.12.0`
- Example backend env values live in `backend/.env.example`
