import express from "express";
import FetchNote from "../models/FetchNote.js"; // updated model import

const router = express.Router();

/**
 * @route   GET /api/fetch_notes/:username
 * @desc    Get all notes by a specific username
 * @access  Public
 */
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const notes = await FetchNote.find({ username });

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No notes found for user '${username}'`,
      });
    }

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching notes",
    });
  }
});

export default router;
