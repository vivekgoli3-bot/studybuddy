import express from "express";
import multer from "multer";
import { google } from "googleapis";
import open from "open";
import { createReadStream, unlinkSync } from "fs";
import dotenv from "dotenv";
import { oAuth2Client } from "../utils/googleAuth.js";


dotenv.config({ quiet: true });

const router = express.Router();
export const upload = multer({ dest: "uploads/" }); // Temporary local folder



// 1️⃣ STEP: Generate Google Auth Link
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
  res.send("✅ Authentication successful! You can now upload files using POST /api/resource_upload");
});

// 3️⃣ STEP: Upload file to Google Drive (Resource Library Folder)
router.post("/resource_upload", upload.single("file"), async (req, res) => {
  try {
    // Check if authorized
    if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please visit /api/auth first to authorize the application.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Make sure to send a file with field name 'file'.",
      });
    }

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const fileMetadata = {
      name: req.file.originalname,
      parents: ["1A0Yr9I1ibAwBLYfuxV3GJjyPQXzyo_HE"], // 📂 Resource Library Folder ID
    };

    const media = {
      mimeType: req.file.mimetype,
      body: createReadStream(req.file.path),
    };

    console.log("📤 Uploading file to Resource Library:", req.file.originalname);
    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    });

    console.log("✅ File uploaded successfully to Resource Library");

    // Clean up temp file
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
      message: "File uploaded successfully to Resource Library folder in Google Drive",
    });
  } catch (err) {
    console.error("❌ Upload error:", err);

    // Cleanup temp file
    if (req.file) {
      try {
        unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.warn("Warning: Could not delete temporary file:", cleanupErr);
      }
    }

    if (err.code === 401) {
      return res.status(401).json({
        success: false,
        error: "Authentication failed. Please re-authorize by visiting /api/auth",
      });
    }

    res.status(500).json({
      success: false,
      error: err.message,
      hint: "Make sure you've authorized the application by visiting /api/auth first",
    });
  }
});

export default router;
