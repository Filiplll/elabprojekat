import { useState } from "react";
import api from "../api/axios";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const extractError = (err, defaultMsg) =>
    err.response?.data?.error || err.response?.data?.message || defaultMsg;

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const { data: res } = await api.post("/login", credentials);

      if (res.success) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        return { success: true, user: res.data };
      }

      const errMsg = res.error || "Pogrešan email ili lozinka.";
      setError(errMsg);
      return { success: false, error: errMsg };
    } catch (err) {
      const errorMessage = extractError(
        err,
        "Došlo je do greške prilikom prijave.",
      );
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Greška prilikom odjave na serveru:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    setError,
    login,
    logout,
  };
};
