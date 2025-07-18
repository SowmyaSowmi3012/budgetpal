import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import toast from "react-hot-toast";

const AddExpense = () => {
  const { addExpense } = useExpenses();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !amount) {
    toast.error("Please fill in all fields");
    return;
  }

  if (parseFloat(amount) <= 0) {
    toast.error("Amount must be greater than 0");
    return;
  }

  const newExpense = {
    title,
    amount: parseFloat(amount),
    category,
    date: new Date().toISOString(),
  };

  try {
    await addExpense(newExpense);
    toast.success("Expense added!");

    // Reset form
    setTitle("");
    setAmount("");
    setCategory("Food");
  } catch (err) {
    toast.error("Failed to add expense");
  }
};
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">➕ Add Expense</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md"
      >
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Groceries, Uber..."
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Others</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90"
        >
          Add Expense
        </button>
      </form>
    </>
  );
};

export default AddExpense;
