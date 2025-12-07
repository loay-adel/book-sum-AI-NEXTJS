import { useState, useEffect, useCallback } from 'react';
// REMOVE: import { api } from '../api';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = useCallback(() => {
    setLoading(true);
    try {
      // Get from localStorage
      const storedData = localStorage.getItem('bookwise_user_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setUserData(data);
        setSearchHistory(data.searchHistory || []);
        setSavedSummaries(data.savedSummaries || []);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback((data) => {
    try {
      localStorage.setItem('bookwise_user_data', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, []);

  // Simple add search (local only)
  const addSearch = useCallback((query, results = null) => {
    const newSearch = {
      id: `search_${Date.now()}`,
      query,
      resultsCount: results ? (results.recommendations ? results.recommendations.length : 0) : 0,
      bookTitle: results?.book?.title || null,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newSearch, ...searchHistory.slice(0, 49)];
    setSearchHistory(updatedHistory);
    
    const updatedData = {
      ...userData,
      searchHistory: updatedHistory,
      lastActive: new Date().toISOString()
    };
    
    setUserData(updatedData);
    saveToLocalStorage(updatedData);
  }, [userData, searchHistory, saveToLocalStorage]);

  // Simple save summary (local only)
  const saveSummary = useCallback((bookData, summary) => {
    const newSummary = {
      id: `summary_${Date.now()}`,
      book: bookData,
      summary,
      timestamp: new Date().toISOString()
    };
    
    // Check for duplicates
    const existingIndex = savedSummaries.findIndex(
      s => s.book.title === bookData.title
    );
    
    let updatedSummaries;
    if (existingIndex !== -1) {
      updatedSummaries = [...savedSummaries];
      updatedSummaries[existingIndex] = newSummary;
    } else {
      updatedSummaries = [newSummary, ...savedSummaries.slice(0, 99)];
    }
    
    setSavedSummaries(updatedSummaries);
    
    const updatedData = {
      ...userData,
      savedSummaries: updatedSummaries,
      lastActive: new Date().toISOString()
    };
    
    setUserData(updatedData);
    saveToLocalStorage(updatedData);
  }, [userData, savedSummaries, saveToLocalStorage]);

  // Delete summary (local only)
  const deleteSummary = useCallback((summaryId) => {
    const updatedSummaries = savedSummaries.filter(
      summary => summary.id !== summaryId
    );
    
    setSavedSummaries(updatedSummaries);
    
    const updatedData = {
      ...userData,
      savedSummaries: updatedSummaries
    };
    
    setUserData(updatedData);
    saveToLocalStorage(updatedData);
  }, [userData, savedSummaries, saveToLocalStorage]);

  return {
    userData,
    searchHistory,
    savedSummaries,
    loading,
    error,
    addSearch,
    saveSummary,
    deleteSummary
  };
};