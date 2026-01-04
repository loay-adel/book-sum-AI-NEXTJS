// lib/hooks/useUserData.js
"use client";
import { useState, useEffect, useCallback } from 'react';

export const useUserData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.booksummarizer.net';

  // Generate or get user ID
  useEffect(() => {
    const getUserId = () => {
      let id = localStorage.getItem('bookwise_user_id');
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('bookwise_user_id', id);
      }
      setUserId(id);
      
      // Ensure user exists in backend database
      ensureUserExists(id);
      return id;
    };
    
    getUserId();
  }, []);

  // Ensure user exists in backend database
  const ensureUserExists = useCallback(async (userId) => {
    if (!API_BASE || !userId) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (err) {
      console.warn('⚠️ Could not check user existence:', err.message);
    }
  }, [API_BASE]);

  // Send data to backend API with better error handling
  const sendToBackendAPI = useCallback(async (endpoint, data, method = 'POST') => {

    try {
      const url = `${API_BASE}/api/user/${userId}${endpoint}`;
      
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`⚠️ API call failed (${response.status}):`, errorText);
        
        if (response.status === 404 && errorText.includes('User not found')) {
          await ensureUserExists(userId);
          
          // Retry once
          const retryResponse = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!retryResponse.ok) {
            const retryError = await retryResponse.text();
            return { 
              success: false, 
              error: retryError, 
              status: retryResponse.status 
            };
          }
          
          const retryResult = await retryResponse.json();
          return { success: true, data: retryResult };
        }
        
        return { 
          success: false, 
          error: errorText, 
          status: response.status 
        };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (err) {
      console.warn('⚠️ Error sending to backend API:', err.message);
      return { 
        success: false, 
        error: err.message,
        isNetworkError: true 
      };
    }
  }, [API_BASE, userId, ensureUserExists]);

  // Add search - Send to database
  const addSearch = useCallback(async (query, results = null, metadata = {}) => {
    if (!userId) return;
    
    const searchData = {
      query,
      resultsCount: results ? (results.recommendations ? results.recommendations.length : 0) : 0,
      bookTitle: results?.book?.title || null,
      success: metadata.success !== false,
      responseTime: metadata.responseTime || 0,
      source: metadata.source || 'search',
      timestamp: new Date().toISOString()
    };
    
    // Send to backend database
    const result = await sendToBackendAPI('/search', searchData);
    
    
    return result;
  }, [userId, sendToBackendAPI]);

  // Save book - Send to database
  const saveBook = useCallback(async (bookData) => {

    
    const bookToSave = {
      book: {
        title: bookData.title,
        author: bookData.author || 'Unknown',
        thumbnail: bookData.thumbnail || null,
        pageCount: bookData.pageCount || null
      },
      summary: bookData.summary || 'AI-generated summary',
      type: 'search',
      amazonLink: bookData.amazonLink || null,
      recommendations: bookData.recommendations || [],
      timestamp: new Date().toISOString()
    };
    
    // Send to backend database
    const result = await sendToBackendAPI('/summary', bookToSave);
    
    
    return result;
  }, [userId, sendToBackendAPI]);

  // Track user interaction
  const trackInteraction = useCallback(async (action, data = {}) => {
    if (!userId) return;
    
    const interaction = {
      action,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        url: window.location.href,
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language
      }
    };
    

    
    return interaction;
  }, [userId]);

  // Retry failed operations
  const retryFailedOperations = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Retry failed searches
      const failedSearches = JSON.parse(localStorage.getItem('bookwise_failed_searches') || '[]');
      const userFailedSearches = failedSearches.filter(s => s.userId === userId);
      
      for (const search of userFailedSearches) {
        const result = await sendToBackendAPI('/search', {
          query: search.query,
          resultsCount: search.resultsCount,
          bookTitle: search.bookTitle,
          success: search.success,
          responseTime: search.responseTime,
          source: search.source,
          timestamp: search.timestamp
        });
        
        if (result.success) {
          // Remove from failed list
          const index = failedSearches.findIndex(s => 
            s.userId === userId && 
            s.timestamp === search.timestamp
          );
          if (index > -1) {
            failedSearches.splice(index, 1);
          }
        }
      }
      
      localStorage.setItem('bookwise_failed_searches', JSON.stringify(failedSearches));
      
      // Retry failed books
      const failedBooks = JSON.parse(localStorage.getItem('bookwise_failed_books') || '[]');
      const userFailedBooks = failedBooks.filter(b => b.userId === userId);
      
      for (const book of userFailedBooks) {
        const result = await sendToBackendAPI('/summary', {
          book: book.book,
          summary: book.summary,
          type: book.type,
          amazonLink: book.amazonLink,
          recommendations: book.recommendations,
          timestamp: book.timestamp
        });
        
        if (result.success) {
          // Remove from failed list
          const index = failedBooks.findIndex(b => 
            b.userId === userId && 
            b.timestamp === book.timestamp
          );
          if (index > -1) {
            failedBooks.splice(index, 1);
          }
        }
      }
      
      localStorage.setItem('bookwise_failed_books', JSON.stringify(failedBooks));
      
    } catch (err) {
      console.error('Error retrying failed operations:', err);
    }
  }, [userId, sendToBackendAPI]);

  return {
    userId,
    loading,
    error,
    addSearch,
    saveBook,
    trackInteraction,
    retryFailedOperations
  };
};