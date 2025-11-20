import { useState } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";
import { useUserData } from "./useUserData";

export const useBookSearch = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { lang } = useLanguage();
  const { addSearch, saveSummary } = useUserData();

  const updateProgress = (value, step = "") => {
    setProgress(value);
    if (step) setCurrentStep(step);
  };

  const searchBook = async (bookName) => {
    if (!bookName.trim()) {
      setError("Please enter a book name");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStep("Starting search...");
    
    const startTime = performance.now();
    let progressInterval;

    try {
      // Step 1: Initial setup (quick)
      updateProgress(5, "Preparing search...");
      await new Promise(resolve => setTimeout(resolve, 200));

      // Start realistic progress simulation
      let simulatedProgress = 5;
      progressInterval = setInterval(() => {
        simulatedProgress += Math.random() * 2 + 1; // 1-3% per interval
        if (simulatedProgress < 85) {
          updateProgress(
            Math.min(simulatedProgress, 85),
            simulatedProgress < 30 ? "Searching for book..." :
            simulatedProgress < 60 ? "Fetching book details..." :
            "Processing information..."
          );
        }
      }, 300);

      // Step 2: Actual API call
      updateProgress(25, "Making API request...");
      
      const data = await api.getBookSummary(bookName, lang);
      
      // Clear the simulation interval
      if (progressInterval) clearInterval(progressInterval);
      
      // Step 3: Processing results (quick)
      updateProgress(90, "Generating summary...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setResults(data);

      // Step 4: Final processing
      updateProgress(95, "Creating recommendations...");
      await new Promise(resolve => setTimeout(resolve, 400));

      // حساب وقت الاستجابة
      const responseTime = performance.now() - startTime;

      // Step 5: Saving to database (quick)
      updateProgress(98, "Saving to library...");

      // حفظ البحث والملخص في قاعدة البيانات
      await addSearch(bookName, data, true, responseTime);
      
      if (data.summary && data.book) {
        await saveSummary(
          data.book, 
          data.summary, 
          'search', 
          data.amazonLink, 
          data.recommendations || []
        );
      }

      // Step 6: Complete
      updateProgress(100, "Complete!");
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      // Clear interval on error
      if (progressInterval) clearInterval(progressInterval);
      
      setError(err.message || "Failed to search for book");
      updateProgress(0, "Search failed");
      
      // حساب وقت الاستجابة حتى في حالة الفشل
      const responseTime = performance.now() - startTime;
      
      // حفظ البحث الفاشل
      await addSearch(bookName, null, false, responseTime);
      
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
    searchBook,
    reset 
  };
};