import express from "express";
import ResourceLibrary from "../models/resource_library.js"; // use updated model

const router = express.Router();

/**
 * @route   POST /api/resource_library
 * @desc    Add a new resource entry
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { subject, title, type, username, drive_link } = req.body;

    // Check for missing fields
    const missing = [];
    if (!subject) missing.push("subject");
    if (!title) missing.push("title");
    if (!type) missing.push("type");
    if (!username) missing.push("username");
    if (!drive_link) missing.push("drive_link");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing_fields: missing,
      });
    }

    // ✅ Prevent duplicate drive links
    const existing = await ResourceLibrary.findOne({ drive_link });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Resource with this drive link already exists",
      });
    }

    // ✅ Create new resource entry
    const newResource = new ResourceLibrary({
      subject,
      title,
      type,
      username,
      drive_link,
      created_at: new Date(),
    });

    const saved = await newResource.save();

    res.status(201).json({
      success: true,
      message: "Resource added successfully to resource_library",
      data: saved,
    });

  } catch (err) {
    console.error("❌ Error adding resource:", err);
    res.status(500).json({
      success: false,
      error: "Server error while adding resource",
    });
  }
});

export default router;
