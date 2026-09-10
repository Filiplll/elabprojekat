import { useState } from "react";
import api from "../api/axios";

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const kreirajRecenziju = async (rezervacijaId, payload) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.post(
        `/rezervacije/${rezervacijaId}/recenzija`,
        {
          ocena: payload.ocena,
          komentar: payload.komentar || null,
        },
      );

      const novaRecenzija = response.data?.data || response.data;

      setReviews((prev) => [novaRecenzija, ...prev]);

      return { success: true, data: novaRecenzija };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Greška prilikom dodavanja recenzije.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const izmeniRecenziju = async (recenzijaId, payload) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/recenzije/${recenzijaId}`, {
        ocena: payload.ocena,
        komentar: payload.komentar || null,
      });

      const azuriranaRecenzija = response.data?.data || response.data;

      setReviews((prev) =>
        prev.map((r) => (r.id === recenzijaId ? azuriranaRecenzija : r)),
      );

      return { success: true, data: azuriranaRecenzija };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Greška prilikom izmene recenzije.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    reviews,
    actionLoading,
    error,
    kreirajRecenziju,
    izmeniRecenziju,
  };
};
