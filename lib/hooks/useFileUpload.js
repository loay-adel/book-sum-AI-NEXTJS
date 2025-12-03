import { useState, useRef } from "react";
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
  const progressIntervalRef = useRef(null);

  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const updateProgress = (value, step = "") => {
    setProgress(Math.min(100, Math.max(0, value))); // Clamp between 0-100
    if (step) setCurrentStep(step);
  };

  const simulateProgress = (start, end, duration, steps) => {
    clearProgressInterval();
    
    let current = start;
    const increment = (end - start) / (duration / 100);
    
    progressIntervalRef.current = setInterval(() => {
      current += increment;
      if (current >= end) {
        updateProgress(end);
        clearProgressInterval();
      } else {
        updateProgress(Math.floor(current));
      }
    }, 100);
  };

  const uploadFile = async (file) => {
    // Reset state
    setResults(null);
    setError(null);
    setProgress(0);
    setCurrentStep("");
    clearProgressInterval();

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

    if (file.size === 0) {
      setError("File is empty");
      return;
    }

    setLoading(true);
    const startTime = performance.now();

    try {
      // Step 1: File preparation
      updateProgress(5, "Validating file...");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Start upload simulation
      updateProgress(15, "Preparing upload...");
      simulateProgress(15, 45, 2000, "Uploading file...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("lang", lang);

      // Step 3: Actual API call
      const data = await api.uploadPDF(formData);
      
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      clearProgressInterval();
      updateProgress(60, "Processing content...");

      // Step 4: Simulate processing
      simulateProgress(60, 85, 1500, "Analyzing content...");
      await new Promise(resolve => setTimeout(resolve, 1200));

      clearProgressInterval();
      updateProgress(90, "Finalizing...");

      // Step 5: Save to database if summary exists
      if (data.summary) {
        try {
          await saveSummary(
            {
              title: file.name.replace('.pdf', ''),
              author: "PDF Upload",
              thumbnail: "https://via.placeholder.com/128x192/374151/FFFFFF?text=PDF",
              pageCount: data.pageCount,
              textLength: data.textLength
            },
            data.summary,
            'upload',
            null,
            data.recommendations || []
          );
        } catch (saveError) {
          console.warn("Failed to save summary:", saveError);
          // Continue even if save fails
        }
      }

      // Step 6: Complete
      updateProgress(100, "Complete!");
      setResults(data);

      // Calculate and log response time
      const responseTime = performance.now() - startTime;
      console.log(`PDF processing completed in ${(responseTime / 1000).toFixed(2)}s`);

      // Auto-reset progress after success
      setTimeout(() => {
        setProgress(0);
        setCurrentStep("");
      }, 1500);

    } catch (err) {
      clearProgressInterval();
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to upload and process PDF";
      
      setError(errorMessage);
      updateProgress(0, "Upload failed");
      
      // Reset progress after error
      setTimeout(() => {
        setProgress(0);
        setCurrentStep("");
      }, 2000);
      
    } finally {
      setLoading(false);
      clearProgressInterval();
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
    setProgress(0);
    setCurrentStep("");
    clearProgressInterval();
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