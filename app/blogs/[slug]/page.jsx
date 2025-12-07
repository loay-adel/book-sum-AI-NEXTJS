"use client"

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useSingleBlog } from '@/lib/hooks/useBlogs';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';



const BlogDetailClientComponent = ({ slug }) => {
  const params = useParams();

  const blogSlug = slug || params?.slug;
  
  const { blog, loading, error, likeBlog, addComment } = useSingleBlog(blogSlug);
  
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = async () => {
    try {
      await likeBlog();
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleSubmitComment = async (e) => {
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
  };

  const shareBlog = async (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this book summary!';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
    
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
              <span>Browse All Blogs</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-gray-900" />
          <div className="max-w-4xl mx-auto px-4 py-12 relative">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Book Cover */}
              {blog.bookDetails?.thumbnail && (
                <div className="w-full md:w-1/3">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
<Image
  src={blog.bookDetails.thumbnail}
  alt={blog.bookDetails.title}
  fill
  className="object-cover group-hover:scale-105 transition duration-500"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
                  </div>
                </div>
              )}

              {/* Blog Info */}
              <div className="flex-1">
                {/* Category */}
                <span className="inline-block px-4 py-1 text-sm bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-full mb-4">
                  {blog.category}
                </span>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {blog.title}
                </h1>

                {/* Book Details */}
                {blog.bookDetails && (
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Book Information</h3>
                    <p className="text-gray-300">
                      <span className="font-medium">Title:</span> {blog.bookDetails.title}
                    </p>
                    {blog.bookDetails.author && (
                      <p className="text-gray-300">
                        <span className="font-medium">Author:</span> {blog.bookDetails.author}
                      </p>
                    )}
                    {blog.bookDetails.publishedYear && (
                      <p className="text-gray-300">
                        <span className="font-medium">Published:</span> {blog.bookDetails.publishedYear}
                      </p>
                    )}
                    {blog.bookDetails.pageCount && (
                      <p className="text-gray-300">
                        <span className="font-medium">Pages:</span> {blog.bookDetails.pageCount}
                      </p>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="font-bold">
                        {blog.user?.username?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{blog.user?.username || 'Anonymous'}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                        blog.liked
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl">♥</span>
                      <span>{blog.likesCount || 0}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-xl">👁️</span>
                      <span>{blog.views || 0}</span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-200"
                      >
                        <span className="text-xl">↗</span>
                        <span>Share</span>
                      </button>
                      
                      {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                          <button
                            onClick={() => shareBlog('twitter')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-t-lg flex items-center gap-3"
                          >
                            <span className="text-blue-400">𝕏</span>
                            Twitter
                          </button>
                          <button
                            onClick={() => shareBlog('facebook')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3"
                          >
                            <span className="text-blue-500">f</span>
                            Facebook
                          </button>
                          <button
                            onClick={() => shareBlog('linkedin')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3"
                          >
                            <span className="text-blue-300">in</span>
                            LinkedIn
                          </button>
                          <button
                            onClick={() => shareBlog('whatsapp')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-3"
                          >
                            <span className="text-green-500">✓</span>
                            WhatsApp
                          </button>
                          <button
                            onClick={() => shareBlog('telegram')}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-b-lg flex items-center gap-3"
                          >
                            <span className="text-blue-400">✈</span>
                            Telegram
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-gray-800 rounded-full"
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          {/* AI Summary */}
<div className="mb-12">
  <div className="flex items-center gap-3 mb-6">
    <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
    <h2 className="text-2xl font-bold">AI Summary</h2>
  </div>
  <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700">
    <div className="prose prose-lg prose-invert max-w-none text-gray-200 leading-relaxed">
      <ReactMarkdown>{blog.aiResponse || blog.summary}</ReactMarkdown>
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
      <ReactMarkdown>{blog.content}</ReactMarkdown>
    </div>
  </div>
</div>

          {/* Comments Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-bold">Comments ({blog.commentsCount || 0})</h2>
            </div>

            {/* Add Comment Form */}
            <div className="mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add Your Comment</h3>
              <form onSubmit={handleSubmitComment}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this book summary..."
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-800/30 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-start gap-4 mb-4">
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
                    <p className="text-gray-300 whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>

          {/* Related Blogs */}
          {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
            <div>
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
                  >
                    <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-blue-500 transition duration-300">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition duration-200">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(relatedBlog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogDetailClientComponent;