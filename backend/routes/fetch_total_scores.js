import express from "express";
import QuizScore from "../models/QuizScore.js";

const router = express.Router();

/**
 * @route   GET /api/fetch_total_scores
 * @desc    Fetch total score for each user, sorted in descending order
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const leaderboard = await QuizScore.aggregate([
      {
        $group: {
          _id: "$username",
          totalScore: { $sum: "$score" }
        }
      },
      {
        $project: {
          _id: 0,
          username: "$_id",
          totalScore: 1
        }
      },
      {
        $sort: { totalScore: -1 }
      }
    ]);

    if (leaderboard.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quiz scores found"
      });
    }

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard
    });
  } catch (err) {
    console.error("❌ Error fetching total scores:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching total scores"
    });
  }
});

export default router;
