"use client"

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { useBlogs } from '@/lib/hooks/useBlogs';
import Link from 'next/link';
import Image from 'next/image';

const BlogsPage = () => {
  const { 
    blogs, 
    loading, 
    error, 
    pagination, 
    searchBlogs, 
    likeBlog,
    updateParams 
  } = useBlogs({
    page: 1,
    limit: 12,
    sortBy: 'newest'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getBlogCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchBlogs(searchQuery);
    }
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateParams({ 
      category: category === 'all' ? null : category,
      page: 1 
    });
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateParams({ sortBy: sort, page: 1 });
  };

  // Handle like
  const handleLike = async (blogId) => {
    try {
      await likeBlog(blogId);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Book Summaries & Reviews
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Discover AI-generated book summaries, reviews, and insights from our community
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs by title, author, or topic..."
                    className="w-full px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group"
              >
                {/* Book Cover */}
                {blog.bookDetails?.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
            <Image
              src={blog.bookDetails.thumbnail}
              alt={blog.bookDetails.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  </div>
                )}

                {/* Blog Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  {blog.category && (
                    <span className="inline-block px-3 py-1 text-xs bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full mb-3">
                      {blog.category}
                    </span>
                  )}

                  {/* Title */}
                  <Link href={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold mb-3 hover:text-blue-400 transition duration-200 line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt || blog.aiResponseExcerpt}
                  </p>

                  {/* Book Details */}
                  {blog.bookDetails && (
                    <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                      <p className="font-semibold text-sm text-gray-300">
                        Book: {blog.bookDetails.title}
                      </p>
                      {blog.bookDetails.author && (
                        <p className="text-sm text-gray-400">
                          By {blog.bookDetails.author}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(blog.id)}
                        className={`flex items-center gap-1 ${
                          blog.liked ? 'text-red-500' : 'hover:text-red-400'
                        } transition duration-200`}
                      >
                        ♥ {blog.likesCount || 0}
                      </button>
                      <span className="flex items-center gap-1">
                        👁️ {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {blog.commentsCount || 0}
                      </span>
                    </div>
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {blog.user?.username?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {blog.user?.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {blog.isAutoGenerated ? 'AI Generated' : 'Community Post'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {blogs.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-2">No blogs found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? `No results for "${searchQuery}"`
                  : 'Be the first to create a blog post!'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
              >
                <span>Generate a Book Summary</span>
                <span>→</span>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => updateParams({ page: pagination.currentPage - 1 })}
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  pagination.hasPrevPage
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParams({ page: pageNum })}
                      className={`w-10 h-10 rounded-lg transition duration-200 ${
                        pageNum === pagination.currentPage
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => updateParams({ page: pagination.currentPage + 1 })}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  pagination.hasNextPage
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {pagination.totalItems}
                </div>
                <div className="text-gray-400">Total Blogs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {categories.reduce((sum, cat) => sum + cat.count, 0)}
                </div>
                <div className="text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {blogs.filter(b => b.featured).length}
                </div>
                <div className="text-gray-400">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {Math.round(pagination.totalItems / 30)}
                </div>
                <div className="text-gray-400">Avg. Daily</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsPage;