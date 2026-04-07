import express from "express";
import Resource from "../models/Resource.js"; // Mongoose model

const router = express.Router();

/**
 * @route   GET /api/fetch_resource_library
 * @desc    Fetch all resources from the resource_library collection
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resources found in the library"
      });
    }

    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (err) {
    console.error("❌ Error fetching resources:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching resources"
    });
  }
});

/**
 * @route   GET /api/fetch_resource_library/type_count
 * @desc    Get the count of resources grouped by their type
 * @access  Public
 */
router.get("/type_count", async (req, res) => {
  try {
    const typeCounts = await Resource.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          count: 1
        }
      }
    ]);

    if (typeCounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No resource types found"
      });
    }

    const formatted = {};
    typeCounts.forEach(item => {
      formatted[item.type] = item.count;
    });

    res.status(200).json({
      success: true,
      type_counts: formatted
    });
  } catch (err) {
    console.error("❌ Error getting type counts:", err);
    res.status(500).json({
      success: false,
      error: "Server error while getting type counts"
    });
  }
});

/**
 * @route   GET /api/fetch_resource_library/type/:type
 * @desc    Get all resources of a specific type (case-insensitive)
 * @access  Public
 */
router.get("/type/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const resources = await Resource.find({
      type: { $regex: new RegExp(`^${type}$`, "i") } // case-insensitive match
    });

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No resources found for type '${type}'`
      });
    }

    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (err) {
    console.error("❌ Error fetching resources by type:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching resources by type"
    });
  }
});

export default router;
