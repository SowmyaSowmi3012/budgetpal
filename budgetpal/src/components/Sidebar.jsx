import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth
import DarkModeToggle from "./DarkModeToggle";
import taeImg from "../assets/TaeTae.jpeg";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ Get user and logout

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Groups", path: "/groups" },
    { name: "Add Expense", path: "/add" },
    { name: "Summary", path: "/summary" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* 🔹 Mobile Top Header - hidden when sidebar is open */}
      <div
        className={`fixed top-0 left-0 w-full md:hidden bg-white dark:bg-gray-800 shadow z-30 flex items-center justify-between px-4 py-3 transition-opacity duration-300 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <h1 className="text-xl font-bold text-primary dark:text-white">💰 BudgetPal</h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl text-primary dark:text-white focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* 🔹 Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md z-20 transition-transform duration-300 ease-in-out transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        {/* 🔹 Sidebar Logo (Desktop only) */}
        <div className="hidden md:flex items-center justify-center p-6 font-bold text-xl text-primary dark:text-white">
          💰 BudgetPal
        </div>

        {/* 👤 Profile Avatar */}
        <div className="flex flex-col items-center p-4 border-b border-gray-200 dark:border-gray-700">
         <img
  src={
    user?.profileImage
      ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
      : "/default.jpeg"
  }
  alt="Profile"
  className="rounded-full w-24 h-24 object-cover"
/>
          <h3 className="text-lg font-semibold text-primary dark:text-white">
            {user?.name || "Guest"}
          </h3>
          <div className="mt-4">
            <DarkModeToggle />
          </div>
        </div>

        {/* 🔗 Nav Links */}
        <nav className="flex flex-col space-y-2 p-4 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative px-4 py-2 rounded hover:bg-secondary dark:hover:bg-gray-700 transition-all ${
                location.pathname === link.path
                  ? "bg-secondary dark:bg-gray-700 font-semibold text-primary"
                  : ""
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute left-0 bottom-0 w-full h-1 bg-primary rounded animate-slideIn" />
              )}
            </Link>
          ))}

          {/* 🚪 Logout */}
          <button
            className="mt-8 bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90"
            onClick={() => {
              logout();
              toast.success("Logged out successfully!");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
