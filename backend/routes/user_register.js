import express from "express";
import UserLogin from "../models/UserLogin.js";

const router = express.Router();

/**
 * @route   POST /api/user_register
 * @desc    Register a new user (username and gmail must be unique)
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { username, gmail, password } = req.body;

    // ✅ Step 1: Validate input
    if (!username || !gmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username, gmail, or password",
      });
    }

    // ✅ Step 2: Check if username already exists
    const existingUsername = await UserLogin.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: `Username '${username}' is already taken.`,
      });
    }

    // ✅ Step 3: Check if gmail already exists
    const existingGmail = await UserLogin.findOne({ gmail });
    if (existingGmail) {
      return res.status(400).json({
        success: false,
        message: `Email '${gmail}' is already registered.`,
      });
    }

    // ✅ Step 4: Create new user
    const newUser = new UserLogin({
      username,
      gmail,
      password, // (optional: hash with bcrypt later)
    });

    const savedUser = await newUser.save();

    // ✅ Step 5: Respond with success
    res.status(201).json({
      success: true,
      message: "✅ User registered successfully!",
      user: {
        username: savedUser.username,
        gmail: savedUser.gmail,
      },
    });
  } catch (error) {
    console.error("❌ Error adding new user:", error);
    res.status(500).json({
      success: false,
      error: "Server error while registering new user",
    });
  }
});

export default router;
