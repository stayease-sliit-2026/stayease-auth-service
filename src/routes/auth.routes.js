import express from "express";
import { register, login, verifyToken, getProfile, updateProfile, logout, checkRole } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyToken);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/logout", authenticate, logout);
router.get("/role", authenticate, checkRole);

export default router;