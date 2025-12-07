import { sessionManager } from './sessionManager';

// Simple API base configuration
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

// Simple Request Handler
class RequestHandler {
  async makeRequest(url, options = {}) {
    const fullUrl = `${API_BASE}${url}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(fullUrl, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error.message);
      throw error;
    }
  }
}

const requestHandler = new RequestHandler();

// Simple UserManager
class UserManager {
  getOrCreateUserId() {
    if (typeof window === 'undefined') return 'anonymous';
    
    let userId = sessionManager.getUserId();
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionManager.setUserSession(userId);
    }
    return userId;
  }
}

const userManager = new UserManager();

// Blog API
const blogAPI = {
  getLatestBlogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return requestHandler.makeRequest(`/api/blog/latest?${queryString}`);
  },

  getBlogBySlug: async (slug) => {
    return requestHandler.makeRequest(`/api/blog/${slug}`);
  },

  likeBlog: async (blogId) => {
    const userId = await userManager.getOrCreateUserId();
    return requestHandler.makeRequest(`/api/blog/${blogId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },

  // FIX: Change from '/api/blog/categories' to '/api/blog/categories/all'
  getBlogCategories: async () => {
    try {
      const response = await requestHandler.makeRequest('/api/blog/categories/all');
      return response;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      // Return empty array or mock data if API fails
      return [
        { name: 'Fiction', count: 42 },
        { name: 'Non-Fiction', count: 38 },
        { name: 'Self-Help', count: 25 },
        { name: 'Business', count: 19 },
        { name: 'Technology', count: 15 },
        { name: 'Science', count: 12 },
        { name: 'Biography', count: 8 },
        { name: 'Fantasy', count: 7 },
      ];
    }
  },

  // Add search method if needed
  searchBlogs: async (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    return requestHandler.makeRequest(`/api/blog/search/all?${queryString}`);
  },
  addComment: async (blogId, { content, username }) => {
    try {
      const userId = await userManager.getOrCreateUserId();
      
      const response = await requestHandler.makeRequest(`/api/blog/${blogId}/comment`, {
        method: "POST",
        body: JSON.stringify({ 
          userId,
          username,
          content 
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
};

// Main API object
export const api = {
  // Book Summary
  getBookSummary: async (bookName, lang = "en") => {
    try {
      const userId = await userManager.getOrCreateUserId();

      const response = await requestHandler.makeRequest('/api/summary', {
        method: "POST",
        body: JSON.stringify({ 
          bookName, 
          lang,
          userId 
        })
      });

      return response;
    } catch (error) {
      console.error('Error getting book summary:', error);
      throw error;
    }
  },

  // PDF Upload - SIMPLIFIED version
  uploadPDF: async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      // Get user ID
      const userId = await userManager.getOrCreateUserId();
      formData.append('userId', userId);

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      
      // Check if response is OK
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Parse the response
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error uploading PDF:', error.message);
      throw error;
    }
  },

  // Categories
  getCategories: async () => {
    return requestHandler.makeRequest('/api/categories');
  },

  getCategoryBooks: async (categoryId) => {
    return requestHandler.makeRequest(`/api/categories/${categoryId}`);
  },

  // Blog APIs
  getLatestBlogs: blogAPI.getLatestBlogs,
  getBlogBySlug: blogAPI.getBlogBySlug,
  likeBlog: blogAPI.likeBlog,
  getBlogCategories: blogAPI.getBlogCategories,
  searchBlogs: blogAPI.searchBlogs,
  addComment: blogAPI.addComment,
  // Admin login
  adminLogin: async (username, password) => {
    return requestHandler.makeRequest('/api/admin/login', {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },

  // Simple utility
  getSessionId: () => sessionManager.getUserId(),
};

export default api;