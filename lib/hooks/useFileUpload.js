import { useState } from "react";
import { api } from "../api";

export const useFileUpload = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await api.uploadPDF(formData);
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to upload and summarize file");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, uploadFile };
};
