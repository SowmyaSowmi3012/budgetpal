import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import GroupExpense from "../models/GroupExpense.js";

// 📥 Get all groups created by the logged-in user
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};

// ➕ Create a new group
export const createGroup = async (req, res) => {
  const { name } = req.body;
  try {
    const newGroup = new Group({
      name,
      createdBy: req.userId,
      members: [req.userId],
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ message: "Error creating group" });
  }
};

// ✅ FIXED ➕ Add a member to a group
export const addMemberToGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId; // ✅ FIXED this line
    const { email } = req.body;

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.members.includes(userToAdd._id)) {
      return res.status(400).json({ error: "User already a member" });
    }

    group.members.push(userToAdd._id);
    await group.save();

    res.json({ message: "Member added successfully" });
  } catch (err) {
    console.error("❌ Error adding member:", err);
    res.status(500).json({ error: "Failed to add member" });
  }
};

// 💸 Add expense (optionally to a group)
export const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { description, amount, paidBy } = req.body;

    if (!description || !amount || !paidBy) {
      return res.status(400).json({ message: "Description, amount, and paidBy are required." });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const expense = new GroupExpense({
      description,
      amount,
      paidBy,
      groupId,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding group expense:", error);
    res.status(500).json({ message: "Failed to add group expense" });
  }
};



// 🗑️ Delete group
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found or unauthorized" });
    }

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};

// 📊 Get group expense summary
// 📊 Corrected: Get group expense summary
export const getGroupSummary = async (req, res) => {
  const { groupId } = req.params;

  try {
    const expenses = await GroupExpense.find({ groupId }); // ✅ Correct model
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.json({ total });
  } catch (err) {
    console.error("Error in getGroupSummary:", err);
    res.status(500).json({ message: "Failed to get group summary" });
  }
};

// controllers/groupController.js
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "email")
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    const expenses = await GroupExpense.find({ groupId: group._id }).lean();

    // Calculate total spent by each member
    const memberSpendingMap = {};
    for (const member of group.members) {
      memberSpendingMap[member._id.toString()] = 0;
    }

    for (const expense of expenses) {
      const paidById = expense.paidBy.toString();
      if (memberSpendingMap[paidById] !== undefined) {
        memberSpendingMap[paidById] += expense.amount;
      }
    }

    // Attach totalSpent to each member
    const updatedMembers = group.members.map((member) => ({
      ...member,
      totalSpent: memberSpendingMap[member._id.toString()] || 0,
    }));

    res.json({
      _id: group._id,
      name: group.name,
      members: updatedMembers,
      expenses, // include expenses to show on frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching group" });
  }
};
