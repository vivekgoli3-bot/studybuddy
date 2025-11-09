import express from "express";
import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

/**
 * @route   POST /api/ask_cohere
 * @desc    Sends a question to Cohere Chat API (trial-supported model)
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question in the request body",
      });
    }

    console.log("💬 Asking Cohere (command-r-08-2024):", question);

    // ✅ Use the latest live model for free/standard accounts
    const response = await cohere.chat({
      model: "command-r-08-2024",  // <-- latest working model
      message: question,
      temperature: 0.7,
    });

    const answer = response.text?.trim() || "No response from model.";

    res.status(200).json({
      success: true,
      question,
      answer,
    });
  } catch (err) {
    console.error("❌ Cohere Chat API Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch response from Cohere",
      error: err.message,
    });
  }
});

export default router;
