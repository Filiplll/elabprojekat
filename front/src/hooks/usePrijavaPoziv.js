import { useState } from "react";
import api from "../api/axios";

export function usePrijavaPoziv() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pridruziSePozivu = async (pozivId) => {
    if (!pozivId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/pozivi/${pozivId}/pridruzi`);
      const data = response.data?.data || response.data;

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom pridruživanja javnom pozivu.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const napustiPoziv = async (pozivId) => {
    if (!pozivId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/pozivi/${pozivId}/pridruzi`);
      const data = response.data?.data || response.data;

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom napuštanja javnog poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    pridruziSePozivu,
    napustiPoziv,
  };
}
