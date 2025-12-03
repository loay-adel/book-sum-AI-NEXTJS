// نظام إحصائيات المسؤول
class AdminStatsManager {
  constructor() {
    this.initializeStats();
  }

  // تهيئة الإحصائيات
  initializeStats() {
    let stats = this.getStats();
    if (!stats) {
      stats = {
        visitors: {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          unique: new Set(),
          daily: {},
          byCountry: {},
          byDevice: {},
          byBrowser: {}
        },
        searches: {
          total: 0,
          today: 0,
          popular: {},
          byHour: {},
          byDay: {}
        },
        ads: {
          impressions: 0,
          clicks: 0,
          revenue: 0,
          ctr: 0,
          byPosition: {}
        },
        performance: {
          averageLoadTime: 0,
          successfulSearches: 0,
          failedSearches: 0,
          pdfUploads: 0,
          apiResponseTimes: []
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      this.saveStats(stats);
    }
  }

  // الحصول على الإحصائيات
  getStats() {
    try {
      const stats = localStorage.getItem('bookwise_admin_stats');
      return stats ? JSON.parse(stats) : null;
    } catch (error) {
      console.error('Error reading admin stats:', error);
      return null;
    }
  }

  // حفظ الإحصائيات
  saveStats(stats) {
    try {
      stats.lastUpdated = new Date().toISOString();
      
      // تحويل Set إلى Array للتخزين
      if (stats.visitors.unique && stats.visitors.unique instanceof Set) {
        stats.visitors.unique = Array.from(stats.visitors.unique);
      }
      
      localStorage.setItem('bookwise_admin_stats', JSON.stringify(stats));
      return true;
    } catch (error) {
      console.error('Error saving admin stats:', error);
      return false;
    }
  }

  // تحديث الإحصائيات
  updateStats(updates) {
    const currentStats = this.getStats();
    if (currentStats) {
      const updatedStats = this.deepMerge(currentStats, updates);
      return this.saveStats(updatedStats);
    }
    return false;
  }

  // دمج عميق للكائنات
  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  // تسجيل زائر جديد
  trackVisitor(visitorData = {}) {
    const stats = this.getStats();
    if (!stats) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const visitorId = visitorData.id || `visitor_${now.getTime()}`;

    // تحديث إحصائيات الزوار
    stats.visitors.total++;
    stats.visitors.today++;

    // إضافة زائر فريد
    if (!stats.visitors.unique.includes(visitorId)) {
      stats.visitors.unique.push(visitorId);
    }

    // تحديث الإحصائيات اليومية
    if (!stats.visitors.daily[today]) {
      stats.visitors.daily[today] = 0;
    }
    stats.visitors.daily[today]++;

    // تحديث الإحصائيات حسب الدولة
    const country = visitorData.country || 'Unknown';
    stats.visitors.byCountry[country] = (stats.visitors.byCountry[country] || 0) + 1;

    // تحديث الإحصائيات حسب الجهاز
    const device = visitorData.device || 'Unknown';
    stats.visitors.byDevice[device] = (stats.visitors.byDevice[device] || 0) + 1;

    // تحديث الإحصائيات حسب المتصفح
    const browser = visitorData.browser || 'Unknown';
    stats.visitors.byBrowser[browser] = (stats.visitors.byBrowser[browser] || 0) + 1;

    this.saveStats(stats);
  }

  // تسجيل عملية بحث
  trackSearch(searchQuery, success = true, responseTime = 0) {
    const stats = this.getStats();
    if (!stats) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours();

    // تحديث إحصائيات البحث
    stats.searches.total++;
    stats.searches.today++;

    if (success) {
      stats.performance.successfulSearches++;
    } else {
      stats.performance.failedSearches++;
    }

    // تحديث الكلمات الأكثر بحثاً
    const query = searchQuery.toLowerCase().trim();
    stats.searches.popular[query] = (stats.searches.popular[query] || 0) + 1;

    // تحديث البحث حسب الساعة
    stats.searches.byHour[hour] = (stats.searches.byHour[hour] || 0) + 1;

    // تحديث البحث حسب اليوم
    const dayName = now.toLocaleDateString('en', { weekday: 'long' });
    stats.searches.byDay[dayName] = (stats.searches.byDay[dayName] || 0) + 1;

    // تحديث وقت الاستجابة
    stats.performance.apiResponseTimes.push(responseTime);
    if (stats.performance.apiResponseTimes.length > 100) {
      stats.performance.apiResponseTimes.shift();
    }
    
    // حساب متوسط وقت الاستجابة
    const avgResponseTime = stats.performance.apiResponseTimes.reduce((a, b) => a + b, 0) / 
                           stats.performance.apiResponseTimes.length;
    stats.performance.averageLoadTime = avgResponseTime;

    this.saveStats(stats);
  }

  // تسجيل رفع ملف PDF
  trackPDFUpload(success = true) {
    const stats = this.getStats();
    if (!stats) return;

    if (success) {
      stats.performance.pdfUploads++;
    }

    this.saveStats(stats);
  }

  // تسجيل ظهور إعلان
  trackAdImpression(adPosition, revenue = 0) {
    const stats = this.getStats();
    if (!stats) return;

    stats.ads.impressions++;
    stats.ads.revenue += revenue;

    // تحديث الإحصائيات حسب الموضع
    stats.ads.byPosition[adPosition] = stats.ads.byPosition[adPosition] || {
      impressions: 0,
      clicks: 0,
      revenue: 0
    };
    stats.ads.byPosition[adPosition].impressions++;
    stats.ads.byPosition[adPosition].revenue += revenue;

    this.saveStats(stats);
  }

  // تسجيل نقرة على إعلان
  trackAdClick(adPosition) {
    const stats = this.getStats();
    if (!stats) return;

    stats.ads.clicks++;
    stats.ads.ctr = (stats.ads.clicks / stats.ads.impressions) * 100;

    // تحديث الإحصائيات حسب الموضع
    if (stats.ads.byPosition[adPosition]) {
      stats.ads.byPosition[adPosition].clicks++;
    }

    this.saveStats(stats);
  }

  // الحصول على الكلمات الأكثر بحثاً
  getPopularSearches(limit = 10) {
    const stats = this.getStats();
    if (!stats || !stats.searches.popular) return [];

    return Object.entries(stats.searches.popular)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  // الحصول على إحصائيات الأداء
  getPerformanceStats() {
    const stats = this.getStats();
    if (!stats) return null;

    return {
      averageLoadTime: stats.performance.averageLoadTime,
      successfulSearches: stats.performance.successfulSearches,
      failedSearches: stats.performance.failedSearches,
      pdfUploads: stats.performance.pdfUploads,
      successRate: (stats.performance.successfulSearches / 
                   (stats.performance.successfulSearches + stats.performance.failedSearches)) * 100
    };
  }

  // الحصول على إحصائيات الزوار
  getVisitorStats() {
    const stats = this.getStats();
    if (!stats) return null;

    return {
      total: stats.visitors.total,
      today: stats.visitors.today,
      unique: stats.visitors.unique.length,
      byCountry: stats.visitors.byCountry,
      byDevice: stats.visitors.byDevice,
      byBrowser: stats.visitors.byBrowser
    };
  }

  // الحصول على إحصائيات الإعلانات
  getAdStats() {
    const stats = this.getStats();
    if (!stats) return null;

    return {
      impressions: stats.ads.impressions,
      clicks: stats.ads.clicks,
      revenue: stats.ads.revenue,
      ctr: stats.ads.ctr,
      byPosition: stats.ads.byPosition
    };
  }

  // إعادة تعيين الإحصائيات اليومية
  resetDailyStats() {
    const stats = this.getStats();
    if (stats) {
      stats.visitors.today = 0;
      stats.searches.today = 0;
      this.saveStats(stats);
    }
  }

  // تصدير جميع الإحصائيات
  exportAllStats() {
    const stats = this.getStats();
    return stats ? JSON.stringify(stats, null, 2) : null;
  }

  // مسح جميع الإحصائيات
  clearAllStats() {
    try {
      localStorage.removeItem('bookwise_admin_stats');
      this.initializeStats();
      return true;
    } catch (error) {
      console.error('Error clearing admin stats:', error);
      return false;
    }
  }
}

// إنشاء نسخة واحدة من المدير
export const adminStatsManager = new AdminStatsManager();