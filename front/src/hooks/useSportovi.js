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

  return {
    sportovi,
    meta,
    loading,
    error,
    fetchSportovi,
  };
}
