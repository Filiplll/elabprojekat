import { useState } from "react";
import api from "../api/axios";

export function useTereni() {
  const [tereni, setTereni] = useState([]);

  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchTereni = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const isMojiTereni =
        cleanFilters.moji === "true" || cleanFilters.view === "my";

      const { moji, view, ...queryParams } = cleanFilters;

      const endpoint = isMojiTereni ? "/vlasnik/tereni" : "/tereni";

      const response = await api.get(endpoint, {
        params: {
          ...queryParams,
          per_page: 6,
        },
      });

      const data = response.data.data || response.data;
      const paginationMeta = response.data.meta || response.data.links || null;

      setTereni(data);
      setMeta(paginationMeta);

      return data;
    } catch (err) {
      console.log(err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom učitavanja terena.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tereni,
    meta,
    loading,
    error,
    fetchTereni,
  };
}
