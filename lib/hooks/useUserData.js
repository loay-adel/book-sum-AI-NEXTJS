import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // تحميل بيانات المستخدم
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {

      const data = await api.getUserData();

      setUserData(data);
      setSearchHistory(data.searchHistory || []);
      setSavedSummaries(data.savedSummaries || []);
    } catch (err) {
      console.error('❌ Error loading user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // إضافة بحث جديد
  const addSearch = useCallback(async (query, results = null, success = true, responseTime = 0) => {
    try {
    
      const searchData = {
        query,
        resultsCount: results ? (results.recommendations ? results.recommendations.length : 0) : 0,
        bookTitle: results?.book?.title || null,
        success,
        responseTime
      };

      const response = await api.saveSearch(searchData);

      
      // تحديث الحالة المحلية
      const newSearch = {
        ...searchData,
        id: `search_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      setSearchHistory(prev => [newSearch, ...prev.slice(0, 49)]);
      setUserData(prev => prev ? {
        ...prev,
        searchHistory: [newSearch, ...prev.searchHistory.slice(0, 49)],
        activityStats: {
          ...prev.activityStats,
          totalSearches: (prev.activityStats.totalSearches || 0) + 1,
          lastActive: new Date().toISOString()
        }
      } : null);

    } catch (err) {
      console.error('❌ Error saving search:', err);
    }
  }, []);

  // حفظ ملخص
  const saveSummary = useCallback(async (bookData, summary, type = 'search', amazonLink = null, recommendations = []) => {
    try {
    
      
      const summaryData = {
        book: bookData,
        summary,
        type,
        amazonLink,
        recommendations
      };

      const response = await api.saveSummary(summaryData);
   
      
      // تحديث الحالة المحلية
      const newSummary = {
        ...summaryData,
        id: `summary_${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      setSavedSummaries(prev => {
        const existingIndex = prev.findIndex(s => s.book.title === bookData.title);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = newSummary;
          return updated;
        }
        return [newSummary, ...prev.slice(0, 99)];
      });

      setUserData(prev => prev ? {
        ...prev,
        savedSummaries: (() => {
          const existingIndex = prev.savedSummaries.findIndex(s => s.book.title === bookData.title);
          if (existingIndex !== -1) {
            const updated = [...prev.savedSummaries];
            updated[existingIndex] = newSummary;
            return updated;
          }
          return [newSummary, ...prev.savedSummaries.slice(0, 99)];
        })(),
        activityStats: {
          ...prev.activityStats,
          totalSummaries: (prev.activityStats.totalSummaries || 0) + 1,
          lastActive: new Date().toISOString()
        }
      } : null);

    } catch (err) {
      console.error('❌ Error saving summary:', err);
    }
  }, []);

  // حذف ملخص
  const deleteSummary = useCallback(async (summaryId) => {
    try {
      await api.deleteSummary(summaryId);
      
      // تحديث الحالة المحلية
      setSavedSummaries(prev => prev.filter(summary => summary.id !== summaryId));
      setUserData(prev => prev ? {
        ...prev,
        savedSummaries: prev.savedSummaries.filter(summary => summary.id !== summaryId),
        activityStats: {
          ...prev.activityStats,
          totalSummaries: Math.max(0, (prev.activityStats.totalSummaries || 0) - 1)
        }
      } : null);

    } catch (err) {
      console.error('Error deleting summary:', err);
      throw err;
    }
  }, []);

  // البحث في الملخصات المحفوظة
  const searchSummaries = useCallback((query) => {
    if (!query.trim()) return savedSummaries;
    
    const lowercaseQuery = query.toLowerCase();
    return savedSummaries.filter(summary => 
      summary.book.title.toLowerCase().includes(lowercaseQuery) ||
      summary.book.author?.toLowerCase().includes(lowercaseQuery) ||
      summary.summary.toLowerCase().includes(lowercaseQuery)
    );
  }, [savedSummaries]);

  // تحديث التفضيلات
  const updatePreferences = useCallback(async (preferences) => {
    try {
      await api.updatePreferences(preferences);
      
      // تحديث الحالة المحلية
      setUserData(prev => prev ? {
        ...prev,
        readingPreferences: { ...prev.readingPreferences, ...preferences },
        activityStats: {
          ...prev.activityStats,
          lastActive: new Date().toISOString()
        }
      } : null);

    } catch (err) {
      console.error('Error updating preferences:', err);
      throw err;
    }
  }, []);

  // تصدير البيانات
  const exportData = useCallback(async () => {
    try {
      await api.exportUserData();
    } catch (err) {
      console.error('Error exporting data:', err);
      throw err;
    }
  }, []);

  // مسح البيانات
  const clearData = useCallback(async () => {
    try {
      await api.clearUserData();
      
      // تحديث الحالة المحلية
      setSearchHistory([]);
      setSavedSummaries([]);
      setUserData(prev => prev ? {
        ...prev,
        searchHistory: [],
        savedSummaries: [],
        activityStats: {
          totalSearches: 0,
          totalSummaries: 0,
          lastActive: new Date().toISOString()
        }
      } : null);

    } catch (err) {
      console.error('Error clearing data:', err);
      throw err;
    }
  }, []);

  return {
    userData,
    searchHistory,
    savedSummaries,
    loading,
    error,
    addSearch,
    saveSummary,
    deleteSummary,
    searchSummaries,
    updatePreferences,
    exportData,
    clearData,
    refreshData: loadUserData
  };
};