import { useState } from "react";
import api from "../api/axios";

export function useTereni() {
  const [tereni, setTereni] = useState([]);
  const [teren, setTeren] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
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

  const fetchTerenById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/tereni/${id}`);
      const data = response.data.data || response.data;

      setTeren(data);
      return data;
    } catch (err) {
      console.log(err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom učitavanja detalja terena.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTeren = async (terenData) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.post("/vlasnik/tereni", terenData);
      const data = response.data.data || response.data;

      return data;
    } catch (err) {
      console.log(err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom kreiranja terena.";
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateTeren = async (id, terenData) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.put(`/vlasnik/tereni/${id}`, terenData);
      const data = response.data.data || response.data;

      setTeren(data);
      return data;
    } catch (err) {
      console.log(err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom ažuriranja terena.";
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTeren = async (id) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/vlasnik/tereni/${id}`);
      const data = response.data.data || response.data;

      setTereni((prevTereni) => prevTereni.filter((t) => t.id !== id));
      if (teren && teren.id === id) {
        setTeren(null);
      }

      return data;
    } catch (err) {
      console.log(err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom brisanja terena.";
      setError(errorMessage);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    tereni,
    teren,
    meta,
    loading,
    actionLoading,
    error,
    fetchTereni,
    fetchTerenById,
    createTeren,
    updateTeren,
    deleteTeren,
  };
}
