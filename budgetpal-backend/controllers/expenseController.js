import Expense from "../models/Expense.js";

// 🔍 Get expenses for logged-in user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// ➕ Add a new expense for the logged-in user
export const addExpense = async (req, res) => {
  try {
    const newExpense = new Expense({ ...req.body, user: req.userId });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("❌ Error adding expense:", err);
    res.status(400).json({ error: "Failed to add expense" });
  }
};

// 🗑️ Delete an expense (only if owned by user)
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Expense.deleteOne({ _id: id, user: req.userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Expense not found or unauthorized" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
export const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch group expenses" });
  }
};