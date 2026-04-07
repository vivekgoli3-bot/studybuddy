import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/**
 * @route   GET /api/attendance_summary/average/:username
 * @desc    Get the average attendance percentage of a user across all subjects
 * @access  Public
 */
router.get("/average/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const records = await Attendance.find({ username });

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No attendance records found for user '${username}'`,
      });
    }

    // ✅ Calculate average attendance percentage
    const totalPercentage = records.reduce(
      (sum, rec) => sum + rec.attendance_percentage,
      0
    );
    const averageAttendance = parseFloat(
      (totalPercentage / records.length).toFixed(2)
    );

    res.status(200).json({
      success: true,
      username,
      message: `✅ Average attendance for ${username}`,
      average_attendance_percentage: averageAttendance,
      total_subjects: records.length,
    });
  } catch (error) {
    console.error("❌ Error calculating average attendance:", error);
    res.status(500).json({
      success: false,
      error: "Server error while calculating average attendance",
    });
  }
});

/**
 * @route   GET /api/attendance_summary/total_classes/:username
 * @desc    Get the total number of classes conducted for all subjects of a user
 * @access  Public
 */
router.get("/total_classes/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const records = await Attendance.find({ username });

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No attendance records found for user '${username}'`,
      });
    }

    // ✅ Calculate total classes conducted and attended
    const totalConducted = records.reduce(
      (sum, rec) => sum + rec.classes_conducted,
      0
    );
    const totalAttended = records.reduce(
      (sum, rec) => sum + rec.classes_attended,
      0
    );
    const totalMissed = records.reduce(
      (sum, rec) => sum + rec.classes_missed,
      0
    );

    res.status(200).json({
      success: true,
      username,
      message: `✅ Total classes summary for ${username}`,
      total_classes_conducted: totalConducted,
      total_classes_attended: totalAttended,
      total_classes_missed: totalMissed,
    });
  } catch (error) {
    console.error("❌ Error fetching total classes:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching total classes",
    });
  }
});

export default router;
