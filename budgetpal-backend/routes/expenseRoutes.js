import express from "express";
import { getExpenses, addExpense, deleteExpense } from "../controllers/expenseController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getExpenses);
router.post("/", authMiddleware, addExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
