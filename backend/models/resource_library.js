import mongoose from "mongoose";

const ResourceLibrarySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  username: { type: String, required: true },
  drive_link: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

// 👇 explicitly set the collection name to "resource_library"
export default mongoose.model("ResourceLibrary", ResourceLibrarySchema, "resource_library");
