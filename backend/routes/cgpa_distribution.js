import express from "express";
import Cgpa from "../models/Cgpa.js";

const router = express.Router();

/**
 * Helper function to calculate CGPA
 */
const calculateCGPA = (sgpaData) => {
  const sgpaValues = Object.values(sgpaData).filter((val) => val !== null);
  if (sgpaValues.length === 0) return null;
  const total = sgpaValues.reduce((sum, val) => sum + val, 0);
  return parseFloat((total / sgpaValues.length).toFixed(3));
};

/**
 * @route   GET /api/cgpa_distribution/:username
 * @desc    Fetch CGPA and SGPA distribution of a particular user
 * @access  Public
 */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const cgpaData = await Cgpa.findOne({ username });

    if (!cgpaData) {
      return res.status(404).json({
        success: false,
        message: `No CGPA record found for username '${username}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `✅ CGPA distribution for ${username}`,
      data: cgpaData,
    });
  } catch (error) {
    console.error("❌ Error fetching CGPA:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching CGPA data",
    });
  }
});

/**
 * @route   POST /api/cgpa_distribution
 * @desc    Add new SGPA details and calculate CGPA
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { username, sgpa } = req.body;

    if (!username || !sgpa) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username and sgpa",
      });
    }

    // ✅ Check if user already exists
    const existing = await Cgpa.findOne({ username });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Record already exists. Use PUT to update SGPA.",
      });
    }

    // ✅ Calculate CGPA
    const cgpa = calculateCGPA(sgpa);

    // ✅ Create new record
    const newCgpa = new Cgpa({
      username,
      sgpa,
      cgpa,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedRecord = await newCgpa.save();

    res.status(201).json({
      success: true,
      message: "✅ CGPA record created successfully",
      data: savedRecord,
    });
  } catch (error) {
    console.error("❌ Error adding CGPA record:", error);
    res.status(500).json({
      success: false,
      error: "Server error while adding CGPA record",
    });
  }
});

/**
 * @route   PUT /api/cgpa_distribution/:username
 * @desc    Update SGPA for a particular semester and recalculate CGPA
 * @access  Public
 */
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { semester, sgpaValue } = req.body;

    if (!semester || sgpaValue == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: semester and sgpaValue",
      });
    }

    const record = await Cgpa.findOne({ username });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `No CGPA record found for username '${username}'`,
      });
    }

    // ✅ Update SGPA for that semester
    record.sgpa[semester] = sgpaValue;

    // ✅ Recalculate CGPA
    record.cgpa = calculateCGPA(record.sgpa);
    record.updatedAt = new Date();

    const updatedRecord = await record.save();

    res.status(200).json({
      success: true,
      message: `✅ SGPA updated for ${semester}, CGPA recalculated`,
      data: updatedRecord,
    });
  } catch (error) {
    console.error("❌ Error updating CGPA:", error);
    res.status(500).json({
      success: false,
      error: "Server error while updating CGPA record",
    });
  }
});

export default router;
