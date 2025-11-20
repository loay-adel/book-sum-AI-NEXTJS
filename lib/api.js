const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const handleResponse = async (response) => {
  if (!response.ok) {
    let error = "An error occurred";
    try {
      const errorData = await response.json();
      error = errorData.message || `HTTP error! status: ${response.status}`;
    } catch (e) {
      error = `HTTP error! status: ${response.status}`;
    }
    throw new Error(error);
  }
  return response.json();
};

// الحصول على معرف المستخدم أو إنشاء واحد جديد
const getOrCreateUserId = () => {
  if (typeof window === 'undefined') return null;
  
  let userId = localStorage.getItem('bookwise_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('bookwise_user_id', userId);
  }
  return userId;
};

export const api = {
  // Get book summary by name
  getBookSummary: async (bookName, lang = "en") => {
    const response = await fetch(`${API_BASE}/api/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookName, lang }),
    });
    return handleResponse(response);
  },

  // Upload and summarize PDF
  uploadPDF: async (formData) => {
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });
    return handleResponse(response);
  },

  // Get all categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE}/api/categories`);
    return handleResponse(response);
  },

  // Get books by category
  getCategoryBooks: async (categoryId) => {
    const response = await fetch(`${API_BASE}/api/categories/${categoryId}`);
    return handleResponse(response);
  },

  // User Data APIs - تم التصحيح
  getUserData: async () => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}`);
    return handleResponse(response);
  },

  saveSearch: async (searchData) => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchData),
    });
    return handleResponse(response);
  },

  saveSummary: async (summaryData) => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(summaryData),
    });
    return handleResponse(response);
  },

  getSearchHistory: async (limit = 10) => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/search-history?limit=${limit}`);
    return handleResponse(response);
  },

  getSavedSummaries: async (limit = 10) => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/saved-summaries?limit=${limit}`);
    return handleResponse(response);
  },

  deleteSummary: async (summaryId) => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/summary/${summaryId}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },

  updatePreferences: async (preferences) => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });
    return handleResponse(response);
  },

  exportUserData: async () => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/export`);
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookwise-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  clearUserData: async () => {
    const userId = getOrCreateUserId();
    if (!userId) throw new Error('User ID not available');
    
    const response = await fetch(`${API_BASE}/api/user/${userId}/clear`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
  // Admin APIs
  adminLogin: async (username, password) => {
    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  getAdminStats: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getPopularSearches: async (limit = 10) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats/popular-searches?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getVisitorStats: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats/visitors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getAdStats: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats/ads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getPerformanceStats: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats/performance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  exportAdminStats: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats/export`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookwise-admin-stats-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  clearAdminStats: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/api/admin/stats/clear`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};