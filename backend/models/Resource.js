import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  username: { type: String, required: true },
  drive_link: { type: String, required: true }
});

// Connects to the existing "resource_library" collection
const Resource = mongoose.model("Resource", ResourceSchema, "resource_library");

export default Resource;
