import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  username: { type: String, required: true },
  task: { type: String, required: true },
  status: { type: String, default: "pending" },
  due_date: { type: String },
  priority: { type: String },
  category: { type: String },
  created_at: { type: Date, default: Date.now }
});

// Use existing "todos" collection
const Todo = mongoose.model("Todo", TodoSchema, "todos");

export default Todo;
