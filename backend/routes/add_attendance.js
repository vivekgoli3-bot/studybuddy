import express from "express";
import Attendance from "../models/Attendance.js"; // Your attendance model
import Subject from "../models/Subject.js"; // Or wherever your subjects are stored

const router = express.Router();

/**
 * @route   POST /api/add_attendance
 * @desc    Add attendance record by subject name
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { username, subjectName, classesConducted, classesAttended } = req.body;

    // ✅ Validate required fields
    if (!username || !subjectName || classesConducted == null || classesAttended == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username, subjectName, classesConducted, classesAttended",
      });
    }

    // ✅ Find the subject by subject name
    const subject = await Subject.findOne({ subject_name: subjectName });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `Subject '${subjectName}' not found in subjects collection`,
      });
    }

    // ✅ Calculate attendance details
    const classesMissed = classesConducted - classesAttended;
    const attendancePercentage = parseFloat(
      ((classesAttended / classesConducted) * 100).toFixed(2)
    );
    const maxClassesFor85 = Math.floor(classesAttended / 0.85);
    const safeBunk = Math.max(0, maxClassesFor85 - classesConducted);
    const status = attendancePercentage >= 85 ? "Safe" : "Danger";

    // ✅ Create attendance document
    const attendanceDoc = new Attendance({
      username: username,
      subject_id: subject._id,
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      total_classes: subject.total_classes,
      classes_conducted: classesConducted,
      classes_attended: classesAttended,
      classes_missed: classesMissed,
      attendance_percentage: attendancePercentage,
      safe_bunk: safeBunk,
      status: status,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // ✅ Save to DB
    const savedAttendance = await attendanceDoc.save();

    res.status(201).json({
      success: true,
      message: "✅ Attendance record added successfully",
      data: savedAttendance,
    });
  } catch (error) {
    console.error("❌ Error adding attendance:", error);
    res.status(500).json({
      success: false,
      error: "Server error while adding attendance",
    });
  }
});

export default router;
