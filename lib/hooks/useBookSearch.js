import { useState } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";

export const useBookSearch = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  const searchBook = async (bookName) => {
    if (!bookName.trim()) {
      setError("Please enter a book name");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.getBookSummary(bookName, lang);
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to search for book");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchBook };
};
