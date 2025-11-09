import express from "express";
import Todo from "../models/Todo.js"; // your Mongoose model

const router = express.Router();

/**
 * @route   GET /api/fetch_todos/:username
 * @desc    Get all todo tasks by a specific username
 * @access  Public
 */
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const todos = await Todo.find({ username });

    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No tasks found for user '${username}'`
      });
    }

    res.status(200).json({
      success: true,
      count: todos.length,
      todos
    });
  } catch (err) {
    console.error("❌ Error fetching todos:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching todos"
    });
  }
});

export default router;
