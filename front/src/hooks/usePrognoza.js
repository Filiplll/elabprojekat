import { useState, useEffect } from "react";
import axios from "axios";

export function usePrognoza(grad, datum) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      if (!grad || !datum) {
        setData(null);
        setLoading(false);
        setError(null);
        return;
      }

      let rawDatum = String(datum).trim().split("T")[0];

      let formattedDatum = rawDatum;

      if (rawDatum.includes(".")) {
        const parts = rawDatum.split(".").filter(Boolean);
        if (parts.length === 3) {
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          formattedDatum = `${year}-${month}-${day}`;
        }
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDatum)) {
        setError("Nevalidan format datuma");
        setLoading(false);
        return;
      }

      const [year, month, day] = formattedDatum.split("-").map(Number);
      const targetDate = new Date(year, month - 1, day);
      targetDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxForecastDate = new Date(today);
      maxForecastDate.setDate(today.getDate() + 15);
      maxForecastDate.setHours(23, 59, 59, 999);

      if (targetDate < today || targetDate > maxForecastDate) {
        setData(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const geoRes = await axios.get(
          "https://geocoding-api.open-meteo.com/v1/search",
          {
            params: {
              name: grad,
              count: 1,
              format: "json",
            },
            signal: controller.signal,
          },
        );

        if (!geoRes.data.results?.length) {
          throw new Error(`Grad "${grad}" nije pronađen.`);
        }

        const { latitude, longitude } = geoRes.data.results[0];

        const weatherRes = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude,
              longitude,
              start_date: formattedDatum,
              end_date: formattedDatum,
              daily:
                "temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum",
              timezone: "auto",
            },
            signal: controller.signal,
          },
        );

        const daily = weatherRes.data?.daily;
        if (!daily || !daily.temperature_2m_max?.length) {
          throw new Error("Podaci za prognozu nisu dostupni.");
        }

        setData({
          grad,
          datum: formattedDatum,
          maxTemp: Math.round(daily.temperature_2m_max[0]),
          minTemp: Math.round(daily.temperature_2m_min[0]),
          kisaMm: daily.precipitation_sum[0],
          weatherCode: daily.weathercode[0],
        });
      } catch (err) {
        if (axios.isCancel(err)) return;

        console.error(
          "Greška pri preuzimanju prognoze:",
          err?.response?.data || err.message,
        );
        setError(err.message || "Greška pri preuzimanju prognoze");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [grad, datum]);

  return { data, loading, error };
}
