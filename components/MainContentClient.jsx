"use client";
import { useState, useRef } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useBookSearch } from "@/lib/hooks/useBookSearch";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { useCategories } from "@/lib/hooks/useCategories";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

// Static dictionary - moved outside component
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
    libraryTitle: "Bookwise",
    librarySubtitle:
      "Discover, read and explore thousands of books with AI-powered summaries",
    quickActions: "Quick Actions",
    popularCategories: "Popular Categories",
    recentlyAdded: "Recently Added",
    trendingNow: "Trending Now",
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
    libraryTitle: "Bookwise",
    librarySubtitle:
      "اكتشف واقرأ واستكشف الآلاف من الكتب مع ملخصات مدعومة بالذكاء الاصطناعي",
    quickActions: "إجراءات سريعة",
    popularCategories: "التصنيفات الشائعة",
    recentlyAdded: "المضاف حديثاً",
    trendingNow: "الأكثر شهرة الآن",
  },
};

export const MainContentClient = ({ initialLang }) => {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Use your custom hooks
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    searchBook,
  } = useBookSearch();
  const {
    results: uploadResults,
    loading: uploadLoading,
    error: uploadError,
    uploadFile,
  } = useFileUpload();
  const {
    categories,
    selectedCategory,
    books: categoryBooks,
    loading: categoriesLoading,
    error: categoriesError,
    selectCategory,
  } = useCategories();

  const dict = contentDict;

  // ... rest of the component logic remains the same
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchBook(searchQuery);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
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
        {book.thumbnail && (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-16 h-24 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
          />
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
            {book.title}
          </h4>
          {showAuthor && book.author && (
            <p className="text-sm text-gray-400 mt-1">
              {dict[lang].by} {book.author}
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

  const renderResults = (results, loading, error, type) => {
    // ... renderResults implementation remains the same
    if (loading)
      return (
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
          ></motion.div>
        </div>
      );

    if (error)
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
            {dict[lang].error}: {error}
          </p>
          <Button
            onClick={clearResults}
            className="mt-4 bg-gray-700 hover:bg-gray-600"
          >
            {lang === "en" ? "Try Again" : "حاول مرة أخرى"}
          </Button>
        </motion.div>
      );

    if (!results) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6 mt-4">
          <h3 className="text-2xl font-bold text-white">
            {type === "search"
              ? dict[lang].searchResults
              : dict[lang].uploadResults}
          </h3>
          <Button
            onClick={clearResults}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            {lang === "en" ? "Clear" : "مسح"}
          </Button>
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
              {dict[lang].summary}:
            </h4>
            <div className="prose prose-invert max-w-none bg-gray-800/60 p-5 rounded-xl shadow-inner text-gray-200">
              <ReactMarkdown>{results.summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {results.amazonLink && (
          <div className="mb-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={results.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" />
              </svg>
              {dict[lang].buyLink}
            </motion.a>
          </div>
        )}

        {results.recommendations && results.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-purple-300 mb-4 text-lg">
              {dict[lang].recommendations}:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.recommendations.map((book, index) =>
                renderBookCard(book, index)
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <main className="flex-grow flex items-center justify-center relative z-10 py-8 px-4 mt-12">
      <div className="w-full max-w-6xl bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 transition-all duration-300 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 bg-300% animate-gradient"
          >
            {dict[lang].libraryTitle}
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {dict[lang].librarySubtitle}
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
                {dict[lang].search}
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
                {dict[lang].upload}
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
                {dict[lang].categories}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs Content - rest of the component remains the same */}
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
                    placeholder={dict[lang].placeholder}
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
                        {dict[lang].loading}
                      </div>
                    ) : (
                      dict[lang].submit
                    )}
                  </Button>
                </form>

                {renderResults(
                  searchResults,
                  searchLoading,
                  searchError,
                  "search"
                )}

                {!searchResults && !searchLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 grid grid-cols-1 gap-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {dict[lang].popularCategories}
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
                          : dict[lang].noFileSelected}
                      </p>
                      <button
                        type="button"
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        {dict[lang].selectFile}
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
                        {dict[lang].loading}
                      </div>
                    ) : (
                      dict[lang].submit
                    )}
                  </Button>
                </form>

                {renderResults(
                  uploadResults,
                  uploadLoading,
                  uploadError,
                  "upload"
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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : categoriesError ? (
                  <div className="text-center py-8 bg-red-900/30 rounded-xl border border-red-800/50">
                    <p className="text-lg font-medium text-red-300">
                      {dict[lang].error}: {categoriesError}
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-purple-300 mb-6">
                      {dict[lang].selectCategory}
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
                            {dict[lang].categoryBooks}{" "}
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
                                    {dict[lang].by} {book.author}
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
      </div>
    </main>
  );
};