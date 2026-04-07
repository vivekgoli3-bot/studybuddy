import express from "express";
import Todo from "../models/Todo.js"; // Importing your Todo model

const router = express.Router();

/**
 * @route   POST /api/todos
 * @desc    Add a new task to the todos collection
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { username, task, status, due_date, priority, category } = req.body;

    // ✅ Validation: check missing fields
    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!task) missingFields.push("task");
    if (!status) missingFields.push("status");
    if (!due_date) missingFields.push("due_date");
    if (!priority) missingFields.push("priority");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missing_fields: missingFields,
      });
    }

    // ✅ Create and save the new todo
    const newTodo = new Todo({
      username,
      task,
      status,
      due_date,
      priority,
      category,
      created_at: new Date(),
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      success: true,
      message: "✅ New todo task added successfully",
      data: savedTodo,
    });
  } catch (error) {
    console.error("❌ Error adding todo:", error);
    res.status(500).json({
      success: false,
      error: "Server error while adding new todo",
    });
  }
});

/**
 * @route   PUT /api/todos/:id
 * @desc    Update a todo’s status or details
 * @access  Public
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, task, due_date, priority, category } = req.body;

    // ✅ Prepare update fields dynamically
    const updateData = {};
    if (status) updateData.status = status;
    if (task) updateData.task = task;
    if (due_date) updateData.due_date = due_date;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;

    // ✅ Update document
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found with the provided ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.error("❌ Error updating todo:", error);
    res.status(500).json({
      success: false,
      error: "Server error while updating todo",
    });
  }
});

/**
 * @route   GET /api/todos/pending
 * @desc    Get all pending todos for a specific user (case-insensitive)
 * @access  Public
 * @example GET /api/todos/pending?username=Sandy
 */
router.get("/pending", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required in query parameters (e.g., ?username=Sandy)",
      });
    }

    // ✅ Case-insensitive match for "pending"
    const pendingTodos = await Todo.find({
      username,
      status: { $regex: /^pending$/i },
    }).sort({ created_at: -1 });

    const pendingCount = pendingTodos.length;

    res.status(200).json({
      success: true,
      message: `Found ${pendingCount} pending tasks for user '${username}'.`,
      count: pendingCount,
      pending_tasks: pendingTodos,
    });
  } catch (error) {
    console.error("❌ Error fetching pending todos:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching pending todos",
    });
  }
});

export default router;
