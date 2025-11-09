import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

/**
 * @route   GET /api/fetch_quiz_subjects
 * @desc    Fetch list of quiz subjects
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const subjects = await Quiz.find({}, { subject: 1, _id: 0 });
    const subjectList = subjects.map(q => q.subject);

    if (subjectList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subjects found in quizzes collection"
      });
    }

    res.status(200).json({
      success: true,
      count: subjectList.length,
      subjects: subjectList
    });
  } catch (err) {
    console.error("❌ Error fetching quiz subjects:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching quiz subjects"
    });
  }
});


/**
 * @route   GET /api/fetch_quiz_subjects/:subject
 * @desc    Fetch module names for a specific subject
 * @access  Public
 */
router.get("/:subject", async (req, res) => {
  const { subject } = req.params;

  try {
    const quiz = await Quiz.findOne(
      { subject: subject.toUpperCase() },
      { "modules.module_name": 1, _id: 0 }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `No quiz found for subject '${subject}'`
      });
    }

    const moduleNames = quiz.modules.map(m => m.module_name);

    res.status(200).json({
      success: true,
      subject: subject.toUpperCase(),
      count: moduleNames.length,
      modules: moduleNames
    });
  } catch (err) {
    console.error("❌ Error fetching module names:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching modules for subject"
    });
  }
});


/**
 * @route   GET /api/fetch_quiz_subjects/:subject/:module
 * @desc    Fetch questions from a specific module of a specific subject
 * @access  Public
 */
router.get("/:subject/:module", async (req, res) => {
  const { subject, module } = req.params;

  try {
    const quiz = await Quiz.findOne(
      { subject: subject.toUpperCase() },
      { modules: 1, _id: 0 }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `No quiz found for subject '${subject}'`
      });
    }

    const selectedModule = quiz.modules.find(
      (m) => m.module_name.toUpperCase() === module.toUpperCase()
    );

    if (!selectedModule) {
      return res.status(404).json({
        success: false,
        message: `Module '${module}' not found in subject '${subject}'`
      });
    }

    res.status(200).json({
      success: true,
      subject: subject.toUpperCase(),
      module: selectedModule.module_name,
      questionCount: selectedModule.questions.length,
      questions: selectedModule.questions
    });
  } catch (err) {
    console.error("❌ Error fetching module questions:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching module questions"
    });
  }
});

export default router;
