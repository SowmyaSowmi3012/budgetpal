import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("🎉 BudgetPal Backend is running!");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("✅ Backend running on port", process.env.PORT);
    });
  })
  .catch((err) => console.error(err));
