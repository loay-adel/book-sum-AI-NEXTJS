"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { useBlogs } from '@/lib/hooks/useBlogs';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  BookOpen, RefreshCw, Plus, Filter, SortAsc, 
  Eye, MessageCircle, Heart, Calendar, User,
  ChevronRight, ChevronLeft, TrendingUp, Star,
  BarChart3, X
} from 'lucide-react';

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

// Loading spinner component
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
    trending: "Trending",
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
    errorTryAgain: "Please try again",
    trending: "Trending Now",
    recentlyAdded: "Recently Added",
    mostViewed: "Most Viewed",
    authors: "Authors",
    fiction: "Fiction",
    nonFiction: "Non-Fiction",
    selfHelp: "Self-Help",
    business: "Business",
    technology: "Technology",
    science: "Science",
    biography: "Biography",
    fantasy: "Fantasy",
    clearFilters: "Clear Filters",
    activeFilters: "Active Filters"
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
    popular: "الأكثر مشاهدة",
    trending: "الأكثر رواجاً",
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
    errorTryAgain: "يرجى المحاولة مرة أخرى",
    trending: "الأكثر رواجاً الآن",
    recentlyAdded: "المضافة حديثاً",
    mostViewed: "الأكثر مشاهدة",
    authors: "المؤلفون",
    fiction: "روايات",
    nonFiction: "غير خيالي",
    selfHelp: "تطوير الذات",
    business: "أعمال",
    technology: "تكنولوجيا",
    science: "علوم",
    biography: "سيرة ذاتية",
    fantasy: "فانتازيا",
    clearFilters: "مسح الفلاتر",
    activeFilters: "الفلاتر النشطة"
  }
};

// Default categories in both languages
const DEFAULT_CATEGORIES = {
  en: [
    { name: 'Fiction', count: 0 },
    { name: 'Non-Fiction', count: 0 },
    { name: 'Self-Help', count: 0 },
    { name: 'Business', count: 0 },
    { name: 'Technology', count: 0 },
    { name: 'Science', count: 0 },
    { name: 'Biography', count: 0 },
    { name: 'Fantasy', count: 0 }
  ],
  ar: [
    { name: 'روايات', count: 0 },
    { name: 'غير خيالي', count: 0 },
    { name: 'تطوير الذات', count: 0 },
    { name: 'أعمال', count: 0 },
    { name: 'تكنولوجيا', count: 0 },
    { name: 'علوم', count: 0 },
    { name: 'سيرة ذاتية', count: 0 },
    { name: 'فانتازيا', count: 0 }
  ]
};

const BlogsPage = () => {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.en;
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES[lang] || DEFAULT_CATEGORIES.en);
  const [sortBy, setSortBy] = useState('newest');
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  
  // Initialize useBlogs hook
  const { 
    blogs, 
    loading, 
    error, 
    pagination, 
    params,
    likeBlog,
    updateParams,
    fetchBlogs 
  } = useBlogs({
    page: 1,
    limit: 12,
    sortBy: 'newest',
    category: null
  });

  // Fetch categories and calculate counts
  useEffect(() => {
    let mounted = true;
    
    const fetchCategoriesAndCounts = async () => {
      try {
        setIsCategoriesLoading(true);
        
        // Get categories from API
        const categoryData = await api.getBlogCategories();
        
        if (mounted && categoryData && categoryData.length > 0) {
          // Filter out unwanted categories
          const filteredCategories = categoryData.filter(cat => 
            cat.name !== 'AI Generated Summaries' && 
            cat.name !== 'ملخصات مولد بالذكاء الاصطناعي'
          );
          
          // Merge with default categories
          const defaultCats = DEFAULT_CATEGORIES[lang] || DEFAULT_CATEGORIES.en;
          const mergedCategories = [...filteredCategories];
          
          defaultCats.forEach(defaultCat => {
            if (!mergedCategories.some(cat => cat.name === defaultCat.name)) {
              mergedCategories.push(defaultCat);
            }
          });
          
          // Calculate category counts from blogs
          const counts = {};
          blogs.forEach(blog => {
            if (blog.category) {
              counts[blog.category] = (counts[blog.category] || 0) + 1;
            }
          });
          
          // Update categories with counts
          const categoriesWithCounts = mergedCategories.map(cat => ({
            ...cat,
            count: counts[cat.name] || cat.count || 0
          }));
          
          setCategories(categoriesWithCounts);
          setCategoryCounts(counts);
          setIsCategoriesLoading(false);
        } else {
          if (mounted) {
            setCategories(DEFAULT_CATEGORIES[lang] || DEFAULT_CATEGORIES.en);
            setIsCategoriesLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (mounted) {
          setCategories(DEFAULT_CATEGORIES[lang] || DEFAULT_CATEGORIES.en);
          setIsCategoriesLoading(false);
        }
      }
    };
    
    if (blogs.length > 0) {
      fetchCategoriesAndCounts();
    }
    
    return () => {
      mounted = false;
    };
  }, [blogs, lang]);

  // Memoized handlers
  const handleCategoryChange = useCallback((category) => {
    const newCategory = category === 'all' ? null : category;
    setSelectedCategory(category);
    updateParams({ 
      category: newCategory,
      page: 1 
    });
    setShowMobileFilters(false);
  }, [updateParams]);

  const handleSortChange = useCallback((sort) => {
    setSortBy(sort);
    updateParams({ 
      sortBy: sort, 
      page: 1 
    });
  }, [updateParams]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSortBy('newest');
    updateParams({
      category: null,
      sortBy: 'newest',
      page: 1
    });
  }, [updateParams]);

  const handleLike = useCallback(async (blogId, e) => {
    e.stopPropagation();
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
    categories
      .filter(cat => cat.count > 0 || cat.name === selectedCategory)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  , [categories, selectedCategory]);

  const statsData = useMemo(() => ({
    totalBlogs: pagination.totalItems,
    totalCategories: filteredCategories.length,
    featuredBlogs: blogs.filter(b => b.featured).length,
    avgDaily: Math.round(pagination.totalItems / 30)
  }), [pagination.totalItems, filteredCategories, blogs]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    selectedCategory !== 'all' || sortBy !== 'newest'
  , [selectedCategory, sortBy]);

  // Get sort options based on language
  const getSortOptions = () => {
    const baseOptions = [
      { value: 'newest', label: lang === 'ar' ? 'الأحدث' : 'Newest', icon: <Calendar className="w-4 h-4" /> },
      { value: 'popular', label: lang === 'ar' ? 'الأكثر مشاهدة' : 'Most Viewed', icon: <Eye className="w-4 h-4" /> },
      { value: 'trending', label: lang === 'ar' ? 'الأكثر رواجاً' : 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
      { value: 'featured', label: lang === 'ar' ? 'المميز' : 'Featured', icon: <Star className="w-4 h-4" /> }
    ];
    
    return baseOptions;
  };

  // Safe image URLs for all blogs
  const blogsWithSafeImages = useMemo(() => 
    blogs.map(blog => ({
      ...blog,
      safeThumbnail: blog.bookDetails?.thumbnail ? 
        getSafeImageUrl(blog.bookDetails.thumbnail) : PLACEHOLDER_SVG
    }))
  , [blogs]);

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

  // Loading skeleton
  const renderBlogSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
          <div className="pt-[150%] bg-gray-700"></div>
          <div className="p-3 md:p-4">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="h-5 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

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
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-gray-900/80">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-16 h-16 text-blue-400" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                {t.heroTitle}
              </h1>
              <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
                {t.heroSubtitle}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
                <button
                  onClick={handleRefresh}
                  className="flex-1 sm:flex-none px-4 py-3 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 flex items-center justify-center gap-2 text-sm md:text-base min-w-[140px]"
                >
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{t.refreshBlogs}</span>
                </button>
                <Link
                  href="/"
                  className="flex-1 sm:flex-none px-4 py-3 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 flex items-center justify-center gap-2 text-sm md:text-base min-w-[140px]"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{t.generateNewSummary}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 md:py-8">
          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{t.activeFilters}:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm flex items-center gap-1">
                    {selectedCategory}
                    <button 
                      onClick={() => handleCategoryChange('all')}
                      className="ml-1 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm flex items-center gap-1">
                    {getSortOptions().find(opt => opt.value === sortBy)?.label}
                    <button 
                      onClick={() => handleSortChange('newest')}
                      className="ml-1 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                {t.clearFilters}
              </button>
            </div>
          )}

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
          >
            <Filter className="w-5 h-5" />
            <span>{t.filterBy}</span>
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Filters Section */}
          <div className={`${showMobileFilters ? 'block' : 'hidden lg:flex'} flex-wrap gap-3 md:gap-4 items-center justify-between mb-6 md:mb-8 p-4 lg:p-0 bg-gray-800/50 lg:bg-transparent rounded-xl lg:rounded-none`}>
            {/* Category Filter */}
            <div className="w-full lg:w-auto mb-4 lg:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 font-medium">{t.categories}:</span>
                <span className="text-xs text-gray-500">
                  ({filteredCategories.filter(cat => cat.count > 0).length} {t.categories})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 lg:max-h-none overflow-y-auto lg:overflow-visible pr-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-3 py-2 text-sm md:text-base rounded-lg transition duration-200 flex-shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {t.all}
                  <span className="ml-2 text-xs bg-gray-900/50 px-1.5 py-0.5 rounded">
                    {pagination.totalItems}
                  </span>
                </button>
                
                {isCategoriesLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-700 rounded-lg w-20 animate-pulse flex-shrink-0"></div>
                    ))}
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryChange(category.name)}
                      className={`px-3 py-2 text-sm md:text-base rounded-lg transition duration-200 flex-shrink-0 whitespace-nowrap ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {category.name} 
                      <span className="ml-2 text-xs bg-gray-900/50 px-1.5 py-0.5 rounded">
                        {category.count}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Sort Options */}
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 font-medium">{t.sortBy}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSortOptions().map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`px-3 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm md:text-base ${
                        sortBy === option.value
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-red-300 font-medium">{error}</p>
                  <p className="text-red-400/80 text-sm mt-1">
                    {error.includes('400') ? t.errorTryRefresh : t.errorTryAgain}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200 whitespace-nowrap flex-shrink-0"
                >
                  {t.tryAgain}
                </button>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          <Suspense fallback={renderBlogSkeleton()}>
            {loading && blogs.length === 0 ? (
              renderBlogSkeleton()
            ) : (
              <>
                {blogsWithSafeImages.length > 0 ? (
                  <>
                    <div className="mb-4 text-sm text-gray-400">
                      {t.showing} {blogsWithSafeImages.length} {t.of} {pagination.totalItems} {t.blogs}
                      {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {blogsWithSafeImages.map((blog, index) => (
                        <div
                          key={blog.id}
                          className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group flex flex-col h-full"
                        >
                          {/* Book Cover */}
                          <Link href={`/blogs/${blog.slug}`} className="block">
                            <div className="relative w-full pt-[150%] overflow-hidden">
                              <div className="absolute inset-0">
                                <img
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
                          <div className="p-3 md:p-4 flex-1 flex flex-col">
                            <Link href={`/blogs/${blog.slug}`} className="flex-1">
                              <h3 className="text-base md:text-lg font-bold mb-2 hover:text-blue-400 transition duration-200 line-clamp-2">
                                {blog.title}
                              </h3>
                            </Link>

                            {/* Book Details */}
                            {blog.bookDetails && (
                              <div className="mb-2 md:mb-3 p-2 bg-gray-900/50 rounded text-xs">
                                <p className="font-semibold text-gray-300 truncate">
                                  {blog.bookDetails.title}
                                </p>
                                {blog.bookDetails.author && (
                                  <p className="text-gray-400 truncate">
                                    <span className="inline-flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {blog.bookDetails.author}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Excerpt */}
                            <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 flex-1">
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
                                >
                                  <Heart className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>{blog.likesCount || 0}</span>
                                </button>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>{blog.views || 0}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>{blog.commentsCount || 0}</span>
                                </span>
                              </div>
                              <span className="text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(blog.createdAt)}
                              </span>
                            </div>

                            {/* Author */}
                            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-700 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <User className="w-3 h-3" />
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
                  </>
                ) : (
                  <div className="text-center py-12 md:py-16">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold mb-2">{t.noBlogsTitle}</h3>
                    <p className="text-gray-400 mb-6">
                      {selectedCategory !== 'all' 
                        ? `No blogs found in category "${selectedCategory}"`
                        : t.noBlogsMessage}
                    </p>
                    {selectedCategory !== 'all' ? (
                      <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
                      >
                        <X className="w-5 h-5" />
                        <span>{t.clearFilters}</span>
                      </button>
                    ) : (
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
                      >
                        <Plus className="w-5 h-5" />
                        <span>{t.generateSummary}</span>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </Suspense>

          {/* Pagination */}
          {pagination.totalPages > 1 && blogsWithSafeImages.length > 0 && (
            <div className="mt-8 md:mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-400 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>
                    {t.showing} {((pagination.currentPage - 1) * params.limit) + 1}-
                    {Math.min(pagination.currentPage * params.limit, pagination.totalItems)} {t.of} {pagination.totalItems} {t.blogs}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => updateParams({ page: pagination.currentPage - 1 })}
                    disabled={!pagination.hasPrevPage}
                    className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition duration-200 flex items-center gap-1 ${
                      pagination.hasPrevPage
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    <span className="hidden sm:inline">{t.previous}</span>
                  </button>
                  
                  <div className="flex items-center gap-1 md:gap-2">
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
                          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg transition duration-200 flex items-center justify-center ${
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
                    className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition duration-200 flex items-center gap-1 ${
                      pagination.hasNextPage
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">{t.next}</span>
                    {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {blogsWithSafeImages.length > 0 && (
            <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gray-800/30 rounded-xl border border-gray-700">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center">📊 {t.categories} Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center p-3 md:p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">
                    {statsData.totalBlogs}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.totalBlogs}</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400">
                    {statsData.totalCategories}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.categories}</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-green-400">
                    {statsData.featuredBlogs}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.featuredBlogs}</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                    {statsData.avgDaily}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{t.avgDaily}</div>
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