import { useState } from "react";
import api from "../api/axios";

const formatirajDatum = (datum) => {
  if (!datum) return "";

  if (datum instanceof Date) {
    return datum.toISOString().split("T")[0];
  }

  const strDatum = String(datum).trim();

  if (strDatum.includes(".")) {
    const delovi = strDatum.split(".").filter(Boolean);
    if (delovi.length === 3) {
      const dan = delovi[0].padStart(2, "0");
      const mesec = delovi[1].padStart(2, "0");
      const godina = delovi[2];
      return `${godina}-${mesec}-${dan}`;
    }
  }

  return strDatum.split("T")[0];
};

export function useRezervacije() {
  const [slobodniTerminiData, setSlobodniTerminiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rezervacije, setRezervacije] = useState([]);
  const [meta, setMeta] = useState(null);

  const fetchSlobodniTermini = async (terenId, datum, trajanje) => {
    setLoading(true);
    setError(null);
    setSlobodniTerminiData(null);

    try {
      const response = await api.get(`/tereni/${terenId}/slobodni-termini`, {
        params: {
          datum,
          trajanje,
        },
      });

      const resData = response.data.data || response.data;
      setSlobodniTerminiData(resData);
      return resData;
    } catch (err) {
      console.log("Greška pri preuzimanju slobodnih termina:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom dobijanja slobodnih termina.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearSlobodniTermini = () => {
    setSlobodniTerminiData(null);
    setError(null);
  };

  const fetchMyReservations = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const response = await api.get("/moje-rezervacije", {
        params: cleanFilters,
      });

      const data = response.data.data || [];
      const paginationMeta = response.data.meta || response.data.links || null;
      setRezervacije(data);
      setMeta(paginationMeta);

      return { data, meta: paginationMeta };
    } catch (err) {
      console.error(
        "Greška pri dohvatanju rezervacija vlasnika:",
        err.response,
      );
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom učitavanja rezervacija.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const kreirajRezervaciju = async (terenId, { datum, vreme_od, vreme_do }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/tereni/${terenId}/rezervacije`, {
        datum: formatirajDatum(datum),
        vreme_od,
        vreme_do,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Greška pri kreiranju rezervacije.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const otkaziRezervaciju = async (id) => {
    setLoading(true);
    try {
      const response = await api.patch(`/rezervacije/${id}/otkazi`);
      setRezervacije((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "otkazana" } : r)),
      );
      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          "Došlo je do greške prilikom otkazivanja rezervacije.",
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchVlasnikRezervacije = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const response = await api.get("/vlasnik/rezervacije", {
        params: cleanFilters,
      });

      const data = response.data.data || [];
      const paginationMeta = response.data.meta || response.data.links || null;

      setRezervacije(data);
      setMeta(paginationMeta);

      return { data, meta: paginationMeta };
    } catch (err) {
      console.error(
        "Greška pri dohvatanju rezervacija vlasnika:",
        err.response,
      );
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom učitavanja rezervacija.";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const promeniStatusRezervacije = async (rezervacijaId, status) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.patch(
        `/vlasnik/rezervacije/${rezervacijaId}/status`,
        { status },
      );
      const updatedData = response.data.data || response.data;

      setRezervacije((prev) =>
        prev.map((item) =>
          item.id === rezervacijaId
            ? { ...item, status, ...updatedData }
            : item,
        ),
      );

      return { success: true, data: updatedData };
    } catch (err) {
      console.error("Greška pri promeni statusa rezervacije:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Došlo je do greške prilikom promene statusa rezervacije.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    slobodniTerminiData,
    rezervacije,
    meta,
    loading,
    actionLoading,
    error,
    fetchMyReservations,
    fetchSlobodniTermini,
    clearSlobodniTermini,
    kreirajRezervaciju,
    otkaziRezervaciju,
    fetchVlasnikRezervacije,
    promeniStatusRezervacije,
  };
}
