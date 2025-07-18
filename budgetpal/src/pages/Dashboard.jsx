import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
const Dashboard = () => {
  const { expenses } = useExpenses();
  const recentExpenses = expenses.slice(0, 5); // Show top 5 recent expenses
  const total = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
   const { user } = useAuth(); 
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Welcome,  {user?.name || "Guest"}  👋</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Track your group expenses, add new entries, and stay on budget!
      </p>

      {/* 🔹 Total Overview */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-2">💸 Total Spent</h3>
          <p className="text-2xl text-primary font-semibold">₹{total.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-2">📆 Total Entries</h3>
          <p className="text-2xl text-primary font-semibold">{expenses.length}</p>
        </div>
      </div>

      {/* 🔹 Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">🧾 Recent Expenses</h3>
        {recentExpenses.length ? (
          <ul className="space-y-2">
            {recentExpenses.map((exp, index) => (
              <li key={exp._id || index} className="flex justify-between text-sm">
                <span>{exp.title} ({exp.category})</span>
                <span className="font-medium text-primary">₹{exp.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No expenses yet. Start adding!</p>
        )}
      </div>

      {/* 🔹 Motivational Card */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <h3 className="text-lg font-bold mb-2">🌱 Budget Tip</h3>
        <p className="text-gray-600 dark:text-gray-300">
          "Saving is a great habit, but without investing and tracking — it just sleeps!" 💡
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
