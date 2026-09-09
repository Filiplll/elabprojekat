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
  const [error, setError] = useState(null);

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

  return {
    slobodniTerminiData,
    loading,
    error,
    fetchSlobodniTermini,
    clearSlobodniTermini,
    kreirajRezervaciju,
  };
}
