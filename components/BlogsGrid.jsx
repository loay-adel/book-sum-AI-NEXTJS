"use client";

import Link from 'next/link';
import { Eye, MessageCircle, Heart, Calendar, User } from 'lucide-react';

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

// Image component
const BlogImage = ({ src, alt, index }) => {
  return (
    <div className="absolute inset-0">
      <img
        src={src}
        alt={alt}
        className="object-contain p-2 group-hover:scale-105 transition duration-500 w-full h-full"
        style={{ objectPosition: 'center' }}
        loading={index < 4 ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, index, lang, translations: t, onLike }) => {
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

  const safeThumbnail = blog.bookDetails?.thumbnail ? 
    getSafeImageUrl(blog.bookDetails.thumbnail) : PLACEHOLDER_SVG;

  const handleLike = (e) => {
    e.stopPropagation();
    onLike(blog.id, e);
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-2xl hover:shadow-blue-900/20 group flex flex-col h-full">
      {/* Book Cover */}
      <Link href={`/blogs/${blog.slug}`} className="block">
        <div className="relative w-full pt-[150%] overflow-hidden">
          <BlogImage 
            src={safeThumbnail}
            alt={blog.bookDetails?.title || t.bookCover || "Book Cover"}
            index={index}
          />
          
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
              onClick={handleLike}
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
              {blog.isAutoGenerated ? (t.aiGenerated || 'AI Generated') : (t.community || 'Community')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const BlogSkeleton = () => (
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

// Empty state
const EmptyState = ({ selectedCategory, lang, translations: t, onClearFilters }) => {
  const { Plus, X } = require('lucide-react');
  const Link = require('next/link').default;

  return (
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
          onClick={onClearFilters}
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
          <span>{t.generateSummary || "Generate Summary"}</span>
        </Link>
      )}
    </div>
  );
};

// Main BlogsGrid Component
const BlogsGrid = ({ 
  blogs, 
  loading, 
  selectedCategory, 
  pagination, 
  params,
  likeBlog,
  updateParams,
  lang = "en",
  translations = {}
}) => {
  
  const handleClearFilters = () => {
    updateParams({
      category: null,
      sortBy: 'newest',
      page: 1
    });
  };

  if (loading && blogs.length === 0) {
    return <BlogSkeleton />;
  }

  if (blogs.length === 0) {
    return (
      <EmptyState 
        selectedCategory={selectedCategory}
        lang={lang}
        translations={translations}
        onClearFilters={handleClearFilters}
      />
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        {translations.showing} {blogs.length} {translations.of} {pagination.totalItems} {translations.blogs}
        {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {blogs.map((blog, index) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            index={index}
            lang={lang}
            translations={translations}
            onLike={likeBlog}
          />
        ))}
      </div>
    </>
  );
};

export default BlogsGrid;