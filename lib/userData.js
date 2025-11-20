// نظام حفظ بيانات المستخدمين
class UserDataManager {
  constructor() {
    this.userId = this.getOrCreateUserId();
    this.initializeUserData();
  }

  // إنشاء أو استرجاع معرف المستخدم
  getOrCreateUserId() {
    let userId = localStorage.getItem('bookwise_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('bookwise_user_id', userId);
    }
    return userId;
  }

  // تهيئة بيانات المستخدم
  initializeUserData() {
    const userData = this.getUserData();
    if (!userData) {
      const initialData = {
        userId: this.userId,
        searchHistory: [],
        savedSummaries: [],
        readingPreferences: {
          favoriteCategories: [],
          preferredLanguages: ['en', 'ar'],
          readingLevel: 'intermediate'
        },
        activityStats: {
          totalSearches: 0,
          totalSummaries: 0,
          lastActive: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.saveUserData(initialData);
    }
  }

  // الحصول على بيانات المستخدم
  getUserData() {
    try {
      const data = localStorage.getItem(`bookwise_user_${this.userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user data:', error);
      return null;
    }
  }

  // حفظ بيانات المستخدم
  saveUserData(data) {
    try {
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(`bookwise_user_${this.userId}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  // تحديث بيانات المستخدم
  updateUserData(updates) {
    const currentData = this.getUserData();
    if (currentData) {
      const updatedData = { ...currentData, ...updates };
      return this.saveUserData(updatedData);
    }
    return false;
  }

  // إضافة بحث إلى السجل
  addToSearchHistory(searchQuery, results = null) {
    const userData = this.getUserData();
    if (userData) {
      const searchEntry = {
        id: 'search_' + Date.now(),
        query: searchQuery,
        timestamp: new Date().toISOString(),
        resultsCount: results ? (results.recommendations ? results.recommendations.length : 0) : 0,
        bookTitle: results?.book?.title || null
      };

      // إضافة البحث الجديد في البداية
      userData.searchHistory.unshift(searchEntry);
      
      // الاحتفاظ بآخر 50 بحث فقط
      userData.searchHistory = userData.searchHistory.slice(0, 50);
      
      // تحديث الإحصائيات
      userData.activityStats.totalSearches++;
      userData.activityStats.lastActive = new Date().toISOString();

      return this.saveUserData(userData);
    }
    return false;
  }

  // حفظ الملخص
  saveSummary(bookData, summary, type = 'search') {
    const userData = this.getUserData();
    if (userData) {
      const summaryEntry = {
        id: 'summary_' + Date.now(),
        book: {
          title: bookData.title,
          author: bookData.author,
          thumbnail: bookData.thumbnail,
          pageCount: bookData.pageCount
        },
        summary: summary,
        type: type, // 'search' أو 'upload'
        timestamp: new Date().toISOString(),
        amazonLink: bookData.amazonLink,
        recommendations: bookData.recommendations || []
      };

      // التحقق من عدم وجود نسخة مكررة
      const existingIndex = userData.savedSummaries.findIndex(
        s => s.book.title === bookData.title
      );

      if (existingIndex !== -1) {
        // تحديث الملخص الموجود
        userData.savedSummaries[existingIndex] = summaryEntry;
      } else {
        // إضافة ملخص جديد
        userData.savedSummaries.unshift(summaryEntry);
      }

      // الاحتفاظ بآخر 100 ملخص فقط
      userData.savedSummaries = userData.savedSummaries.slice(0, 100);
      
      // تحديث الإحصائيات
      userData.activityStats.totalSummaries++;
      userData.activityStats.lastActive = new Date().toISOString();

      return this.saveUserData(userData);
    }
    return false;
  }

  // الحصول على سجل البحث
  getSearchHistory(limit = 10) {
    const userData = this.getUserData();
    return userData ? userData.searchHistory.slice(0, limit) : [];
  }

  // الحصول على الملخصات المحفوظة
  getSavedSummaries(limit = 10) {
    const userData = this.getUserData();
    return userData ? userData.savedSummaries.slice(0, limit) : [];
  }

  // البحث في الملخصات المحفوظة
  searchInSummaries(query) {
    const userData = this.getUserData();
    if (!userData) return [];

    const lowercaseQuery = query.toLowerCase();
    return userData.savedSummaries.filter(summary => 
      summary.book.title.toLowerCase().includes(lowercaseQuery) ||
      summary.book.author?.toLowerCase().includes(lowercaseQuery) ||
      summary.summary.toLowerCase().includes(lowercaseQuery)
    );
  }

  // حذف ملخص
  deleteSummary(summaryId) {
    const userData = this.getUserData();
    if (userData) {
      userData.savedSummaries = userData.savedSummaries.filter(
        summary => summary.id !== summaryId
      );
      return this.saveUserData(userData);
    }
    return false;
  }

  // الحصول على الإحصائيات
  getStats() {
    const userData = this.getUserData();
    return userData ? userData.activityStats : null;
  }

  // تحديث التفضيلات
  updatePreferences(preferences) {
    const userData = this.getUserData();
    if (userData) {
      userData.readingPreferences = { 
        ...userData.readingPreferences, 
        ...preferences 
      };
      return this.saveUserData(userData);
    }
    return false;
  }

  // الحصول على الاقتراحات المخصصة
  getPersonalizedSuggestions() {
    const userData = this.getUserData();
    if (!userData) return [];

    const suggestions = [];
    const { searchHistory, savedSummaries, readingPreferences } = userData;

    // اقتراحات بناءً على سجل البحث
    const recentSearches = searchHistory.slice(0, 5);
    recentSearches.forEach(search => {
      if (search.bookTitle) {
        suggestions.push({
          type: 'recent_search',
          title: search.bookTitle,
          query: search.query,
          relevance: 'high'
        });
      }
    });

    // اقتراحات بناءً على التصنيفات المفضلة
    if (readingPreferences.favoriteCategories.length > 0) {
      readingPreferences.favoriteCategories.forEach(category => {
        suggestions.push({
          type: 'favorite_category',
          category: category,
          relevance: 'medium'
        });
      });
    }

    // اقتراحات بناءً على المؤلفين المفضلين
    const favoriteAuthors = this.getFavoriteAuthors();
    favoriteAuthors.forEach(author => {
      suggestions.push({
        type: 'favorite_author',
        author: author,
        relevance: 'high'
      });
    });

    return suggestions.slice(0, 10); // إرجاع أفضل 10 اقتراحات فقط
  }

  // الحصول على المؤلفين المفضلين
  getFavoriteAuthors() {
    const userData = this.getUserData();
    if (!userData) return [];

    const authorCount = {};
    userData.savedSummaries.forEach(summary => {
      if (summary.book.author) {
        authorCount[summary.book.author] = (authorCount[summary.book.author] || 0) + 1;
      }
    });

    return Object.entries(authorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([author]) => author);
  }

  // تصدير بيانات المستخدم
  exportUserData() {
    const userData = this.getUserData();
    return userData ? JSON.stringify(userData, null, 2) : null;
  }

  // مسح جميع بيانات المستخدم
  clearUserData() {
    try {
      localStorage.removeItem(`bookwise_user_${this.userId}`);
      localStorage.removeItem('bookwise_user_id');
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }
}

// إنشاء نسخة واحدة من المدير
export const userDataManager = new UserDataManager();