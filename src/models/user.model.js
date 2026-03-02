import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["guest", "admin"],
    default: "guest"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);