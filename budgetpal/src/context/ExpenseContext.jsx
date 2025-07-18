import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ExpenseContext = createContext();
export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, getAuthConfig());
      setExpenses(res.data);
    } catch (err) {
      console.error("❌ Error fetching:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }
  };

  const addExpense = async (expense) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, expense, getAuthConfig());
      fetchExpenses();
    } catch (err) {
      console.error("❌ Error adding:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, getAuthConfig());
      fetchExpenses();
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};
