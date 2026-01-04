import { useState } from "react";
import { api } from "../api";
import { useUserData } from "./useUserData";

export const useBookSearch = (lang = "en") => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const { addSearch, saveBook } = useUserData(); // Changed from saveSummary to saveBook

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

      // Calculate response time
      const responseTime = performance.now() - startTime;

      // Step 5: Saving to user data (quick)
      updateProgress(98, "Saving to library...");

      // Save search to user data
    await addSearch(bookName, data, {
      success: true,
      responseTime: responseTime,
      source: 'search'
    });
      
      // Save book if we have book data
    if (data.book && data.book.title) {
      await saveBook({
        ...data.book,
        summary: data.summary,
        amazonLink: data.amazonLink,
        recommendations: data.recommendations || []
      });
      
      // Trigger async blog save
      triggerAsyncBlogSave(data, 'search', responseTime);
    }

      // Step 6: Complete
      updateProgress(100, "Complete!");
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      // Clear interval on error
      if (progressInterval) clearInterval(progressInterval);
      
      setError(err.message || "Failed to search for book");
      updateProgress(0, "Search failed");
      
      // Calculate response time even on failure
      const responseTime = performance.now() - startTime;
      
      // Save failed search
      await addSearch(bookName, null, {
        success: false,
        responseTime: responseTime,
        error: err.message,
        source: 'search'
      });
      
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

  const triggerAsyncBlogSave = async (data, type = 'search', responseTime = 0) => {
    try {
      if (!data?.book || !data?.summary) {
        console.log('Missing data for blog save');
        return;
      }

      const blogData = {
        title: `${data.book.title} Summary`,
        content: `AI-generated summary for "${data.book.title}" by ${data.book.author || 'Unknown Author'}`,
        aiResponse: data.summary,
        bookDetails: {
          title: data.book.title,
          author: data.book.author || 'Unknown',
          thumbnail: data.book.thumbnail || null
        },
        tags: ['AI Summary', 'Book Summary', data.book.genre || 'General'],
        category: 'AI Generated Summaries',
        language: lang,
        isPublished: true,
        featured: false,
        responseTime: responseTime
      };

      // Fire and forget - don't wait for response
      const savePromise = type === 'search' 
        ? api.saveAISummaryAsBlog(blogData)
        : api.savePDFSummaryAsBlog({
            ...blogData,
            generationType: 'pdf_summary'
          });
      
    } catch (error) {
      console.log('⚠️ Error triggering blog save:', error.message);
      // Silently fail - this shouldn't affect user experience
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