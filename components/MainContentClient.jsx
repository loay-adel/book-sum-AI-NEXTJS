"use client";
import { useState, useRef, useEffect } from "react";
import { useBookSearch } from "@/lib/hooks/useBookSearch";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { useCategories } from "@/lib/hooks/useCategories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useUserData } from '@/lib/hooks/useUserData';
import {  ExternalLink, Download, Clipboard } from 'lucide-react';
import { api } from '@/lib/api';
import Header from "./Header";

const contentDict = {
  en: {
    search: "Search Book",
    upload: "Upload PDF",
    categories: "Categories",
    placeholder: "Enter book name...",
    submit: "Submit",
    searchResults: "Search Results",
    uploadResults: "PDF Summary",
    categoryBooks: "Books in",
    buyLink: "Buy this book",
    recommendations: "Recommendations",
    loading: "Loading...",
    error: "Error",
    selectCategory: "Select a category",
    noFileSelected: "No file selected",
    selectFile: "Select PDF file",
    summary: "Summary",
    by: "by",
    libraryTitle: "Book Summarizer",
    librarySubtitle: "Discover, read and explore thousands of books with AI-powered summaries",
    quickActions: "Quick Actions",
    popularCategories: "Popular Categories",
    recentlyAdded: "Recently Added",
    trendingNow: "Trending Now",
    processing: "Processing...",
    searching: "Searching",
    finalizing: "Finalizing",
    copySummary: "Copy Summary",
    downloadSummary: "Download Summary",
    saveForLater: "Save for Later",
    waiting: "Waiting...",
    complete: "Complete!"
  },
  ar: {
    search: "ابحث عن كتاب",
    upload: "رفع ملف PDF",
    categories: "التصنيفات",
    placeholder: "اكتب اسم الكتاب...",
    submit: "تأكيد",
    searchResults: "نتائج البحث",
    uploadResults: "ملخص PDF",
    categoryBooks: "كتب في",
    buyLink: "شراء هذا الكتاب",
    recommendations: "التوصيات",
    loading: "جاري التحميل...",
    error: "خطأ",
    selectCategory: "اختر تصنيفاً",
    noFileSelected: "لم يتم اختيار ملف",
    selectFile: "اختر ملف PDF",
    summary: "ملخص",
    by: "بواسطة",
    libraryTitle: "ملخص الكتب",
    librarySubtitle: "اكتشف واقرأ واستكشف الآلاف من الكتب مع ملخصات مدعومة بالذكاء الاصطناعي",
    quickActions: "إجراءات سريعة",
    popularCategories: "التصنيفات الشائعة",
    recentlyAdded: "المضاف حديثاً",
    trendingNow: "الأكثر شهرة الآن",
    processing: "جاري المعالجة...",
    searching: "جاري البحث",
    finalizing: "جاري الانتهاء",
    copySummary: "نسخ الملخص",
    downloadSummary: "تحميل الملخص",
    saveForLater: "حفظ للمستقبل",
    waiting: "في الانتظار...",
    complete: "اكتمل!"
  }
};

export const MainContentClient = ({ lang = "en", dictionary }) => { 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef(null);
  


    useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { 
    addSearch, 
    saveSummary, 
    searchHistory, 
    savedSummaries,
    userData 
  } = useUserData();
  
  // Use your custom hooks
  const {
    results: searchResults,
    loading: searchLoading,
    currentStep: searchStep,
    progress: searchProgress,
    error: searchError,
    searchBook,
  } = useBookSearch(lang);
  
  const {
    results: uploadResults,
    loading: uploadLoading,
    currentStep: uploadStep,
    progress: uploadProgress,
    error: uploadError,
    uploadFile,
  } = useFileUpload(lang);
  
  const {
    categories,
    selectedCategory,
    books: categoryBooks,
    loading: categoriesLoading,
    error: categoriesError,
    selectCategory,
  } = useCategories(lang);

  const dict = dictionary?.home || contentDict[lang] || contentDict.en;

    if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      try {
        await searchBook(searchQuery);
      } catch (error) {
        console.log('❌ Search failed:', error);
      }
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      try {
        await uploadFile(selectedFile);
      } catch (error) {
        console.log('❌ Upload failed:', error);
      }
    }
  };

  const copySummary = async () => {
    const results = searchResults || uploadResults;
    if (!results) return;

    const shareText = `${dict.summary}: ${results.book?.title} ${dict.by} ${results.book?.author}\n\n${results.summary?.substring(0, 200)}...`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dict.summary}: ${results.book?.title}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText)
        .then(() => alert(lang === "en" ? "Summary copied to clipboard!" : "تم نسخ الملخص إلى الحافظة!"))
        .catch(err => console.error('Copy failed:', err));
    }
  };

  const downloadSummary = () => {
    const results = searchResults || uploadResults;
    if (!results) return;

    const content = `
${dict.summary}: ${results.book?.title}
${dict.by}: ${results.book?.author}
${new Date().toLocaleDateString()}

${results.summary}

${dict.recommendations}:
${(results.recommendations || []).map(book => `• ${book.title} ${dict.by} ${book.author}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.book?.title || 'summary'}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleCategorySelect = (categoryId) => {
    selectCategory(categoryId);
  };

  const handleBookSelect = (bookTitle) => {
    setSearchQuery(bookTitle);
    setActiveTab("search");
    setTimeout(() => {
      searchBook(bookTitle);
    }, 300);
  };

  const clearResults = () => {
    setSearchQuery("");
    setSelectedFile(null);
  };

  const SpinnerWithPercentage = ({ progress, size = "medium", currentLang = "en" }) => {
    const sizes = {
      small: "w-16 h-16",
      medium: "w-20 h-20",
      large: "w-24 h-24"
    };

    const strokeWidth = 4;
    const radius = {
      small: 30,
      medium: 38,
      large: 46
    }[size];
    
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const spinnerDict = contentDict[currentLang] || contentDict.en;

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Background circle */}
          <svg className={sizes[size]} viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#374151"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#3B82F6"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm">
          {progress < 100 ? spinnerDict.processing : spinnerDict.complete}
        </p>
      </div>
    );
  };

  const renderBookCard = (book, index, showAuthor = true) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-700 hover:border-purple-500 group"
      onClick={() => handleBookSelect(book.title)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
            {book.title}
          </h4>
          {showAuthor && book.author && (
            <p className="text-sm text-gray-400 mt-1">
              {dict.by} {book.author}
            </p>
          )}
          {book.pageCount && (
            <p className="text-xs text-gray-500 mt-2">
              {book.pageCount} {lang === "en" ? "pages" : "صفحة"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderResults = (results, loading, error, type, progress = 0, currentStep = "") => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-8 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700"
        >
          <div className="text-center space-y-6">
            {/* Spinner with percentage */}
            <SpinnerWithPercentage progress={progress} size="large" currentLang={lang} />
            
            {/* Current step - only show if available */}
            {currentStep && (
              <div className="text-purple-300 font-medium text-lg">
                {currentStep}
              </div>
            )}
            
            {/* Loading steps with dynamic highlighting */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`p-3 rounded-lg transition-all ${
                progress >= 25 ? 'bg-green-900/30 text-green-400 border border-green-700' : 
                'bg-gray-800 text-gray-500 border border-gray-700'
              }`}>
                <div className="text-sm font-medium">
                  {progress < 25 ? 
                    dict.waiting : 
                    dict.searching
                  }
                </div>
              </div>
              <div className={`p-3 rounded-lg transition-all ${
                progress >= 60 ? 'bg-green-900/30 text-green-400 border border-green-700' : 
                'bg-gray-800 text-gray-500 border border-gray-700'
              }`}>
                <div className="text-sm font-medium">
                  {progress < 60 ? 
                    dict.waiting : 
                    dict.processing
                  }
                </div>
              </div>
              <div className={`p-3 rounded-lg transition-all ${
                progress >= 90 ? 'bg-green-900/30 text-green-400 border border-green-700' : 
                'bg-gray-800 text-gray-500 border border-gray-700'
              }`}>
                <div className="text-sm font-medium">
                  {progress < 90 ? 
                    dict.waiting : 
                    dict.finalizing
                  }
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 bg-red-900/20 rounded-xl border border-red-800/50"
        >
          <svg
            className="w-12 h-12 mx-auto text-red-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-red-300">
            {dict.error}: {error}
          </p>
          <Button
            onClick={clearResults}
            className="mt-4 bg-gray-700 hover:bg-gray-600"
          >
            {lang === "en" ? "Try Again" : "حاول مرة أخرى"}
          </Button>
        </motion.div>
      );
    }

    if (!results) return null;

    // Calculate unique recommendations
    const uniqueRecommendations = results.recommendations 
      ? results.recommendations.filter((rec, index, self) => 
          index === self.findIndex(r => 
            r.title === rec.title && r.author === rec.author
          )
        )
      : [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6 mt-4">
          <h3 className="text-2xl font-bold text-white">
            {type === "search" ? dict.searchResults : dict.uploadResults}
          </h3>
        </div>

        {results.book?.thumbnail && (
          <div className="mb-6 flex justify-center">
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={results.book.thumbnail}
              alt="Book cover"
              className="rounded-xl shadow-lg max-h-80 object-contain border border-gray-600"
            />
          </div>
        )}

        {results.summary && (
          <div className="mb-8">
            <h4 className="font-semibold text-purple-300 mb-3 text-lg">
              {dict.summary}:
            </h4>
            <div className="prose prose-invert max-w-none bg-gray-800/60 p-5 rounded-xl shadow-inner text-gray-200">
              <ReactMarkdown>{results.summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Action buttons footer */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {results.amazonLink && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={results.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {dict.buyLink}
            </motion.a>
          )}
          
          <Button
            onClick={copySummary}
            variant="outline"
            size="sm"
            className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
          >
            <Clipboard className="w-4 h-4 mr-2" />
            {dict.copySummary}
          </Button>
          
          <Button
            onClick={downloadSummary}
            variant="outline"
            size="sm"
            className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {dict.downloadSummary}
          </Button>
        </div>

        {uniqueRecommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-purple-300 mb-4 text-lg">
              {dict.recommendations}:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uniqueRecommendations.map((book, index) =>
                renderBookCard(book, index)
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
        <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pb-4"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Header lang={lang}/>
    <main className="flex-grow flex items-center justify-center relative z-10 py-8 px-4 mt-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-6xl bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-300 border border-gray-700">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 bg-300% animate-gradient"
          >
            {dict.libraryTitle}
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {dict.librarySubtitle}
          </p>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              activeTab === "search"
                ? "bg-blue-900/30 border border-blue-700"
                : "bg-gray-800/50 hover:bg-gray-800/70"
            }`}
            onClick={() => setActiveTab("search")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-700 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <span className="text-white font-medium">
                {dict.search}
              </span>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              activeTab === "upload"
                ? "bg-purple-900/30 border border-purple-700"
                : "bg-gray-800/50 hover:bg-gray-800/70"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-700 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <span className="text-white font-medium">
                {dict.upload}
              </span>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              activeTab === "categories"
                ? "bg-green-900/30 border border-green-700"
                : "bg-gray-800/50 hover:bg-gray-800/70"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-700 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-white font-medium">
                {dict.categories}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {/* Search Tab */}
            {activeTab === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col md:flex-row gap-3 mb-6"
                >
                  <Input
                    placeholder={dict.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    type="submit"
                    disabled={searchLoading || !searchQuery.trim()}
                    className="py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    {searchLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {dict.loading}
                      </div>
                    ) : (
                      dict.submit
                    )}
                  </Button>
                </form>

                {renderResults(
                  searchResults,
                  searchLoading,
                  searchError,
                  "search",
                  searchProgress,
                  searchStep
                )}

                {!searchResults && !searchLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 grid grid-cols-1 gap-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {dict.popularCategories}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-center"
                            onClick={() => {
                              setActiveTab("categories");
                              handleCategorySelect(category.id);
                            }}
                          >
                            <span className="text-white text-sm">
                              {category[lang === "en" ? "name" : "name_ar"]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleFileUpload} className="space-y-6">
                  <div
                    className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-500 cursor-pointer bg-gray-800/50 hover:bg-gray-800/70"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />
                    <div className="py-6">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-500 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="text-gray-400 mb-2">
                        {selectedFile
                          ? selectedFile.name
                          : dict.noFileSelected}
                      </p>
                      <button
                        type="button"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        {dict.selectFile}
                      </button>
                      <p className="text-gray-500 text-sm mt-2">
                        {lang === "en"
                          ? "Supported format: PDF (max 10MB)"
                          : "الصيغ المدعومة: PDF (الحد الأقصى 10 ميجابايت)"}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!selectedFile || uploadLoading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadLoading ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {dict.loading}
                      </div>
                    ) : (
                      dict.submit
                    )}
                  </Button>
                </form>

                {renderResults(
                  uploadResults,
                  uploadLoading,
                  uploadError,
                  "upload",
                  uploadProgress,
                  uploadStep
                )}
              </motion.div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {categoriesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center space-y-4">
                      <SpinnerWithPercentage progress={75} size="medium" currentLang={lang} />
                      <p className="text-gray-400">Loading categories...</p>
                    </div>
                  </div>
                ) : categoriesError ? (
                  <div className="text-center py-8 bg-red-900/30 rounded-xl border border-red-800/50">
                    <p className="text-lg font-medium text-red-300">
                      {dict.error}: {categoriesError}
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-purple-300 mb-6">
                      {dict.selectCategory}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full py-4 ${
                            selectedCategory?.id === category.id
                              ? "bg-green-700 text-white"
                              : "bg-gray-800 text-gray-200"
                          } hover:bg-green-700 hover:text-white transition-all duration-300 border border-gray-700`}
                        >
                          {category[lang === "en" ? "name" : "name_ar"]}{" "}
                        </Button>
                      ))}
                    </div>

                    {selectedCategory && (
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-semibold text-purple-300">
                            {dict.categoryBooks}{" "}
                            {
                              selectedCategory[
                                lang === "en" ? "name" : "name_ar"
                              ]
                            }
                          </h3>
                          <span className="text-gray-400 text-sm">
                            {categoryBooks.length}{" "}
                            {lang === "en" ? "books" : "كتاب"}
                          </span>
                        </div>

                        {categoryBooks.length === 0 ? (
                          <div className="text-center py-12 bg-gray-800/30 rounded-xl">
                            <svg
                              className="w-16 h-16 mx-auto text-gray-500 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477 4.5 1.253"
                              ></path>
                            </svg>
                            <p className="text-gray-500">
                              {lang === "en"
                                ? "No books found in this category"
                                : "لم يتم العثور على كتب في هذا التصنيف"}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryBooks.map((book) => (
                              <motion.div
                                key={book.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-gray-800/70 transition-all cursor-pointer border border-gray-700 hover:border-purple-500"
                                onClick={() => handleBookSelect(book.title)}
                              >
                                <div className="relative overflow-hidden rounded-lg mb-3">
                                  {book.thumbnail ? (
                                    <img
                                      src={book.thumbnail}
                                      alt={book.title}
                                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                      <svg
                                        className="w-12 h-12 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477 4.5 1.253"
                                        ></path>
                                      </svg>
                                    </div>
                                  )}
                                  {book.published_year && (
                                    <p className="float-right text-white group-hover:text-purple-300">
                                      {book.published_year}
                                    </p>
                                  )}
                                </div>
                                <h4 className="font-medium text-white text-sm mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                  {book.title}
                                </h4>
                                {book.author && (
                                  <p className="text-xs text-gray-400 line-clamp-1">
                                    {dict.by} {book.author}
                                  </p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* قسم تعليمي لتحسين SEO ونسبة النص */}
        <section className="mt-24 max-w-5xl mx-auto px-4 border-t border-gray-800 pt-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">
                {lang === "en" ? "Elevate Your Learning with AI Summaries" : "ارتقِ بتعليمك مع ملخصات الذكاء الاصطناعي"}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {lang === "en" 
                  ? "Our platform leverages advanced Natural Language Processing to distill complex manuscripts into actionable insights. This methodology isn't just about shortening text; it's about identifying semantic patterns and core arguments that define a book's unique value proposition."
                  : "تعتمد منصتنا على معالجة اللغات الطبيعية المتقدمة لتقطير المخطوطات المعقدة وتحويلها إلى رؤى قابلة للتنفيذ. هذه المنهجية لا تقتصر فقط على تقصير النص، بل تتعلق بتحديد الأنماط الدلالية والحجج الأساسية التي تحدد قيمة الكتاب الفريدة."}
              </p>
            </div>
            
            <div className="bg-gray-800/30 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">
                {lang === "en" ? "How to use these summaries?" : "كيف تستخدم هذه الملخصات؟"}
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">01.</span>
                  <p>{lang === "en" ? "Pre-reading: Get an overview before committing to the full book." : "القراءة التمهيدية: احصل على نظرة عامة قبل الالتزام بقراءة الكتاب كاملاً."}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">02.</span>
                  <p>{lang === "en" ? "Review: Refresh your memory on key concepts of books you've already read." : "المراجعة: جدد ذاكرتك حول المفاهيم الأساسية للكتب التي قرأتها بالفعل."}</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">03.</span>
                  <p>{lang === "en" ? "Decision Making: Quickly compare different perspectives on a single topic." : "اتخاذ القرار: قارن بسرعة بين وجهات نظر مختلفة حول موضوع واحد."}</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="mt-20 mb-10 max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {lang === "en" ? "Deep Dive into our Technology" : "تعمق في تقنيتنا"}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="text-blue-400 font-medium mb-2">{lang === "en" ? "Contextual Awareness" : "الوعي بالسياق"}</h4>
                <p className="text-sm text-gray-500">
                  {lang === "en" ? "Our AI preserves the author's tone while extracting core meanings from your uploaded documents." : "يحافظ ذكاؤنا الاصطناعي على نبرة المؤلف أثناء استخراج المعاني الجوهرية من مستنداتك المرفوعة."}
                </p>
              </div>
              <div>
                <h4 className="text-purple-400 font-medium mb-2">{lang === "en" ? "Vectorized Search" : "البحث المتجهي"}</h4>
                <p className="text-sm text-gray-500">
                  {lang === "en" ? "Searching for books uses semantic similarity, ensuring you find what you need even with vague titles." : "البحث عن الكتب يستخدم التشابه الدلالي، مما يضمن العثور على ما تحتاجه حتى مع العناوين الغامضة."}
                </p>
              </div>
              <div>
                <h4 className="text-green-400 font-medium mb-2">{lang === "en" ? "Multi-format Extraction" : "استخراج متعدد الصيغ"}</h4>
                <p className="text-sm text-gray-500">
                  {lang === "en" ? "Optimized parsing for PDF structures, including headers, footnotes, and main body text." : "تحليل محسن لهياكل PDF، بما في ذلك العناوين والحواشي السفلية ومتن النص الرئيسي."}
                </p>
              </div>
            </div>
          </div>
        </section>
        <footer className="mt-16 text-center text-gray-600 text-xs pb-12">
          <p className="max-w-2xl mx-auto leading-relaxed">
            {lang === "en" 
              ? "Book Summarizer is a comprehensive digital library management tool. It combines the power of large language models with a user-friendly interface to provide high-quality document analysis, book discovery, and knowledge retention services for researchers and avid readers worldwide."
              : "ملخص الكتب هو أداة شاملة لإدارة المكتبة الرقمية. فهو يجمع بين قوة النماذج اللغوية الكبيرة وواجهة سهلة الاستخدام لتوفير تحليل مستندات عالي الجودة، واكتشاف الكتب، وخدمات الاحتفاظ بالمعرفة للباحثين والقراء الشغوفين حول العالم."}
          </p>
        </footer>
      </div>
    </main>
    </div>

  );
};