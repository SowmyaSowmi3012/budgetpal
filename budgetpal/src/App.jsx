  // src/App.jsx
  import { Routes, Route, Navigate } from "react-router-dom";
  import { useAuth } from "./context/AuthContext";
  import Sidebar from "./components/Sidebar";
  import Dashboard from "./pages/Dashboard";
  import AddExpense from "./pages/AddExpense";
  import Summary from "./pages/Summary";
  import Groups from "./pages/Groups";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import GroupDashboard from "./pages/GroupDashboard";
  const App = () => {
    const { user } = useAuth();

    if (!user) {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
         <Route
  path="/dashboard"
  element={user ? <Dashboard /> : <Navigate to="/login" />}
/>
        </Routes>
      );
    }

    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/groups/:id" element={<GroupDashboard />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    );
  };

  export default App;
