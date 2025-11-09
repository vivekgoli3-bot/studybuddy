import mongoose from "mongoose";

const cgpaSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  sgpa: {
    sem1: { type: Number, default: null },
    sem2: { type: Number, default: null },
    sem3: { type: Number, default: null },
    sem4: { type: Number, default: null },
    sem5: { type: Number, default: null },
    sem6: { type: Number, default: null },
    sem7: { type: Number, default: null },
    sem8: { type: Number, default: null },
  },
  cgpa: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cgpaSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Cgpa = mongoose.model("cgpa_collection", cgpaSchema);

export default Cgpa;
