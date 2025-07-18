import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GroupDashboard = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/groups/${id}`, config);
      setGroup(res.data);
    } catch (err) {
      toast.error("Group not found");
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

const handleAddExpense = async (e) => {
  e.preventDefault();

  if (!description.trim() || !amount || !paidBy.trim()) {
    return toast.error("Please fill in all fields");
  }

  if (Number(amount) <= 0) {
    return toast.error("Amount must be greater than 0");
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/groups/${id}/expenses`,
      {
        description: description.trim(),
        amount: Number(amount),
        paidBy,
      },
      config
    );

    toast.success("Expense added");

    // Reset fields
    setDescription("");
    setAmount("");
    setPaidBy("");

    fetchGroup(); // Refresh group data
  } catch (err) {
    toast.error("Error adding expense");
  }
};
  if (!group) return <p>Loading group data...</p>;

  const pieData = {
    labels: group.members.map((m) => m.email),
    datasets: [
      {
        label: "Total Spent",
        data: group.members.map((m) => m.totalSpent || 0),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Group Dashboard</h2>

      <p>Group Name: <strong>{group.name}</strong></p>

      <p className="mt-4 font-semibold">Members:</p>
      <ul className="list-disc pl-5 mb-6">
        {group.members.map((member) => (
          <li key={member._id}>
            {member.email} - ₹{member.totalSpent || 0}
          </li>
        ))}
      </ul>

      <div className="max-w-md mx-auto bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2 text-center">💰 Expense Distribution</h3>
        <Pie data={pieData} />
      </div>

      <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">➕ Add Expense</h3>
        <form onSubmit={handleAddExpense} className="space-y-3">
          <input
            type="text"
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full border p-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="w-full border p-2 rounded"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select Payer</option>
            {group.members.map((m) => (
              <option key={m._id} value={m._id}>{m.email}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupDashboard;
