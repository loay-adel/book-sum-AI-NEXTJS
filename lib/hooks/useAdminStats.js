import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [popularSearches, setPopularSearches] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [ads, setAds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);


  const checkAuth = useCallback(async () => {
    try {
      const isLocallyLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
      const username = localStorage.getItem('admin_username');
      
      if (!isLocallyLoggedIn || !username) {
        return false;
      }

      return await api.isAdminAuthenticated();
    } catch (err) {
      console.error('Auth check error:', err);
      return false;
    }
  }, []);

  const loadStats = useCallback(async (forceAuthCheck = false) => {
    if (forceAuthCheck || !authChecked) {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        setError('Please login to access admin dashboard');
        setLoading(false);
        return false;
      }
      setAuthChecked(true);
    }

    setLoading(true);
    setError(null);
    
    try {
      let statsData = null;
      let popularData = [];
      let visitorsData = { total: 0, today: 0, unique: 0 };
      let adsData = { impressions: 0, clicks: 0, revenue: 0, ctr: 0 };
      let performanceData = { 
        averageLoadTime: 0, 
        successfulSearches: 0, 
        failedSearches: 0,
        pdfUploads: 0,
        successRate: 0 
      };

      try {
        statsData = await api.getAdminStats();
      } catch (err) {
        console.warn('⚠️ Stats data unavailable, using defaults');
        statsData = {
          totalUsers: 0,
          totalBlogs: 0,
          totalLikes: 0,
          totalComments: 0
        };
      }

      try {
        popularData = await api.getPopularSearches(10);
        if (!Array.isArray(popularData)) {
          popularData = [];
        }
      } catch (err) {
        console.warn('⚠️ Popular searches unavailable');
      }

      try {
        visitorsData = await api.getVisitorStats();
        if (!visitorsData) {
          visitorsData = { total: 0, today: 0, unique: 0 };
        }
      } catch (err) {
        console.warn('⚠️ Visitor stats unavailable');
      }

      try {
        adsData = await api.getAdStats();
        if (!adsData) {
          adsData = { impressions: 0, clicks: 0, revenue: 0, ctr: 0 };
        }
      } catch (err) {
        console.warn('⚠️ Ad stats unavailable');
      }

      try {
        performanceData = await api.getPerformanceStats();
        if (!performanceData) {
          performanceData = { 
            averageLoadTime: 0, 
            successfulSearches: 0, 
            failedSearches: 0,
            pdfUploads: 0,
            successRate: 0 
          };
        }
        
        if (!performanceData.successRate && performanceData.successfulSearches) {
          const total = (performanceData.successfulSearches || 0) + (performanceData.failedSearches || 0);
          performanceData.successRate = total > 0 
            ? ((performanceData.successfulSearches / total) * 100) 
            : 0;
        }
      } catch (err) {
        console.warn('⚠️ Performance stats unavailable');
      }

      setStats(statsData);
      setPopularSearches(popularData);
      setVisitors(visitorsData);
      setAds(adsData);
      setPerformance(performanceData);
      
      return true;
    } catch (err) {
      console.error('🔴 Fatal error in loadStats:', err);
      
      if (err.message && (
        err.message.includes('Authentication') || 
        err.message.includes('401') ||
        err.message.includes('403') ||
        err.message.includes('Session') ||
        err.message.includes('Unauthorized')
      )) {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_username');
        setError('Your session has expired. Please login again.');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to load statistics. Please try again.');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [authChecked, checkAuth]);

  useEffect(() => {
    let mounted = true;
    
    const initStats = async () => {
      if (!mounted) return;
      
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        setAuthChecked(true);
        await loadStats();
      } else if (mounted) {
        setError('Please login to access admin dashboard');
      }
    };
    
    initStats();
    
    return () => {
      mounted = false;
    };
  }, [checkAuth, loadStats]);

  const refreshStats = useCallback(async () => {
    return await loadStats(true);
  }, [loadStats]);

  const resetDailyStats = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!(await checkAuth())) {
        throw new Error('Authentication required');
      }
      
      await loadStats();
      
      return { success: true, message: 'Daily stats reset successfully' };
    } catch (err) {
      console.error('Reset daily stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth, loadStats]);

  const exportStats = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!(await checkAuth())) {
        throw new Error('Authentication required');
      }
      const blob = await api.exportAdminStats();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-stats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, message: 'Export completed successfully' };
    } catch (err) {
      console.error('Export stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const clearStats = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!(await checkAuth())) {
        throw new Error('Authentication required');
      }

      if (!window.confirm('Are you sure you want to clear all statistics? This action cannot be undone.')) {
        return { success: false, message: 'Operation cancelled' };
      }

      await api.clearAdminStats();

      await loadStats();
      
      return { success: true, message: 'All statistics cleared successfully' };
    } catch (err) {
      console.error('Clear stats error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [checkAuth, loadStats]);

  return {
    // البيانات
    stats,
    popularSearches,
    performance,
    visitors,
    ads,
    
    // حالة التحميل والأخطاء
    loading,
    error,
    authChecked,
    
    // دوال المصادقة والتحديث
    checkAuth,
    refreshStats,
    
    // دوال الإدارة
    resetDailyStats,
    exportStats,
    clearStats,
    
    // دالة تحميل الإحصائيات (للاستخدام الداخلي)
    loadStats
  };
};

// نسخة مبسطة للاستخدام في المكونات الصغيرة
export const useAdminStatsSimple = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // تحقق من المصادقة
        const isAuthenticated = await api.isAdminAuthenticated();
        if (!isAuthenticated) {
          if (mounted) {
            setError('Please login to access dashboard');
            setLoading(false);
          }
          return;
        }

        // جلب البيانات الأساسية فقط
        const data = await api.getAdminStats();
        if (mounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        if (mounted) {
          setError(err.message || 'Failed to load statistics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    
    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, error };
};