import { useState } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";
import { useUserData } from "./useUserData";

export const useFileUpload = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { lang } = useLanguage();
  const { saveSummary } = useUserData();

  const updateProgress = (value, step = "") => {
    setProgress(value);
    if (step) setCurrentStep(step);
  };

  const uploadFile = async (file) => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep("Starting upload...");

    const startTime = performance.now();
    let progressInterval;

    try {
      // Step 1: File preparation (quick)
      updateProgress(10, "Preparing file...");
      await new Promise(resolve => setTimeout(resolve, 300));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("lang", lang);

      // Start realistic progress simulation
      let simulatedProgress = 10;
      progressInterval = setInterval(() => {
        simulatedProgress += Math.random() * 3 + 2; // 2-5% per interval
        if (simulatedProgress < 70) {
          updateProgress(
            Math.min(simulatedProgress, 70),
            simulatedProgress < 40 ? "Uploading file..." :
            simulatedProgress < 60 ? "Processing PDF..." :
            "Extracting text..."
          );
        }
      }, 400);

      // Step 2: Actual upload
      updateProgress(30, "Uploading to server...");

      const data = await api.uploadPDF(formData);
      
      // Clear the simulation interval
      if (progressInterval) clearInterval(progressInterval);
      
      // Step 3: Processing content
      updateProgress(75, "Analyzing content...");
      await new Promise(resolve => setTimeout(resolve, 1200));

      setResults(data);

      // Step 4: AI processing
      updateProgress(85, "Generating AI summary...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Recommendations
      updateProgress(92, "Creating recommendations...");
      await new Promise(resolve => setTimeout(resolve, 600));

      // حساب وقت الاستجابة
      const responseTime = performance.now() - startTime;

      // Step 6: Saving to database
      updateProgress(97, "Saving summary...");

      if (data.summary) {
        await saveSummary(
          {
            title: file.name.replace('.pdf', ''),
            author: "PDF Upload",
            thumbnail: "https://via.placeholder.com/128x192/374151/FFFFFF?text=PDF"
          },
          data.summary,
          'upload',
          null,
          data.recommendations || []
        );
      }

      // Step 7: Complete
      updateProgress(100, "Upload complete!");
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      // Clear interval on error
      if (progressInterval) clearInterval(progressInterval);
      
      setError(err.message || "Failed to upload and process PDF");
      updateProgress(0, "Upload failed");
      
    } finally {
      setLoading(false);
      // Clear any remaining intervals
      if (progressInterval) clearInterval(progressInterval);
      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0);
        setCurrentStep("");
      }, 1000);
    }
  };

  // Reset function to clear everything
  const reset = () => {
    setResults(null);
    setError(null);
    setProgress(0);
    setCurrentStep("");
  };

  return {
    results,
    loading,
    error,
    progress,
    currentStep,
    uploadFile,
    reset
  };
};