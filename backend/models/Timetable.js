import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  periods: [
    {
      time: String,
      subject: String,
      subject_code: String,
      faculty_name: String,
      type: String
    }
  ]
});

export default mongoose.model("Timetable", timetableSchema, "timetable");
