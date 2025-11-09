import mongoose from "mongoose";

const FetchNoteSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
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

// Export model
const FetchNote = mongoose.model("FetchNote", FetchNoteSchema,"notes");
export default FetchNote;
