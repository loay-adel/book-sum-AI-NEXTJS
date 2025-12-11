"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { useBlogs } from '@/lib/hooks/useBlogs';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';

// SVG data URL for fallback image
const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="275" viewBox="0 0 180 275">
    <rect width="180" height="275" fill="#1f2937"/>
    <rect x="20" y="20" width="140" height="235" fill="#374151" stroke="#4b5563" stroke-width="1.5"/>
    <text x="90" y="135" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="16">Book Cover</text>
    <text x="90" y="155" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">No image</text>
  </svg>
`)}`;

// Safe image URL function
const getSafeImageUrl = (url) => {
  if (!url) return PLACEHOLDER_SVG;
  
  try {
    const parsedUrl = new URL(url);
    
    if (parsedUrl.hostname.includes('via.placeholder.com')) {
      return PLACEHOLDER_SVG;
    }
    
    return url;
  } catch {
    if (url.startsWith('/')) {
      return url;
    }
    return PLACEHOLDER_SVG;
  }
};

// Enhanced loading component
const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${sizes[size]}`}></div>
    </div>
  );
};

// Arabic translations dictionary
const translations = {
  en: {
    heroTitle: "Book Summaries & Reviews",
    heroSubtitle: "Discover AI-generated book summaries, reviews, and insights from our community",
    refreshBlogs: "Refresh Blogs",
    generateNewSummary: "Generate New Summary",
    all: "All",
    sortBy: "Sort by:",
    newest: "Newest",
    oldest: "Oldest",
    popular: "Most Popular",
    featured: "Featured",
    tryAgain: "Try Again",
    noBlogsTitle: "No blogs found",
    noBlogsMessage: "No blogs available yet. Be the first to create one!",
    generateSummary: "Generate a Book Summary",
    showing: "Showing",
    of: "of",
    blogs: "blogs",
    previous: "Previous",
    next: "Next",
    totalBlogs: "Total Blogs",
    categories: "Categories",
    featuredBlogs: "Featured",
    avgDaily: "Avg. Daily",
    by: "By",
    views: "views",
    comments: "comments",
    aiGenerated: "AI Generated",
    community: "Community",
    loadingBlogs: "Loading blogs...",
    filterBy: "Filter by",
    readMore: "Read More",
    like: "Like",
    bookCover: "Book Cover",
    noImage: "No image",
    errorTryRefresh: "Try refreshing the page",
    errorTryAgain: "Please try again"
  },
  ar: {
    heroTitle: "ملخصات الكتب والمراجعات",
    heroSubtitle: "اكتشف ملخصات الكتب المولدة بالذكاء الاصطناعي والمراجعات والرؤى من مجتمعنا",
    refreshBlogs: "تحديث المدونات",
    generateNewSummary: "إنشاء ملخص جديد",
    all: "الكل",
    sortBy: "ترتيب حسب:",
    newest: "الأحدث",
    oldest: "الأقدم",
    popular: "الأكثر شهرة",
    featured: "المميز",
    tryAgain: "حاول مرة أخرى",
    noBlogsTitle: "لم يتم العثور على مدونات",
    noBlogsMessage: "لا توجد مدونات متاحة بعد. كن أول من ينشئ واحدة!",
    generateSummary: "إنشاء ملخص كتاب",
    showing: "عرض",
    of: "من",
    blogs: "مدونة",
    previous: "السابق",
    next: "التالي",
    totalBlogs: "إجمالي المدونات",
    categories: "التصنيفات",
    featuredBlogs: "المميزة",
    avgDaily: "متوسط يومي",
    by: "بواسطة",
    views: "مشاهدة",
    comments: "تعليق",
    aiGenerated: "مولد بالذكاء الاصطناعي",
    community: "مجتمع",
    loadingBlogs: "جاري تحميل المدونات...",
    filterBy: "تصفية حسب",
    readMore: "اقرأ المزيد",
    like: "إعجاب",
    bookCover: "غلاف الكتاب",
    noImage: "لا توجد صورة",
    errorTryRefresh: "حاول تحديث الصفحة",
    errorTryAgain: "يرجى المحاولة مرة أخرى"
  }
};

const BlogsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.en;
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  
  // Initialize useBlogs hook
  const { 
    blogs, 
    loading, 
    error, 
    pagination, 
    likeBlog,
    updateParams,
    fetchBlogs 
  } = useBlogs({
    page: 1,
    limit: 12,
    sortBy: 'newest'
  });

  // Fetch categories with caching strategy
  useEffect(() => {
    let mounted = true;
    
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const cachedCategories = localStorage.getItem('blogCategories');
        const cacheTimestamp = localStorage.getItem('blogCategoriesTimestamp');
        const oneHourAgo = Date.now() - 3600000;
        
        if (cachedCategories && cacheTimestamp && parseInt(cacheTimestamp) > oneHourAgo) {
          if (mounted) {
            setCategories(JSON.parse(cachedCategories));
            setIsCategoriesLoading(false);
          }
          return;
        }
        
        const data = await api.getBlogCategories();
        
        if (mounted) {
          setCategories(data);
          setIsCategoriesLoading(false);
          
          localStorage.setItem('blogCategories', JSON.stringify(data));
          localStorage.setItem('blogCategoriesTimestamp', Date.now().toString());
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (mounted) {
          setIsCategoriesLoading(false);
        }
      }
    };
    
    fetchCategories();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Memoized handlers
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    updateParams({ 
      category: category === 'all' ? null : category,
      page: 1 
    });
  }, [updateParams]);

  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
    updateParams({ sortBy: sort, page: 1 });
  }, [updateParams]);

  const handleLike = useCallback(async (blogId, e) => {
    e.stopPropagation(); // Prevent card click
    try {
      await likeBlog(blogId);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  }, [likeBlog]);

  const handleRefresh = useCallback(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Memoize computed values
  const filteredCategories = useMemo(() => 
    categories.slice(0, 8), [categories]
  );

  const statsData = useMemo(() => ({
    totalBlogs: pagination.totalItems,
    totalCategories: categories.reduce((sum, cat) => sum + cat.count, 0),
    featuredBlogs: blogs.filter(b => b.featured).length,
    avgDaily: Math.round(pagination.totalItems / 30)
  }), [pagination.totalItems, categories, blogs]);

  // Safe image URLs for all blogs
  const blogsWithSafeImages = useMemo(() => 
    blogs.map(blog => ({
      ...blog,
      safeThumbnail: blog.bookDetails?.thumbnail ? 
        getSafeImageUrl(blog.bookDetails.thumbnail) : PLACEHOLDER_SVG
    }))
  , [blogs]);

  // Loading skeleton components
  const renderBlogSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
          <div className="pt-[150%] bg-gray-700"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="h-5 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (lang === 'ar') {
      return date.toLocaleDateString('ar-SA', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get sort options based on language
  const getSortOptions = () => {
    if (lang === 'ar') {
      return [
        { value: 'newest', label: 'الأحدث' },
        { value: 'oldest', label: 'الأقدم' },
        { value: 'popular', label: 'الأكثر شهرة' },
        { value: 'featured', label: 'المميز' }
      ];
    }
    return [
      { value: 'newest', label: 'Newest' },
      { value: 'oldest', label: 'Oldest' },
      { value: 'popular', label: 'Most Popular' },
      { value: 'featured', label: 'Featured' }
    ];
  };

  if (loading && blogs.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto py-16">
            <LoadingSpinner size="large" />
            <p className="text-center mt-4 text-gray-400">{t.loadingBlogs}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div 
        className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20 ${
          lang === 'ar' ? 'font-arabic' : 'font-sans'
        }`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                {t.heroTitle}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                {t.heroSubtitle}
              </p>
              
              {/* Refresh Button */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center gap-2"
                >
                  <span>{t.refreshBlogs}</span>
                  <span>⟳</span>
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 flex items-center gap-2"
                >
                  <span>{t.generateNewSummary}</span>
                  <span>+</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Section */}
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
                aria-label={t.all}
              >
                {t.all}
              </button>
              
              {isCategoriesLoading ? (
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-700 rounded-lg w-20 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    aria-label={`${t.filterBy} ${category.name}`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">{t.sortBy}</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t.sortBy}
              >
                {getSortOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 font-medium">{error}</p>
                  <p className="text-red-400/80 text-sm mt-1">
                    {error.includes('400') ? t.errorTryRefresh : t.errorTryAgain}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200 whitespace-nowrap"
                >
                  {t.tryAgain}
                </button>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          <Suspense fallback={renderBlogSkeleton()}>
            {loading ? (
              renderBlogSkeleton()
            ) : (
              <>
                {blogsWithSafeImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {blogsWithSafeImages.map((blog, index) => (
                      <div
                        key={blog.id}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group flex flex-col h-full"
                      >
                        {/* Book Cover */}
                        <Link href={`/blogs/${blog.slug}`} className="block">
                          <div className="relative w-full pt-[150%] overflow-hidden">
                            <div className="absolute inset-0">
                              <Image
                                src={blog.safeThumbnail}
                                alt={blog.bookDetails?.title || t.bookCover}
                                fill
                                priority={index < 4}
                                className="object-contain p-2 group-hover:scale-105 transition duration-500"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                unoptimized={blog.safeThumbnail === PLACEHOLDER_SVG}
                                loading={index < 4 ? "eager" : "lazy"}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                            </div>
                            
                            {/* Category Badge */}
                            {blog.category && (
                              <div className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} z-10`}>
                                <span className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-sm rounded-full">
                                  {blog.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Content Area */}
                        <div className="p-4 flex-1 flex flex-col">
                          <Link href={`/blogs/${blog.slug}`} className="flex-1">
                            <h3 className="text-lg font-bold mb-2 hover:text-blue-400 transition duration-200 line-clamp-2">
                              {blog.title}
                            </h3>
                          </Link>

                          {/* Book Details */}
                          {blog.bookDetails && (
                            <div className="mb-3 p-2 bg-gray-900/50 rounded text-xs">
                              <p className="font-semibold text-gray-300 truncate">
                                {blog.bookDetails.title}
                              </p>
                              {blog.bookDetails.author && (
                                <p className="text-gray-400 truncate">
                                  {t.by} {blog.bookDetails.author}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Excerpt */}
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2 flex-1">
                            {blog.excerpt || blog.aiResponseExcerpt || 'No description available'}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => handleLike(blog.id, e)}
                                className={`flex items-center gap-1 transition duration-200 ${
                                  blog.liked ? 'text-red-500' : 'hover:text-red-400'
                                }`}
                                aria-label={`${t.like} ${blog.title}`}
                              >
                                <span className="text-sm">♥</span>
                                <span>{blog.likesCount || 0}</span>
                              </button>
                              <span className="flex items-center gap-1" aria-label={`${blog.views || 0} ${t.views}`}>
                                <span className="text-sm">👁️</span>
                                <span>{blog.views || 0}</span>
                              </span>
                              <span className="flex items-center gap-1" aria-label={`${blog.commentsCount || 0} ${t.comments}`}>
                                <span className="text-sm">💬</span>
                                <span>{blog.commentsCount || 0}</span>
                              </span>
                            </div>
                            <span className="text-xs">
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>

                          {/* Author */}
                          <div className="mt-3 pt-3 border-t border-gray-700 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold">
                                {blog.user?.username?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium truncate">
                                {blog.user?.username || 'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {blog.isAutoGenerated ? t.aiGenerated : t.community}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold mb-2">{t.noBlogsTitle}</h3>
                    <p className="text-gray-400 mb-6">
                      {t.noBlogsMessage}
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
                    >
                      <span>{t.generateSummary}</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </Suspense>

          {/* Pagination */}
          {pagination.totalPages > 1 && blogsWithSafeImages.length > 0 && (
            <div className="mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-400 text-sm">
                  {t.showing} {((pagination.currentPage - 1) * pagination.limit) + 1}-
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} {t.of} {pagination.totalItems} {t.blogs}
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateParams({ page: pagination.currentPage - 1 })}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg transition duration-200 ${
                      pagination.hasPrevPage
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                    }`}
                    aria-label={t.previous}
                  >
                    {t.previous}
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
                          aria-label={`${t.goToPage} ${pageNum}`}
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
                    aria-label={t.next}
                  >
                    {t.next}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {blogsWithSafeImages.length > 0 && (
            <div className="mt-12 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {statsData.totalBlogs}
                  </div>
                  <div className="text-gray-400">{t.totalBlogs}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {statsData.totalCategories}
                  </div>
                  <div className="text-gray-400">{t.categories}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {statsData.featuredBlogs}
                  </div>
                  <div className="text-gray-400">{t.featuredBlogs}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {statsData.avgDaily}
                  </div>
                  <div className="text-gray-400">{t.avgDaily}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogsPage;