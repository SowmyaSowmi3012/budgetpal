import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
   const stored = localStorage.getItem("user");
return stored && stored !== "undefined" ? JSON.parse(stored) : null;
  });

const login = async (credentials) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, credentials);
  const user = res.data;
  setUser(user);
  localStorage.setItem("user", JSON.stringify(user));
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
