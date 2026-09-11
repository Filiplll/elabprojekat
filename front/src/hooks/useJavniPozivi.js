import { useState } from "react";
import api from "../api/axios";

export function useJavniPozivi() {
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const kreirajJavniPoziv = async (payload) => {
    setActionLoading(true);
    setError(null);

    const { rezervacijaId, ...restPayload } = payload;
    const targetId = rezervacijaId;

    try {
      const response = await api.post(
        `/rezervacije/${targetId}/poziv`,
        restPayload,
      );
      const data = response.data?.data || response.data;

      return { success: true, data };
    } catch (err) {
      console.log(err.response.data.error);
      const errorMessage =
        err.response?.data?.error || "Greška prilikom kreiranja javnog poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    error,
    kreirajJavniPoziv,
  };
}
