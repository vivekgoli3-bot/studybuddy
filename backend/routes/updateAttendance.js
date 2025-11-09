import express from "express";
import Attendance from "../models/Attendance.js";
import Subject from "../models/Subject.js";

const router = express.Router();

/**
 * @route   PUT /api/update_attendance
 * @desc    Update attendance for an existing record (supports partial attendance)
 * @access  Public
 */
router.put("/", async (req, res) => {
  try {
    const { username, subjectName, newClassTaken, newClassesAttended } = req.body;

    // ✅ Validation
    if (!username || !subjectName || newClassTaken == null || newClassesAttended == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username, subjectName, newClassTaken, newClassesAttended",
      });
    }

    if (newClassesAttended > newClassTaken) {
      return res.status(400).json({
        success: false,
        message: "❌ newClassesAttended cannot be greater than newClassTaken",
      });
    }

    // ✅ Find the subject
    const subject = await Subject.findOne({ subject_name: subjectName });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `Subject '${subjectName}' not found.`,
      });
    }

    // ✅ Find existing attendance record for user & subject
    const attendance = await Attendance.findOne({
      username: username,
      subject_name: subjectName,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: `No attendance record found for ${username} in ${subjectName}`,
      });
    }

    // ✅ Update attendance counts
    const classesConducted = attendance.classes_conducted + newClassTaken;
    const classesAttended = attendance.classes_attended + newClassesAttended;
    const classesMissed = classesConducted - classesAttended;

    // ✅ Recalculate attendance metrics
    const attendancePercentage = parseFloat(
      ((classesAttended / classesConducted) * 100).toFixed(2)
    );
    const maxClassesFor85 = Math.floor(classesAttended / 0.85);
    const safeBunk = Math.max(0, maxClassesFor85 - classesConducted);
    const status = attendancePercentage >= 85 ? "Safe" : "Danger";

    // ✅ Update record
    attendance.classes_conducted = classesConducted;
    attendance.classes_attended = classesAttended;
    attendance.classes_missed = classesMissed;
    attendance.attendance_percentage = attendancePercentage;
    attendance.safe_bunk = safeBunk;
    attendance.status = status;
    attendance.updated_at = new Date();

    const updatedAttendance = await attendance.save();

    res.status(200).json({
      success: true,
      message: `✅ Attendance updated for ${username} in ${subjectName}`,
      data: updatedAttendance,
    });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({
      success: false,
      error: "Server error while updating attendance",
    });
  }
});

export default router;
