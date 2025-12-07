// lib/hooks/useFileUpload.js
import { useState, useRef } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";

export const useFileUpload = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  const uploadFile = async (file) => {
    // Reset state
    setResults(null);
    setError(null);

    // Validation
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setLoading(true);

    try {
      const data = await api.uploadPDF(file);
      
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setResults(data);
      
    } catch (err) {
      const errorMessage = err.message || "Failed to upload and process PDF";
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    uploadFile,
    reset
  };
};