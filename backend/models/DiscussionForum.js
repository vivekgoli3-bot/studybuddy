import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  answer_id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
  username: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

const discussionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  question: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  answers: [answerSchema],
});

const Discussion = mongoose.model("discussion_forum", discussionSchema);
export default Discussion;
