import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subject_code: {
    type: String,
    required: true,
    trim: true,
  },
  subject_name: {
    type: String,
    required: true,
    trim: true,
  },
  faculty: {
    type: String,
    required: true,
    trim: true,
  },
  total_classes: {
    type: Number,
    required: true,
    default: 0,
  },
  semester: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update timestamps when modified
subjectSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
