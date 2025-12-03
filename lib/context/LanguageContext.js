"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Only access localStorage on client side
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    if (isMounted) {
      localStorage.setItem("preferred-language", newLang);
      // Also update the html lang attribute
      document.documentElement.lang = newLang;
    }
  };

  // Sync html lang attribute when language changes
  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = lang;
    }
  }, [lang, isMounted]);

  return (
    <LanguageContext.Provider value={{ 
      lang: isMounted ? lang : "en",
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};