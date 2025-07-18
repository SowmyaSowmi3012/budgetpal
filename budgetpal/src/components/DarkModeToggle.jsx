import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-opacity-90 transition-all"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
};

export default DarkModeToggle;
