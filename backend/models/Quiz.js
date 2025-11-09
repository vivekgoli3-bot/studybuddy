import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question_number: Number,
  question: String,
  options: [String],
  correct_answer: Number,
});

const ModuleSchema = new mongoose.Schema({
  module_name: String,
  questions: [QuestionSchema],
});

const QuizSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  modules: [ModuleSchema],
});

const Quiz = mongoose.model("quizzes", QuizSchema);
export default Quiz;
