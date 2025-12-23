// /lib/hooks/useAdminStats.js - النسخة المحدثة
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

  // دالة مصادقة محسنة
const checkAuth = useCallback(async () => {
  try {
    // تحقق أولاً من localStorage
    if (localStorage.getItem('admin_logged_in') !== 'true') {
      return false;
    }

    try {

      await api.getAdminStats();

      return true;
    } catch (serverError) {
  
      
      // إذا كان الخطأ 401/403، نظف الجلسة
      if (serverError.message.includes('401') || 
          serverError.message.includes('403') ||
          serverError.message.includes('Authentication')) {
        
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_username');
      }
      
      return false;
    }
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
      return false;
    }
    setAuthChecked(true);
  }

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
      api.getAdminStats().catch(err => {
        console.error('❌ Error fetching stats:', err.message);
        return null;
      }),
      api.getPopularSearches(10).catch(err => {
        console.error('❌ Error fetching popular searches:', err.message);
        return [];
      }),
      api.getVisitorStats().catch(err => {
        console.error('❌ Error fetching visitor stats:', err.message);
        return { total: 0, today: 0, unique: 0 };
      }),
      api.getAdStats().catch(err => {
        console.error('❌ Error fetching ad stats:', err.message);
        return { impressions: 0, clicks: 0, revenue: 0, ctr: 0 };
      }),
      api.getPerformanceStats().catch(err => {
        console.error('❌ Error fetching performance stats:', err.message);
        return { 
          averageLoadTime: 0, 
          successfulSearches: 0, 
          failedSearches: 0,
          pdfUploads: 0,
          successRate: 0 
        };
      })
    ]);




    // تحديث البيانات
    setStats(statsData);
    setPopularSearches(popularData);
    setVisitors(visitorsData);
    setAds(adsData);
    setPerformance(performanceData);
    
    return true;
  } catch (err) {
    console.error('🔴 Stats loading error:', err);
    
    // معالجة الأخطاء المحددة
    if (err.message.includes('Authentication') || 
        err.message.includes('token') || 
        err.message.includes('401') ||
        err.message.includes('403') ||
        err.message.includes('Session')) {
      setError('Session expired. Please login again.');
      
      // مسح التوكن
      document.cookie = 'admin_token=; Max-Age=0; path=/;';
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token_expiry');
      localStorage.removeItem('admin_username');
    } else {
      setError(err.message || 'Failed to load statistics');
    }
    return false;
  } finally {
    setLoading(false);
  }
}, [authChecked, checkAuth]);

  // التهيئة عند التحميل
  useEffect(() => {
    const initStats = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        setAuthChecked(true);
        await loadStats();
      }
    };
    
    initStats();
  }, [checkAuth, loadStats]);

  // دالة تحميل الإحصائيات الخارجية
  const refreshStats = useCallback(async () => {
    return await loadStats(true);
  }, [loadStats]);

  // دالة إعادة تعيين الإحصائيات اليومية
  const resetDailyStats = useCallback(async () => {
    try {
      if (!(await checkAuth())) {
        throw new Error('Authentication required');
      }
      

      await loadStats();
      return { success: true, message: 'Daily stats reset successfully' };
    } catch (err) {
      console.error('Reset daily stats error:', err);
      throw err;
    }
  }, [checkAuth, loadStats]);

  // دالة تصدير الإحصائيات
  const exportStats = useCallback(async () => {
    try {
      if (!(await checkAuth())) {
        throw new Error('Authentication required');
      }
      
      await api.exportAdminStats();
      return { success: true, message: 'Export started successfully' };
    } catch (err) {
      console.error('Export stats error:', err);
      throw err;
    }
  }, [checkAuth]);

  // دالة مسح جميع الإحصائيات
  const clearStats = useCallback(async () => {
    try {
      if (!(await checkAuth())) {
        throw new Error('Authentication required');
      }
      
      await api.clearAdminStats();
      await loadStats(); // إعادة تحميل الإحصائيات بعد المسح
      return { success: true, message: 'All statistics cleared successfully' };
    } catch (err) {
      console.error('Clear stats error:', err);
      throw err;
    }
  }, [checkAuth, loadStats]);




  // إرجاع جميع الدوال والقيم
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
    
    // دوال مساعدة
    loadStats // للاستخدام الداخلي
  };
};

// إصدار مبسط للاستخدام الفوري
export const useAdminStatsSimple = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // تحقق من المصادقة أولاً
        if (!api.isAdminAuthenticated()) {
          setError('Please login to access dashboard');
          return;
        }

        // جلب البيانات
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};