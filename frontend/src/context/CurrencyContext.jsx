import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

const RATES = {
  INR: { symbol: "₹", rate: 1, name: "INR (₹)" },
  USD: { symbol: "$", rate: 0.012, name: "USD ($)" },
  EUR: { symbol: "€", rate: 0.011, name: "EUR (€)" },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("app_currency") || "INR";
  });

  useEffect(() => {
    localStorage.setItem("app_currency", currency);
  }, [currency]);

  const changeCurrency = (code) => {
    if (RATES[code]) {
      setCurrency(code);
    }
  };

  const formatPrice = (priceInINR) => {
    const numeric = Number(priceInINR) || 0;
    const current = RATES[currency] || RATES.INR;
    const converted = numeric * current.rate;

    if (currency === "INR") {
      return `₹${Math.round(converted).toLocaleString("en-IN")}`;
    } else if (currency === "USD") {
      return `$${converted.toFixed(2)}`;
    } else if (currency === "EUR") {
      return `€${converted.toFixed(2)}`;
    }
    return `₹${Math.round(converted)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        formatPrice,
        symbol: RATES[currency]?.symbol || "₹",
        currencies: RATES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
