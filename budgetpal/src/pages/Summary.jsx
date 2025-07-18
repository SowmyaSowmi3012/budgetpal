import { useExpenses } from "../context/ExpenseContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#5C6AC4", "#FFA07A", "#F9A825", "#00C49F", "#FF69B4"];

const Summary = () => {
  const { expenses, deleteExpense } = useExpenses(); // ✅ Include deleteExpense
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const total = safeExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const categoryData = Object.values(
    safeExpenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || { category: exp.category, amount: 0 };
      acc[exp.category].amount += Number(exp.amount) || 0;
      return acc;
    }, {})
  );

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">📊 Expense Summary</h2>

      {/* 🔸 Total Spent */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
        <p className="text-lg">
          <strong>Total Spent:</strong> ₹{total.toFixed(2)}
        </p>
      </div>

      {/* 🔸 Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No expenses to display yet.</p>
        )}
      </div>

      {/* 🔸 Expense List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">🧾 All Expenses</h3>
        {safeExpenses.length > 0 ? (
          <ul className="space-y-2">
            {safeExpenses.map((exp, index) => (
              <li
                key={exp._id || index}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
              >
                <div>
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.category} • {exp.date ? new Date(exp.date).toLocaleDateString() : "No date"}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-primary">₹{exp.amount}</span>

                  {/* 🗑️ Delete Button */}
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this expense?")) {
                        deleteExpense(exp._id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No expenses yet.</p>
        )}
      </div>
    </>
  );
};

export default Summary;
