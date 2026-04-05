// backend/utils/googleAuth.js

import { google } from "googleapis";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ quiet: true });

// Get values safely from environment
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:5000/api/oauth2callback";

// Create OAuth2 client
export const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
