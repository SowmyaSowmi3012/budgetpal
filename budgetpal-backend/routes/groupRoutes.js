import express from "express";
import {
  getGroups,
  createGroup,
  addMemberToGroup, getGroupSummary,
  deleteGroup,getGroupById, addExpense,// 🆕 add this
} from "../controllers/groupController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getGroups);
router.post("/", authMiddleware, createGroup);
// routes/groupRoutes.js
router.post("/:groupId/add-member", authMiddleware, addMemberToGroup);
router.get("/:groupId/summary", authMiddleware, getGroupSummary);
router.delete("/:id", authMiddleware, deleteGroup); // 🆕 route
router.post("/:groupId/expenses", authMiddleware, addExpense);
router.get("/:id", authMiddleware, getGroupById);
export default router;
