import { useState } from "react";
import api from "../api/axios";

export const useKorisnici = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKorisnici = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/admin/users", {
        params: {
          pretraga: params.pretraga || undefined,
          type: params.type || undefined,
          banovan: params.banovan ?? undefined,
          sort_by: params.sort_by || undefined,
          order: params.order || undefined,
          page: params.page || 1,
          per_page: params.per_page || 10,
        },
      });

      setKorisnici(response.data.data);
      setMeta(response.data.meta);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške pri preuzimanju korisnika.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const ToggleBanKorisnika = async (userId, banovan) => {
    setError(null);

    try {
      const response = await api.patch(`/admin/users/${userId}/ban`, {
        banovan: Boolean(banovan),
      });

      setKorisnici((prevKorisnici) =>
        prevKorisnici.map((user) =>
          user.id === userId ? { ...user, banovan: Boolean(banovan) } : user,
        ),
      );

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške pri promeni statusa korisnika.";
      return { success: false, error: errorMessage };
    }
  };

  return {
    korisnici,
    meta,
    loading,
    error,
    fetchKorisnici,
    ToggleBanKorisnika,
  };
};
