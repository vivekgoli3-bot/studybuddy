import mongoose from "mongoose";

const quizScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  subject: { type: String, required: true },
  module: { type: String, required: true },
  total_questions: { type: Number, required: true },
  correct_answers: { type: Number, required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true },
  time_taken: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("QuizScore", quizScoreSchema, "quiz_scores");
