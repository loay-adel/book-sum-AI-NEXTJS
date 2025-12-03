const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
import { sessionManager } from './sessionManager';


const handleResponse = async (response) => {
  
  if (response.status === 401) {
    // Clear invalid session
    sessionManager.clearAdminSession();
    throw new Error('Authentication failed. Please login again.');
  }
  
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
  
  const data = await response.json();
  return data;
};


const getAdminToken = () => {
  const session = sessionManager.getAdminSession();
  if (!session) {
    throw new Error('No admin session found');
  }
  return session.token;
};

// Secure admin API call wrapper
const makeAdminRequest = async (url, options = {}) => {
  const token = getAdminToken();
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${url}`, config);
  return handleResponse(response);
};

// Secure user ID management
const getOrCreateUserId = () => {
  let userId = sessionManager.getUserId();
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionManager.setUserSession(userId);
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

  // User Data APIs
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

    adminLogin: async (username, password) => {
    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await handleResponse(response);
    
    // Store session securely
    if (typeof window !== 'undefined' && data.token) {
      sessionManager.setAdminSession(data.token, data.admin);
    }
    
    return data;
  },

  adminLogout: () => {
    sessionManager.clearAdminSession();
  },

  // Check if admin is authenticated
  isAdminAuthenticated: () => {
    return sessionManager.validateAdminSession();
  },

  // All admin stats APIs now use secure session management
  getAdminStats: async () => makeAdminRequest('/api/admin/stats'),
  getPopularSearches: async (limit = 10) => 
    makeAdminRequest(`/api/admin/stats/popular-searches?limit=${limit}`),
  getVisitorStats: async () => makeAdminRequest('/api/admin/stats/visitors'),
  getAdStats: async () => makeAdminRequest('/api/admin/stats/ads'),
  getPerformanceStats: async () => makeAdminRequest('/api/admin/stats/performance'),

  exportAdminStats: async () => {
    const token = getAdminToken();
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

  clearAdminStats: async () => makeAdminRequest('/api/admin/stats/clear', { method: 'DELETE' }),
};