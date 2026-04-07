// backend/routes/uploadToDrive.js
import express from "express";
import multer from "multer";
import { google } from "googleapis";
import open from "open";
import { createReadStream, unlinkSync } from "fs";
import dotenv from 'dotenv';
import { oAuth2Client } from "../utils/googleAuth.js";


dotenv.config();

const router = express.Router();
export const upload = multer({ dest: "uploads/" }); // temp storage



// 1️⃣ STEP: Generate Google auth link
router.get("/auth", async (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
  await open(authUrl);
  res.send("Authorization window opened in browser. Grant access to continue.");
});

// 2️⃣ STEP: Google redirects here after permission
router.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  res.send("✅ Authentication successful! You can now upload files using POST /api/upload");
});

// 3️⃣ STEP: Upload PDF to Drive
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if OAuth client has credentials
    if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please visit /api/auth first to authorize the application."
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded. Make sure to send a file with the field name 'file'"
      });
    }

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const fileMetadata = {
      name: req.file.originalname,
      parents: ["1lYXFfyVwVwUxlYRuQdZpuKQFYg70mpEP"],
    };

    const media = {
      mimeType: req.file.mimetype, // Use the actual file's mimetype
      body: createReadStream(req.file.path),
    };

    console.log("📤 Uploading file:", req.file.originalname);
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });
    console.log("✅ File uploaded successfully");

    // Clean up the temporary file
    try {
      unlinkSync(req.file.path);
    } catch (cleanupErr) {
      console.warn("Warning: Could not delete temporary file:", cleanupErr);
    }

    res.status(200).json({
      success: true,
      fileId: response.data.id,
      viewLink: response.data.webViewLink,
      downloadLink: response.data.webContentLink,
      message: "File uploaded successfully to Google Drive"
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    
    // Clean up the temporary file in case of error
    if (req.file) {
      try {
        unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.warn("Warning: Could not delete temporary file:", cleanupErr);
      }
    }

    // More specific error messages
    if (err.code === 401) {
      return res.status(401).json({
        success: false,
        error: "Authentication failed. Please re-authorize by visiting /api/auth"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message,
      hint: "Make sure you've authorized the application by visiting /api/auth first"
    });
  }
});

export default router;
