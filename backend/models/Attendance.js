import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  subject_name: {
    type: String,
    required: true,
  },
  subject_code: {
    type: String,
    required: true,
  },
  total_classes: {
    type: Number,
    default: 0,
  },
  classes_conducted: {
    type: Number,
    required: true,
  },
  classes_attended: {
    type: Number,
    required: true,
  },
  classes_missed: {
    type: Number,
    required: true,
  },
  attendance_percentage: {
    type: Number,
    required: true,
  },
  safe_bunk: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Safe", "Danger"],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

attendanceSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
