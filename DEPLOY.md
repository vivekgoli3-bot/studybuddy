# Deploying Study Buddy

This project is set up to deploy as a single Node web service:

1. Install backend dependencies.
2. Install and build `frontend_Homepage`.
3. Start the backend from `backend/server.js`.

Recommended Node version: `22.12.0` or newer.

## Render Setup

- Root directory: repository root
- Build command: `npm install --prefix backend && npm install --prefix frontend_Homepage && npm run build --prefix frontend_Homepage`
- Start command: `npm start --prefix backend`

## Required Environment Variables

- `NODE_ENV=production`
- `CLIENT_DIST_DIR=frontend_Homepage/dist`
- `MONGODB_URI=<your hosted MongoDB connection string>`
- `COHERE_API_KEY=<your Cohere API key>`
- `GOOGLE_CLIENT_ID=<your Google client id>`
- `GOOGLE_CLIENT_SECRET=<your Google client secret>`
- `REDIRECT_URI=https://<your-domain>/api/oauth2callback`

## Optional Environment Variables

- `PORT=5000`
- `CORS_ORIGIN=https://<your-domain>`

If the frontend and backend are served from the same deployed service, the frontend uses relative `/api/...` requests automatically.
