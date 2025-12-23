import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const useBlogs = (initialParams = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    category: null,
    sortBy: 'newest',
    ...initialParams
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create query parameters
      const queryParams = {
        page: params.page,
        limit: params.limit,
        ...(params.category && { category: params.category }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.search && { search: params.search })
      };
      

      
      const response = await api.getLatestBlogs(queryParams);
      
      setBlogs(response.blogs || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);
  
  const saveBlogFromSummary = useCallback(async (summaryData) => {
    try {
      const response = await api.saveAISummaryAsBlog(summaryData);
      return response;
    } catch (error) {
      console.error('Error saving blog from summary:', error);
      throw error;
    }
  }, []);

  const searchBlogs = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.searchBlogs(query, params.page, params.limit);
      
      setBlogs(response.blogs || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
    } catch (err) {
      setError(err.message);
      console.error('Error searching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit]);

  const likeBlog = useCallback(async (blogId) => {
    try {
      const response = await api.likeBlog(blogId);
      
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.id === blogId 
            ? { 
                ...blog, 
                likesCount: response.likesCount,
                liked: response.liked 
              }
            : blog
        )
      );
      
      return response;
    } catch (err) {
      console.error('Error liking blog:', err);
      throw err;
    }
  }, []);

  const addComment = useCallback(async (blogId, content, username) => {
    try {
      const response = await api.addComment(blogId, { content, username });
      
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog.id === blogId 
            ? { 
                ...blog, 
                commentsCount: response.commentsCount,
                comments: [...(blog.comments || []), response.comment]
              }
            : blog
        )
      );
      
      return response;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  }, []);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ 
      ...prev, 
      ...newParams,
      // Reset to page 1 when category or sort changes
      ...(newParams.category !== undefined || newParams.sortBy !== undefined 
        ? { page: 1 } 
        : {}
      )
    }));
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    pagination,
    params,
    fetchBlogs,
    searchBlogs,
    likeBlog,
    addComment,
    updateParams,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPrevPage,
    goToNextPage: () => updateParams({ page: pagination.currentPage + 1 }),
    goToPrevPage: () => updateParams({ page: pagination.currentPage - 1 }),
    goToPage: (page) => updateParams({ page })
  };
};

export const useSingleBlog = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getBlogBySlug(slug);
        setBlog(response.blog);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const likeBlog = useCallback(async () => {
    if (!blog) return;
    
    try {
      const response = await api.likeBlog(blog.id);
      setBlog(prev => ({
        ...prev,
        likesCount: response.likesCount,
        liked: response.liked
      }));
      return response;
    } catch (err) {
      console.error('Error liking blog:', err);
      throw err;
    }
  }, [blog]);

  const addComment = useCallback(async (content, username) => {
    if (!blog) return;
    
    try {
      const response = await api.addComment(blog.id, { content, username });
      
      setBlog(prev => ({
        ...prev,
        commentsCount: response.commentsCount,
        comments: [...(prev.comments || []), response.comment]
      }));
      
      return response;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  }, [blog]);

  return {
    blog,
    loading,
    error,
    likeBlog,
    addComment
  };
};

export const useUserBlogs = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.getUserBlogs();
        setUserBlogs(response.blogs || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  const deleteBlog = useCallback(async (blogId) => {
    try {
      await api.deleteUserBlog(blogId);
      setUserBlogs(prev => prev.filter(blog => blog.id !== blogId));
      return true;
    } catch (err) {
      console.error('Error deleting blog:', err);
      throw err;
    }
  }, []);

  return {
    userBlogs,
    loading,
    error,
    deleteBlog,
    saveBlogFromSummary
  };
};