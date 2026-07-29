import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error("Invalid user in localStorage:", err);
      localStorage.removeItem("user");
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.email === "dobariyasoham@gmail.com" ||
      user.email === "admin@smartshop.com" ||
      user.email?.toLowerCase().includes("admin"));

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
        isAdmin: !!isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);