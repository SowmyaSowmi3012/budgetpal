import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/update", updateProfile);
router.put('/update-profile', authMiddleware, updateProfile);
export default router;
