import { useState, useEffect } from "react";
import axios from "axios";

export const useExchangeRates = () => {
  const [rates, setRates] = useState({ RSD: 1 });
  const [selectedCurrency, setSelectedCurrency] = useState("RSD");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/RSD",
        );
        setRates(res.data.rates);
      } catch (error) {
        console.error("Greška pri preuzimanju kursne liste", error);
      }
    };
    fetchRates();
  }, []);

  return { rates, selectedCurrency, setSelectedCurrency };
};
