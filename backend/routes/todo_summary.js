import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

/**
 * @route   GET /api/todo_summary/:username
 * @desc    Get total, completed, and pending task counts for a user
 * @access  Public
 */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // ✅ Fetch all todos for the given username
    const todos = await Todo.find({ username });

    if (!todos || todos.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No tasks found for user '${username}'`,
      });
    }

    // ✅ Count totals by status
    const totalTasks = todos.length;
    const completedTasks = todos.filter(
      (t) => t.status.toLowerCase() === "completed"
    ).length;
    const pendingTasks = todos.filter(
      (t) => t.status.toLowerCase() === "pending"
    ).length;

    res.status(200).json({
      success: true,
      username,
      message: `✅ Task summary for ${username}`,
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      pending_tasks: pendingTasks,
    });
  } catch (error) {
    console.error("❌ Error fetching todo summary:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching todo summary",
    });
  }
});

export default router;
