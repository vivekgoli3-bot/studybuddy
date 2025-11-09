import express from "express";
import QuizScore from "../models/QuizScore.js"; // Your quiz_scores model

const router = express.Router();

/**
 * @route   POST /api/quiz_scores
 * @desc    Add a new quiz score entry
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const {
      username,
      subject,
      module,
      total_questions,
      correct_answers,
      score,
      grade,
      time_taken
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "username",
      "subject",
      "module",
      "total_questions",
      "correct_answers",
      "score",
      "grade",
      "time_taken"
    ];

    const missing = requiredFields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing_fields: missing
      });
    }

    // ✅ Apply score multiplier based on module type
    let adjustedScore = score;

    const modUpper = module.toUpperCase();
    if (modUpper.includes("FULL SYLLABUS")) {
      adjustedScore = score * 1.5;
    } else if (modUpper.includes("RANDOM TEST")) {
      adjustedScore = score * 2;
    }

    // Create new quiz score document
    const newScore = new QuizScore({
      username,
      subject,
      module,
      total_questions,
      correct_answers,
      score: adjustedScore,
      grade,
      time_taken,
      timestamp: new Date()
    });

    // Save to database
    await newScore.save();

    res.status(201).json({
      success: true,
      message: "Quiz score added successfully",
      data: newScore
    });
  } catch (err) {
    console.error("❌ Error adding quiz score:", err);
    res.status(500).json({
      success: false,
      error: "Server error while saving quiz score"
    });
  }
});

export default router;
