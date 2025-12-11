import { sessionManager } from './sessionManager';


const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';




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
      
      // Get response text for better error messages
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse response if there's content
      if (responseText) {
        return JSON.parse(responseText);
      }
      
      return {};
    } catch (error) {
      console.error('API Request failed:', {
        url: fullUrl,
        error: error.message,
        method: options.method || 'GET'
      });
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

// Blog API with enhanced error handling
const blogAPI = {
  getLatestBlogs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await requestHandler.makeRequest(`/api/blog/latest?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      // Return fallback data for development
      return {
        blogs: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  },
    saveAISummaryAsBlog: async (summaryData) => {
    try {
      const userId = await userManager.getOrCreateUserId();
      
      const response = await requestHandler.makeRequest('/api/blog/auto-save', {
        method: 'POST',
        body: JSON.stringify({
          ...summaryData,
          userId
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error auto-saving blog:', error);
      throw error;
    }
  },

  // Save PDF summary as blog
  savePDFSummaryAsBlog: async (pdfData) => {
    try {
      const userId = await userManager.getOrCreateUserId();
      
      const response = await requestHandler.makeRequest('/api/blog/save-pdf-summary', {
        method: 'POST',
        body: JSON.stringify({
          ...pdfData,
          userId,
          generationType: 'pdf_summary'
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error saving PDF blog:', error);
      throw error;
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const response = await requestHandler.makeRequest(`/api/blog/${slug}`);
      return response;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  },

  likeBlog: async (blogId) => {
    const userId = await userManager.getOrCreateUserId();
    try {
      const response = await requestHandler.makeRequest(`/api/blog/${blogId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      return response;
    } catch (error) {
      console.error('Error liking blog:', error);
      throw error;
    }
  },

  getBlogCategories: async () => {
    try {
      const response = await requestHandler.makeRequest('/api/blog/categories/all');
      return response;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      // Return mock categories for development
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

  // Enhanced search method with better error handling
  searchBlogs: async (params = {}) => {
    try {
      const { q, ...restParams } = params;
      
      // Validate query length
      if (!q || q.trim().length < 2) {
        // Fallback to getLatestBlogs if query is too short
        return await blogAPI.getLatestBlogs(restParams);
      }
      
      const queryString = new URLSearchParams({ q, ...restParams }).toString();
      const response = await requestHandler.makeRequest(`/api/blog/search?${queryString}`);
      
      // Check if response has expected structure
      if (response && (response.blogs || response.data)) {
        return response;
      } else {
        // Fallback if search returns unexpected format
        console.warn('Search returned unexpected format, falling back to latest blogs');
        return await blogAPI.getLatestBlogs(restParams);
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
      // Fallback to getLatestBlogs on search error
      return await blogAPI.getLatestBlogs(params);
    }
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

  // Add new blog creation method
  createBlog: async (blogData) => {
    try {
      const userId = await userManager.getOrCreateUserId();
      
      const response = await requestHandler.makeRequest('/api/blog', {
        method: 'POST',
        body: JSON.stringify({
          ...blogData,
          userId
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Add blog update method
  updateBlog: async (blogId, blogData) => {
    try {
      const response = await requestHandler.makeRequest(`/api/blog/${blogId}`, {
        method: 'PUT',
        body: JSON.stringify(blogData)
      });
      
      return response;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Add blog deletion method
  deleteBlog: async (blogId) => {
    try {
      const response = await requestHandler.makeRequest(`/api/blog/${blogId}`, {
        method: 'DELETE'
      });
      
      return response;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // Add method to get user's blogs
  getUserBlogs: async () => {
    try {
      const userId = await userManager.getOrCreateUserId();
      const response = await requestHandler.makeRequest(`/api/user/blogs?userId=${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      return { blogs: [] };
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

  // PDF Upload
  uploadPDF: async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const userId = await userManager.getOrCreateUserId();
      formData.append('userId', userId);

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      
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
  isAdminAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem('admin_token');
      const expiry = localStorage.getItem('admin_token_expiry');
      
      if (!token || !expiry) return false;
      
      // Check if token is expired
      if (Date.now() > parseInt(expiry)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_expiry');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking admin auth:', error);
      return false;
    }
  },

  // Add admin logout function
  adminLogout: () => {
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token_expiry');
      localStorage.removeItem('admin_username');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },

  // Blog APIs
  getLatestBlogs: blogAPI.getLatestBlogs,
  getBlogBySlug: blogAPI.getBlogBySlug,
  likeBlog: blogAPI.likeBlog,
  getBlogCategories: blogAPI.getBlogCategories,
  searchBlogs: blogAPI.searchBlogs,
  addComment: blogAPI.addComment,
  createBlog: blogAPI.createBlog,
  updateBlog: blogAPI.updateBlog,
  deleteBlog: blogAPI.deleteBlog,
  getUserBlogs: blogAPI.getUserBlogs,
    saveAISummaryAsBlog: blogAPI.saveAISummaryAsBlog,  
  savePDFSummaryAsBlog: blogAPI.savePDFSummaryAsBlog,
  
  // Admin login
  adminLogin: async (username, password) => {
    return requestHandler.makeRequest('/api/admin/login', {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },

  // User management
  getUserProfile: async () => {
    try {
      const userId = await userManager.getOrCreateUserId();
      return requestHandler.makeRequest(`/api/user/profile?userId=${userId}`);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { user: null };
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const userId = await userManager.getOrCreateUserId();
      return requestHandler.makeRequest(`/api/user/profile`, {
        method: 'PUT',
        body: JSON.stringify({ userId, ...userData })
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Analytics/Stats
  getBlogStats: async () => {
    try {
      return requestHandler.makeRequest('/api/blog/stats');
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      return {
        totalBlogs: 0,
        totalCategories: 0,
        totalLikes: 0,
        totalComments: 0
      };
    }
  },

  // Utility methods
  getSessionId: () => sessionManager.getUserId(),
  
  // Check API health
  checkHealth: async () => {
    try {
      return await requestHandler.makeRequest('/health');
    } catch (error) {
      console.error('API health check failed:', error);
      return { status: 'offline', error: error.message };
    }
  },

  // Batch operations
  batchLikeBlogs: async (blogIds) => {
    try {
      const userId = await userManager.getOrCreateUserId();
      return requestHandler.makeRequest('/api/blog/batch/like', {
        method: 'POST',
        body: JSON.stringify({ userId, blogIds })
      });
    } catch (error) {
      console.error('Error batch liking blogs:', error);
      throw error;
    }
  },

  // File upload with progress (alternative to PDF upload)
  uploadFileWithProgress: async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      formData.append('file', file);
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          if (onProgress) onProgress(Math.round(percentComplete));
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });
      
      xhr.open('POST', `${API_BASE}/api/upload`);
      xhr.send(formData);
    });
  },

  // Rate limiting helper
  withRetry: async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.log(`Retry ${i + 1}/${maxRetries} after error:`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  },

  // Cache helper
  cachedRequest: async (key, fn, ttl = 300000) => { // 5 minutes default
    if (typeof window === 'undefined') return await fn();
    
    const cached = localStorage.getItem(`cache_${key}`);
    const cacheTime = localStorage.getItem(`cache_time_${key}`);
    
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < ttl) {
      return JSON.parse(cached);
    }
    
    const result = await fn();
    localStorage.setItem(`cache_${key}`, JSON.stringify(result));
    localStorage.setItem(`cache_time_${key}`, Date.now().toString());
    return result;
  }
};

export default api;