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

  // تحميل الإحصائيات
  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
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
      console.error('Error loading admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // تسجيل زائر
  const trackVisitor = useCallback(async (visitorData = {}) => {
    // سيتم التعامل مع هذا في الـ backend
    // يمكن إضافة API منفصل لتسجيل الزوار إذا لزم الأمر
    console.log('Visitor tracked:', visitorData);
  }, []);

  // تسجيل بحث
  const trackSearch = useCallback(async (query, success = true, responseTime = 0) => {
    // سيتم التعامل مع هذا في الـ backend عبر APIs المستخدم
    console.log('Search tracked:', { query, success, responseTime });
  }, []);

  // تسجيل رفع PDF
  const trackPDFUpload = useCallback(async (success = true) => {
    // سيتم التعامل مع هذا في الـ backend
    console.log('PDF upload tracked:', success);
  }, []);

  // تسجيل ظهور إعلان
  const trackAdImpression = useCallback(async (adPosition, revenue = 0) => {
    // سيتم التعامل مع هذا في الـ backend
    console.log('Ad impression tracked:', { adPosition, revenue });
  }, []);

  // تسجيل نقرة إعلان
  const trackAdClick = useCallback(async (adPosition) => {
    // سيتم التعامل مع هذا في الـ backend
    console.log('Ad click tracked:', adPosition);
  }, []);

  // إعادة تعيين الإحصائيات اليومية
  const resetDailyStats = useCallback(async () => {
    try {
      // يمكن إضافة API منفصل لإعادة التعيين إذا لزم الأمر
      await loadStats(); // إعادة تحميل للإشارة إلى التحديث
    } catch (err) {
      console.error('Error resetting daily stats:', err);
      throw err;
    }
  }, [loadStats]);

  // تصدير الإحصائيات
  const exportStats = useCallback(async () => {
    try {
      await api.exportAdminStats();
    } catch (err) {
      console.error('Error exporting stats:', err);
      throw err;
    }
  }, []);

  // مسح جميع الإحصائيات
  const clearStats = useCallback(async () => {
    try {
      await api.clearAdminStats();
      await loadStats(); // إعادة تحميل البيانات
    } catch (err) {
      console.error('Error clearing stats:', err);
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