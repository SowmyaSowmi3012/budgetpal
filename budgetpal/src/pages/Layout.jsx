import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-secondary dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 pt-16 p-6 md:ml-64">
        <Outlet /> {/* This renders the nested page */}
      </main>
    </div>
  );
};

export default Layout;
