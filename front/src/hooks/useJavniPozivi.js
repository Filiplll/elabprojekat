import { useState } from "react";
import api from "../api/axios";

export function useJavniPozivi() {
  const [pozivi, setPozivi] = useState([]);
  const [poziv, setPoziv] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJavniPozivi = async (queryParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(queryParams).filter(
          ([, val]) => val !== null && val !== undefined && val !== "",
        ),
      );

      const response = await api.get("/pozivi", {
        params: cleanedParams,
      });

      const data = response.data?.data || response.data || [];
      const paginationMeta = response.data?.meta || null;

      setPozivi(data);
      setMeta(paginationMeta);

      return { success: true, data, meta: paginationMeta };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom učitavanja javnih poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchJavniPozivById = async (pozivId) => {
    if (!pozivId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/pozivi/${pozivId}`);
      const data = response.data?.data || response.data;

      setPoziv(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom učitavanja detalja javnog poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

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
      console.log(err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom kreiranja javnog poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const izmeniJavniPoziv = async (pozivId, payload) => {
    if (!pozivId) return;

    setActionLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/pozivi/${pozivId}`, payload);
      const updatedData = response.data?.data || response.data;

      setPoziv((prev) => (prev?.id === pozivId ? updatedData : prev));

      setPozivi((prev) =>
        prev.map((item) => (item.id === pozivId ? updatedData : item)),
      );

      return { success: true, data: updatedData };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Greška prilikom izmene javnog poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const otkaziJavniPoziv = async (pozivId) => {
    if (!pozivId) return;

    setActionLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/pozivi/${pozivId}/otkazi`);
      const data = response.data?.data || response.data;

      setPozivi((prev) => prev.filter((item) => item.id !== pozivId));
      if (poziv?.id === pozivId) {
        setPoziv(null);
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Greška prilikom otkazivanja javnog poziva.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    pozivi,
    poziv,
    meta,
    loading,
    actionLoading,
    error,
    fetchJavniPozivi,
    fetchJavniPozivById,
    kreirajJavniPoziv,
    izmeniJavniPoziv,
    otkaziJavniPoziv,
  };
}
