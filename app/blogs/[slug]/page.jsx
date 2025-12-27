"use client"

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useSingleBlog } from '@/lib/hooks/useBlogs';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  Check, 
  ChevronUp, 
  Printer, 
  Download, 
  Clock, 
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Calendar,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  Link2,
  ArrowLeft
} from 'lucide-react';

// SVG data URL for fallback image
const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="#1f2937"/>
    <rect x="50" y="50" width="200" height="350" fill="#374151" stroke="#4b5563" stroke-width="2"/>
    <text x="150" y="180" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="24">Book Cover</text>
    <text x="150" y="220" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16">No image available</text>
  </svg>
`)}`;

// Create a safe image URL function
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

// Calculate reading time
const calculateReadingTime = (text) => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time;
};

const BlogDetailClientComponent = ({ slug }) => {
  const params = useParams();
  const blogSlug = slug || params?.slug;
  
  const { blog, loading, error, likeBlog, addComment } = useSingleBlog(blogSlug);
  
  // State management
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copyLinkText, setCopyLinkText] = useState('Copy Link');

  // Memoize handlers for performance
  const handleLike = useCallback(async () => {
    try {
      await likeBlog();
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  }, [likeBlog]);

  const handleSubmitComment = useCallback(async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      setSubmittingComment(true);
      await addComment(comment, username || 'Anonymous Reader');
      setComment('');
      setUsername('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  }, [comment, username, addComment]);

  const copyToClipboard = useCallback((text, type = 'link') => {
    navigator.clipboard.writeText(text);
    
    if (type === 'link') {
      setCopyLinkText('Copied!');
      setTimeout(() => setCopyLinkText('Copy Link'), 2000);
    } else {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(''), 2000);
    }
  }, []);

  const shareBlog = useCallback(async (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog?.title || 'Check out this book summary!';
    const text = `Check out this book summary: ${title}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url
        });
      } catch (err) {
        console.log('Native share cancelled or failed');
      }
    } else if (shareUrls[platform] && typeof window !== 'undefined') {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
    
    setShowShareMenu(false);
  }, [blog]);

  const handleExport = useCallback((format) => {
    if (!blog) return;
    
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${blog.title} - Book Summary</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
              color: #333;
            }
            h1 { color: #2563eb; }
            .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
            .content { margin-top: 30px; }
            code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
            pre { background: #2d2d2d; color: #fff; padding: 15px; border-radius: 6px; overflow-x: auto; }
            .print-only { display: block; }
            .no-print { display: none; }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <h1>${blog.title}</h1>
          <div class="meta">
            <p><strong>By:</strong> ${blog.user?.username || 'Anonymous'} | 
               <strong>Date:</strong> ${new Date(blog.createdAt).toLocaleDateString()} | 
               <strong>Category:</strong> ${blog.category || 'Uncategorized'}</p>
          </div>
          <hr>
          <div class="content">
            ${blog.content || blog.aiResponse || 'No content available'}
          </div>
          <div class="no-print">
            <p style="margin-top: 40px; color: #666; font-size: 0.8em;">
              Exported from Book Summaries & Reviews
            </p>
          </div>
        </body>
      </html>
    `;

    if (format === 'print') {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(content);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else if (format === 'html') {
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${blog.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    setShowExportMenu(false);
  }, [blog]);

  // Get safe image URL
  const safeThumbnailUrl = useMemo(() => {
    if (!blog?.bookDetails?.safeThumbnail) return PLACEHOLDER_SVG;
    return getSafeImageUrl(blog.bookDetails.safeThumbnail);
  }, [blog]);

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    if (!blog?.createdAt) return '';
    return new Date(blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [blog]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!blog) return 0;
    const content = blog.content || '';
    const summary = blog.aiResponse || '';
    return calculateReadingTime(content + ' ' + summary);
  }, [blog]);

  // Enhanced ReactMarkdown component with code highlighting (simplified)
  const EnhancedReactMarkdown = useCallback(({ children }) => {
    const copyCode = (codeString) => {
      navigator.clipboard.writeText(codeString);
      setCopiedCode(codeString);
      setTimeout(() => setCopiedCode(''), 2000);
    };

    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <div className="relative group my-4">
                <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyCode(codeString)}
                    className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeString ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
                <div className="absolute left-3 top-3 text-xs text-gray-400 font-mono">
                  {match[1]}
                </div>
                <pre className="bg-gray-900/50 rounded-lg p-4 pt-10 overflow-x-auto text-sm">
                  <code className={`language-${match[1]} font-mono`}>
                    {codeString}
                  </code>
                </pre>
              </div>
            ) : (
              <code className={`px-1.5 py-0.5 bg-gray-800 rounded text-sm font-mono ${className}`} {...props}>
                {children}
              </code>
            );
          },
          h2({ children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>;
          }
        }}
      >
        {children}
      </ReactMarkdown>
    );
  }, [copiedCode]);

  // Extract headings from content
  useEffect(() => {
    if (!blog?.content) return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, 'text/html');
    const h2s = Array.from(doc.querySelectorAll('h2, h3'));
    
    const extractedHeadings = h2s.map((heading, index) => {
      const id = String(heading.textContent).toLowerCase().replace(/\s+/g, '-');
      return {
        id,
        text: heading.textContent,
        level: heading.tagName,
        index
      };
    });
    
    setHeadings(extractedHeadings);
  }, [blog?.content]);

  // Intersection Observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px', threshold: 0.1 }
    );
    
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [headings]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + L to like
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        handleLike();
      }
      // Alt + C to focus comment
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.querySelector('textarea')?.focus();
      }
      // Escape to close menus
      if (e.key === 'Escape') {
        if (showShareMenu) setShowShareMenu(false);
        if (showExportMenu) setShowExportMenu(false);
        if (showMarkdownHelp) setShowMarkdownHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLike, showShareMenu, showExportMenu, showMarkdownHelp]);

  // Table of Contents Component
  const TableOfContents = useMemo(() => {
    if (headings.length === 0) return null;
    
    return (
      <div className="sticky top-24 ml-8 hidden xl:block w-64">
        <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <h4 className="font-bold mb-3 text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Contents
          </h4>
          <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-sm transition duration-200 hover:translate-x-1 ${
                  activeHeading === heading.id
                    ? 'text-blue-400 font-medium border-l-2 border-blue-400 pl-3 -ml-0.5'
                    : 'text-gray-400 hover:text-white pl-4'
                } ${heading.level === 'H3' ? 'ml-4 text-xs' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
              >
                {heading.text}
              </a>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Reading Progress</span>
                <span>{Math.round(readingProgress)}%</span>
              </div>
              <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [headings, activeHeading, readingProgress]);

  // Early return for loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div className="aspect-[2/3] bg-gray-700 rounded-xl"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="h-10 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Early return for error state
  if (error || !blog) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-gray-400 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Browse All Blogs</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.title} - Book Summaries & Reviews</title>
        <meta name="description" content={blog.excerpt || blog.aiResponse?.substring(0, 160) || "Book summary and review"} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || ""} />
        <meta property="og:image" content={blog.bookDetails?.thumbnail || "/default-og.png"} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:author" content={blog.user?.username || "Anonymous"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt || ""} />
        <meta name="twitter:image" content={blog.bookDetails?.thumbnail || "/default-og.png"} />
      </Head>
      
      <Header />
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={readingProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Blogs</span>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="relative overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-gray-900" />
            <div className="relative">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Book Cover */}
                <div className="w-full lg:w-1/3">
                  <div className="sticky top-24">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-gray-800">
                      <Image
                        src={safeThumbnailUrl}
                        alt={blog.bookDetails?.title || 'Book cover'}
                        fill
                        priority
                        className={`object-cover transition duration-500 ${
                          safeThumbnailUrl === PLACEHOLDER_SVG ? 'p-4' : ''
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={safeThumbnailUrl === PLACEHOLDER_SVG}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%231f2937'/%3E%3Crect x='50' y='50' width='200' height='350' fill='%23374151'/%3E%3C/svg%3E"
                      />
                    </div>
                    
                  </div>
                </div>

                {/* Blog Info */}
                <div className="flex-1">
                  {/* Category and Reading Time */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full">
                      {blog.category || 'Uncategorized'}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {blog.title}
                  </h1>

                  {/* Book Details */}
                  {blog.bookDetails && (
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Book Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-gray-300">
                          <span className="font-medium text-gray-400">Title:</span> {blog.bookDetails.title}
                        </p>
                        {blog.bookDetails.author && (
                          <p className="text-gray-300">
                            <span className="font-medium text-gray-400">Author:</span> {blog.bookDetails.author}
                          </p>
                        )}
                        {blog.bookDetails.publishedYear && (
                          <p className="text-gray-300">
                            <span className="font-medium text-gray-400">Published:</span> {blog.bookDetails.publishedYear}
                          </p>
                        )}
                        {blog.bookDetails.pageCount && (
                          <p className="text-gray-300">
                            <span className="font-medium text-gray-400">Pages:</span> {blog.bookDetails.pageCount}
                          </p>
                        )}
                        {blog.bookDetails.genre && (
                          <p className="text-gray-300">
                            <span className="font-medium text-gray-400">Genre:</span> {blog.bookDetails.genre}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Author and Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="font-bold text-lg">
                          {blog.user?.username?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{blog.user?.username || 'Anonymous'}</p>
                        <p className="text-sm text-gray-400">Author</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 group ${
                          blog.liked
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        aria-label="Like this post"
                        title="Alt + L to like"
                      >
                        <Heart className={`w-5 h-5 ${blog.liked ? 'fill-red-400' : ''}`} />
                        <span className="font-medium">{blog.likesCount || 0}</span>
                      </button>

                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg" aria-label="Views">
                        <Eye className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{blog.views || 0}</span>
                      </div>

                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg" aria-label="Comments">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{blog.commentsCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Share and Export Actions */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-200"
                        aria-label="Share options"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                      
                      {showShareMenu && (
                        <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                          <div className="p-2">
                            <button
                              onClick={() => {
                                copyToClipboard(window.location.href, 'link');
                                setShowShareMenu(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-lg flex items-center gap-3"
                            >
                              <Link2 className="w-4 h-4" />
                              {copyLinkText}
                            </button>
                            <button
                              onClick={() => shareBlog('twitter')}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-lg flex items-center gap-3"
                            >
                              <Twitter className="w-4 h-4 text-blue-400" />
                              Twitter
                            </button>
                            <button
                              onClick={() => shareBlog('facebook')}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-lg flex items-center gap-3"
                            >
                              <Facebook className="w-4 h-4 text-blue-500" />
                              Facebook
                            </button>
                            <button
                              onClick={() => shareBlog('linkedin')}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-lg flex items-center gap-3"
                            >
                              <Linkedin className="w-4 h-4 text-blue-300" />
                              LinkedIn
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-200"
                        aria-label="Export options"
                      >
                        <Download className="w-5 h-5" />
                        <span>Export</span>
                      </button>
                      
                      {showExportMenu && (
                        <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                          <button
                            onClick={() => handleExport('print')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-t-lg flex items-center gap-3"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-full transition duration-200 cursor-default"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content with Table of Contents */}
          <div className="flex">
            <div className="flex-1">
              {/* AI Summary */}
              <div className="mb-12" id="ai-summary">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold">AI Summary</h2>
                </div>
                <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
                  <div className="prose prose-lg prose-invert max-w-none text-gray-200 leading-relaxed">
                    {blog.aiResponse || blog.summary ? (
                      <EnhancedReactMarkdown>{blog.aiResponse || blog.summary}</EnhancedReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">No AI summary available.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Content */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold">Full Analysis</h2>
                </div>
                <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
                    {blog.content ? (
                      <EnhancedReactMarkdown>{blog.content}</EnhancedReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">No content available.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mb-12" id="comments">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold">Comments ({blog.commentsCount || 0})</h2>
                </div>

                {/* Add Comment Form */}
                <div className="mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Add Your Comment
                  </h3>
                  <form onSubmit={handleSubmitComment}>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your name (optional)"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        aria-label="Your name"
                        title="Press Alt + C to focus"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Markdown supported</span>
                        <button
                          type="button"
                          onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          {showMarkdownHelp ? 'Hide Help' : 'Need help?'}
                        </button>
                      </div>
                      {showMarkdownHelp && (
                        <div className="mb-3 p-3 bg-gray-900/50 rounded-lg text-sm">
                          <p className="text-gray-400 mb-2">Formatting help:</p>
                          <ul className="space-y-1 text-gray-500">
                            <li><code>**bold**</code> → <strong>bold</strong></li>
                            <li><code>*italic*</code> → <em>italic</em></li>
                            <li><code>`code`</code> → <code>code</code></li>
                            <li><code># Heading</code> → Large heading</li>
                          </ul>
                        </div>
                      )}
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this book summary... (Markdown supported)"
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                        aria-label="Your comment"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={submittingComment || !comment.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        aria-label="Post comment"
                      >
                        <Send className="w-4 h-4" />
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                      <span className="text-sm text-gray-400">
                        {comment.length}/5000 characters
                      </span>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {blog.comments && blog.comments.length > 0 ? (
                    blog.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="p-6 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-gray-600 transition duration-200"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
                              <span className="font-bold">
                                {comment.username?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{comment.username || 'Anonymous'}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(comment.timestamp || comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(comment.content, 'code')}
                            className="p-2 text-gray-400 hover:text-white"
                            aria-label="Copy comment"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{comment.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-800 rounded-xl">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No comments yet.</p>
                      <p className="text-sm mt-2">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Blogs */}
              {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-8 bg-gradient-to-b from-pink-500 to-red-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold">Related Summaries</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blog.relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog._id}
                        href={`/blogs/${relatedBlog.slug}`}
                        className="group"
                        aria-label={`Read ${relatedBlog.title}`}
                      >
                        <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-xl hover:shadow-blue-900/10">
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition duration-200 line-clamp-2">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            {new Date(relatedBlog.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {relatedBlog.excerpt || ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table of Contents Sidebar */}
            {TableOfContents}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 group"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
};

export default BlogDetailClientComponent;