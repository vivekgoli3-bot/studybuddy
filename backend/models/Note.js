import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  drive_link: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Note", noteSchema);
