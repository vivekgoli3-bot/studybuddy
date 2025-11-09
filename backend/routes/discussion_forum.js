import express from "express";
import mongoose from "mongoose";
import Discussion from "../models/DiscussionForum.js";

const router = express.Router();

/**
 * @route   GET /api/discussion_forum
 * @desc    Get all discussion questions
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find();
    res.status(200).json({
      success: true,
      count: discussions.length,
      discussions,
    });
  } catch (error) {
    console.error("❌ Error fetching discussions:", error);
    res.status(500).json({ success: false, error: "Server error fetching discussions" });
  }
});

/**
 * @route   POST /api/discussion_forum
 * @desc    Add a new question
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { username, question } = req.body;

    if (!username || !question) {
      return res.status(400).json({
        success: false,
        message: "Both username and question are required",
      });
    }

    const newQuestion = new Discussion({
      username,
      question,
      timestamp: new Date(),
      likes: 0,
      answers: [],
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "✅ Question added successfully",
      data: savedQuestion,
    });
  } catch (error) {
    console.error("❌ Error adding question:", error);
    res.status(500).json({ success: false, error: "Server error adding question" });
  }
});

/**
 * @route   PUT /api/discussion_forum/:id/answer
 * @desc    Add an answer to a question
 * @access  Public
 */
router.put("/:id/answer", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, answer } = req.body;

    if (!username || !answer) {
      return res.status(400).json({
        success: false,
        message: "Username and answer are required",
      });
    }

    const question = await Discussion.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const newAnswer = {
      answer_id: new mongoose.Types.ObjectId(),
      username,
      answer,
      timestamp: new Date(),
      likes: 0,
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(200).json({
      success: true,
      message: "✅ Answer added successfully",
      data: question,
    });
  } catch (error) {
    console.error("❌ Error adding answer:", error);
    res.status(500).json({ success: false, error: "Server error adding answer" });
  }
});

/**
 * @route   PUT /api/discussion_forum/:id/like
 * @desc    Add like to a question or an answer
 * @access  Public
 */
router.put("/:id/like", async (req, res) => {
  try {
    const { id } = req.params; // question ID
    const { type, answer_id } = req.body; // type: "question" or "answer"

    if (!type || (type !== "question" && type !== "answer")) {
      return res.status(400).json({
        success: false,
        message: "Invalid 'type'. Must be either 'question' or 'answer'.",
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    if (type === "question") {
      discussion.likes += 1;
    } else if (type === "answer") {
      if (!answer_id) {
        return res.status(400).json({
          success: false,
          message: "Missing 'answer_id' for liking an answer.",
        });
      }

      const answer = discussion.answers.find(
        (ans) => ans.answer_id.toString() === answer_id
      );

      if (!answer) {
        return res.status(404).json({
          success: false,
          message: "Answer not found",
        });
      }

      answer.likes += 1;
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "👍 Like added successfully",
      data: discussion,
    });
  } catch (error) {
    console.error("❌ Error adding like:", error);
    res.status(500).json({ success: false, error: "Server error adding like" });
  }
});

export default router;
