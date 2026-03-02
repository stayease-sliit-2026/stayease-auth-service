import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: {
    type: String,
    enum: ["guest", "admin"],
    default: "guest"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);