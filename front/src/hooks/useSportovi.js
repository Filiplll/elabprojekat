import { useState } from "react";
import api from "../api/axios";

export function useSportovi() {
  const [sportovi, setSportovi] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSportovi = async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/sportovi", {
        params: {
          page,
          per_page: perPage,
        },
      });

      const paginationMeta = response.data.meta || response.data.links || null;

      setSportovi(response.data.data);
      setMeta(paginationMeta);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške pri preuzimanju sportova.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const dodajSport = async (naziv) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/admin/sportovi", { naziv });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške pri dodavanju sporta.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const izmeniSport = async (sportId, naziv) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/admin/sportovi/${sportId}`, { naziv });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Došlo je do greške pri izmeni sporta.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const obrisiSport = async (sportId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/admin/sportovi/${sportId}`);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške pri brisanju sporta.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sportovi,
    meta,
    loading,
    error,
    fetchSportovi,
    dodajSport,
    izmeniSport,
    obrisiSport,
  };
}
