import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("etp_token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Restore cached user immediately
    const cachedUser = localStorage.getItem("etp_user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error("Failed to parse cached user:", e);
      }
    }

    const attempt = async (retriesLeft) => {
      try {
        const { data } = await api.get("/auth/me");

        setUser(data.data.user);
        localStorage.setItem("etp_user", JSON.stringify(data.data.user));
      } catch (err) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          // Token is actually invalid
          localStorage.removeItem("etp_token");
          localStorage.removeItem("etp_user");
          setUser(null);
          return;
        }

        if (retriesLeft > 0) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return attempt(retriesLeft - 1);
        }

        console.error("Unable to verify session.");
      }
    };

    await attempt(3);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("etp_token", data.data.token);
    localStorage.setItem("etp_user", JSON.stringify(data.data.user));

    setUser(data.data.user);

    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    localStorage.setItem("etp_token", data.data.token);
    localStorage.setItem("etp_user", JSON.stringify(data.data.user));

    setUser(data.data.user);

    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem("etp_token");
    localStorage.removeItem("etp_user");
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem("etp_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}