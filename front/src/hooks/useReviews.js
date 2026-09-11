import { useState } from "react";
import api from "../api/axios";

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviewsForAdmin = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== null && value !== undefined && value !== "",
        ),
      );

      const response = await api.get("/admin/recenzije", { params: payload });
      setReviews(response.data.data);
      setMeta(response.data.meta);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Greška pri učitavanju recenzija.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchRecenzijeTerena = async (terenId, queryParams = {}) => {
    if (!terenId) return;

    setLoading(true);
    setError(null);

    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(queryParams).filter(
          ([, val]) => val !== null && val !== undefined && val !== "",
        ),
      );

      const response = await api.get(`/tereni/${terenId}/recenzije`, {
        params: cleanedParams,
      });

      const data = response.data?.data || response.data || [];
      const paginationMeta = response.data?.meta || null;

      setReviews(data);
      setMeta(paginationMeta);

      return { success: true, data, meta: paginationMeta };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom učitavanja recenzija za teren.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/admin/recenzije/${reviewId}/status`, {
        status,
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Greška pri izmeni statusa recenzije.";
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

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
    meta,
    loading,
    actionLoading,
    error,
    fetchReviewsForAdmin,
    fetchRecenzijeTerena,
    updateReviewStatus,
    kreirajRecenziju,
    izmeniRecenziju,
  };
};
