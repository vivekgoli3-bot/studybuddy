import express from "express";
import Timetable from "../models/Timetable.js";

const router = express.Router();

/**
 * @route   GET /api/upcoming_classes
 * @desc    Get the upcoming classes from timetable based on the current day
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const today = new Date();
    const todayIndex = today.getDay(); // 0 = Sunday
    const todayDay = weekDays[todayIndex];

    console.log("📅 Today is:", todayDay);

    // Fetch all timetable records
    const allDays = await Timetable.find().lean();

    if (!allDays || allDays.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No timetable entries found in database"
      });
    }

    // Try to find the next day with available periods
    let nextDayData = null;

    for (let i = 0; i < 7; i++) {
      const checkIndex = (todayIndex + i) % 7;
      const checkDay = weekDays[checkIndex];

      const dayData = allDays.find(d => d.day === checkDay);

      if (dayData && dayData.periods && dayData.periods.length > 0) {
        nextDayData = dayData;
        break;
      }
    }

    if (!nextDayData) {
      return res.status(404).json({
        success: false,
        message: "No upcoming classes found for the week"
      });
    }

    // Format the response
    const formattedClasses = nextDayData.periods.map(p => ({
      day: nextDayData.day,
      time: p.time,
      subject: p.subject,
      faculty_name: p.faculty_name,
      type: p.type
    }));

    res.status(200).json({
      success: true,
      upcoming_day: nextDayData.day,
      total_classes: formattedClasses.length,
      classes: formattedClasses
    });
  } catch (err) {
    console.error("❌ Error fetching upcoming classes:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Server error while fetching upcoming classes"
    });
  }
});

export default router;
