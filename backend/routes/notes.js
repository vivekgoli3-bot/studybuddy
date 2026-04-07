// backend/routes/notes.js
import express from "express";
import mongoose from "mongoose";
import multer from "multer";

const router = express.Router();
const formParser = multer(); // used to parse multipart/form-data fields (no files expected here)

// Define the Note schema
const noteSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  drive_link: { type: String, required: true },
  username: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create the Note model
const Note = mongoose.model("Note", noteSchema);

// 🟢 POST route — add a new note
// Accept both application/json and multipart/form-data (fields only)
// Import the upload middleware from uploadToDrive
import { upload } from './uploadToDrive.js';

router.post("/", upload.single('file'), async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log("📝 /api/notes POST - Request received");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    // Accept multiple possible field names (helps with frontend variations)
    const subject = req.body.subject_name || req.body.subject || req.body.subj || req.body.name;
    const title = req.body.title || req.body.name || req.body.title_text;
    const drive_link = req.body.drive_link || req.body.link || req.body.viewLink || req.body.webViewLink || req.body.driveLink;
    const username = req.body.username || req.body.user || req.body.creator || req.body.u_name;

    const missing = [];
    if (!subject) missing.push("subject");
    if (!title) missing.push("title");
    if (!drive_link) missing.push("drive_link");
    if (!username) missing.push("username");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing_fields: missing
      });
    }

    // Log the values we're trying to save
    console.log("🔍 Attempting to save note with values:", {
      subject,
      title,
      drive_link,
      username
    });

    const newNote = new Note({ subject, title, drive_link, username });
    
    // Validate before saving
    const validationError = newNote.validateSync();
    if (validationError) {
      console.error("❌ Validation error:", validationError);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.keys(validationError.errors).reduce((acc, key) => {
          acc[key] = validationError.errors[key].message;
          return acc;
        }, {})
      });
    }

    // Try to save
    const savedNote = await newNote.save();
    console.log("✅ Note saved successfully:", savedNote);

    res.status(201).json({
      success: true,
      message: "Note added successfully.",
      note: savedNote
    });
  } catch (err) {
    console.error("❌ Error saving note:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while saving note.",
      error: err.message,
      validationErrors: err.errors ? Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      })) : undefined
    });
  }
});

// 🟢 GET route — fetch all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ success: false, message: "Server error while fetching notes." });
  }
});

export default router;
