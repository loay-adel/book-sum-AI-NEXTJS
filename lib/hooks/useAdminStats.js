import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [popularSearches, setPopularSearches] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [ads, setAds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check authentication using secure method
      if (!api.isAdminAuthenticated()) {
        throw new Error('Please login to access admin dashboard');
      }

      const [
        statsData,
        popularData,
        visitorsData,
        adsData,
        performanceData
      ] = await Promise.all([
        api.getAdminStats(),
        api.getPopularSearches(10),
        api.getVisitorStats(),
        api.getAdStats(),
        api.getPerformanceStats()
      ]);

      setStats(statsData);
      setPopularSearches(popularData);
      setVisitors(visitorsData);
      setAds(adsData);
      setPerformance(performanceData);
    } catch (err) {
      setError(err.message);
      
      // Clear session on auth errors
      if (err.message.includes('Authentication') || 
          err.message.includes('token') || 
          err.message.includes('login')) {
        api.adminLogout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (api.isAdminAuthenticated()) {
      loadStats();
    }
  }, [loadStats]);

  // Empty tracking functions for future implementation
  const trackVisitor = useCallback(async (visitorData = {}) => {
    // Visitor tracking logic can be added here later
  }, []);

  const trackSearch = useCallback(async (query, success = true, responseTime = 0) => {
    // Search tracking logic can be added here later
  }, []);

  const trackPDFUpload = useCallback(async (success = true) => {
    // PDF upload tracking logic can be added here later
  }, []);

  const trackAdImpression = useCallback(async (adPosition, revenue = 0) => {
    // Ad impression tracking logic can be added here later
  }, []);

  const trackAdClick = useCallback(async (adPosition) => {
    // Ad click tracking logic can be added here later
  }, []);

  const resetDailyStats = useCallback(async () => {
    try {
      await loadStats(); 
    } catch (err) {
      throw err;
    }
  }, [loadStats]);

  const exportStats = useCallback(async () => {
    try {
      await api.exportAdminStats();
    } catch (err) {
      throw err;
    }
  }, []);

  const clearStats = useCallback(async () => {
    try {
      await api.clearAdminStats();
      await loadStats(); 
    } catch (err) {
      throw err;
    }
  }, [loadStats]);

  return {
    stats,
    popularSearches,
    performance,
    visitors,
    ads,
    loading,
    error,
    trackVisitor,
    trackSearch,
    trackPDFUpload,
    trackAdImpression,
    trackAdClick,
    resetDailyStats,
    exportStats,
    clearStats,
    refreshStats: loadStats
  };
};