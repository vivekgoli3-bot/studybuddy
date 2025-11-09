import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// ✅ GET attendance by username
router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username.trim(); // remove accidental spaces
    console.log("🔍 Searching for username:", username);

    // Add debug logging
    console.log("📝 MongoDB Query:", {
      username: { $regex: new RegExp(`^${username}$`, "i") }
    });
    
    // Try a simple exact match query first
    const attendance = await Attendance.find({ username: username });
    
    console.log("🔍 Found records:", JSON.stringify(attendance, null, 2));
    
    // Log the collection name and database
    const collectionName = Attendance.collection.collectionName;
    const dbName = Attendance.db.name;
    console.log("📚 Database:", dbName);
    console.log("📁 Collection:", collectionName);

    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No attendance records found for user: ${username}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully",
      data: attendance,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
