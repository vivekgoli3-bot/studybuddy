# Deploying Study Buddy

This branch is prepared for Koyeb using the root-level `Dockerfile`.

## What This Branch Includes

- frontend API calls switched from hardcoded `localhost` URLs to relative `/api/...` requests
- Vite dev proxy for local development
- backend runtime config driven by environment variables
- production static serving for `frontend_Homepage/dist`
- Docker-based deployment for Koyeb
- Node version pinning for local and CI environments

## Koyeb Setup

Deploy this repo from GitHub with these choices:

1. Create a new App in Koyeb.
2. Choose GitHub as the source.
3. Select this repository and the branch `codex-deploy-koyeb`.
4. Choose the Dockerfile builder.
5. Keep the default Dockerfile path as `Dockerfile`.
6. Create a single web Service.

The container builds the frontend and runs the backend, so no separate build or run command is required in Koyeb.

## Required Environment Variables

- `MONGODB_URI`
- `COHERE_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIRECT_URI`

Recommended values:

- `NODE_ENV=production`
- `CLIENT_DIST_DIR=frontend_Homepage/dist`

If Koyeb does not auto-populate it, set:

- `REDIRECT_URI=https://<your-koyeb-domain>/api/oauth2callback`

## Important Note

Koyeb's current pricing FAQ says each organization gets one free web Service, but it also says a credit card is required for account validation before you can access platform resources.

## Local Notes

- Use `.nvmrc` or `.node-version` to switch to Node `22.12.0`
- Example backend env values live in `backend/.env.example`
