export const checkRole = (req, res) => {
  // req.user is set by authenticate middleware
  if (!req.user || !req.user.role) {
    return res.status(400).json({ message: "Role not found in token" });
  }
  res.json({ role: req.user.role });
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


  export const register = async (req, res) => {
    try{
      const { name, email, password, mobile } = req.body;
      if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: "name, email, password and mobile are required" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (String(password).length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      // Basic mobile validation (10-15 digits)
      if (!/^\d{10,15}$/.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number format" });
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: "User already exists" });

      const passwordHash = await bcrypt.hash(password, 10);

      await User.create({ name, email, passwordHash, mobile });

      res.status(201).json({ message: "Registered", });
      
    }
    catch (error) {
      res.status(500).json({ message: "Registration failed" });
     }
  }


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};


export const verifyToken = (req, res) => {
  console.log("Verifying token...req.headers.authorization:", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ valid: false });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};



export const logout = (req, res) => {
 try {  
   res.json({ message: "Logged out" });
 } catch (error) {
   res.status(500).json({ message: "Logout failed" });
 }
};