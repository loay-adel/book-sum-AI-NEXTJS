"use client";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  FiX, FiBook, FiGlobe, FiHome, FiInfo, FiMail, FiShield, FiChevronDown } from "react-icons/fi";
import { ImBlog } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

const navigationDict = {
  en: {
    home: "Home",
    about: "About Us",
    contact: "Contact",
    privacyPolicy: "Privacy",
    features: "Features",
    blog: "Blog",
    search: "Search Books",
    summaries: "My Summaries"
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    contact: "اتصل بنا",
    privacyPolicy: "الخصوصية",
    features: "المميزات",
    blog: "المدونة",
    search: "ابحث عن كتب",
    summaries: "ملخصاتي"
  },
};

const Header = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 20;
    setScrolled(isScrolled);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const navLinks = [
    { href: "/main", label: "home", icon: <FiHome className="w-4 h-4" /> },
    { href: "/blogs", label: "blog", icon:  <ImBlog className="w-4 h-4"/> },
    { href: "/about", label: "about", icon: <FiInfo className="w-4 h-4" /> },
    { href: "/contact", label: "contact", icon: <FiMail className="w-4 h-4" /> },
    { href: "/privacy-policy", label: "privacyPolicy", icon: <FiShield className="w-4 h-4" /> },
  ];

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    isMounted && scrolled
      ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/30 py-2 shadow-2xl shadow-black/30"
      : "bg-gradient-to-b from-gray-900/95 to-transparent backdrop-blur-md border-b border-transparent py-4"
  }`;

  const languageVariants = {
    en: { x: 0, opacity: 1 },
    ar: { x: 0, opacity: 1 }
  };

  return (
    <motion.header 
      className={headerClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center group gap-3">
              <motion.div 
                className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-3 rounded-xl transition-all duration-500 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 shadow-lg group-hover:shadow-blue-500/25"
                whileHover={{ rotate: 5 }}
                animate={{ 
                  boxShadow: scrolled 
                    ? "0 10px 30px -10px rgba(59, 130, 246, 0.3)" 
                    : "0 4px 20px -5px rgba(59, 130, 246, 0.2)" 
                }}
              >
                <FiBook className="w-6 h-6" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Book Summarizer
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wider">
                  AI-Powered Book Insights
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                className="relative"
                onHoverStart={() => setHoveredLink(link.href)}
                onHoverEnd={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-white bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/30"
                  }`}
                >
                  {link.icon && (
                    <motion.span
                      animate={isActive(link.href) ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {link.icon}
                    </motion.span>
                  )}
                  <span className="font-medium">
                    {navigationDict[lang][link.label]}
                  </span>
                  
                  {isActive(link.href) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </Link>
                
                {/* Hover effect */}
                {hoveredLink === link.href && !isActive(link.href) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            ))}

            {/* Language Switcher */}
            <div className="relative ml-2">
              <motion.button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGlobe className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-white font-medium"
                >
                  {lang === "en" ? "EN" : "العربية"}
                </motion.span>
                <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                  showLanguageMenu ? "rotate-180" : ""
                }`} />
              </motion.button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        if (lang !== "en") toggleLanguage();
                        setShowLanguageMenu(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-200 ${
                        lang === "en"
                          ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-white"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }`}
                    >
                      <span>English</span>
                      {lang === "en" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (lang !== "ar") toggleLanguage();
                        setShowLanguageMenu(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-200 ${
                        lang === "ar"
                          ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-white"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }`}
                    >
                      <span>العربية</span>
                      {lang === "ar" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden flex flex-col justify-center items-center w-12 h-12 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-all duration-300 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <FiX className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  className="space-y-1.5"
                >
                  <span className="block w-6 h-0.5 bg-white transition-transform duration-300" />
                  <span className="block w-6 h-0.5 bg-white transition-transform duration-300" />
                  <span className="block w-4 h-0.5 bg-white transition-transform duration-300 ml-auto" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-800/50 space-y-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(link.href)
                          ? "text-white bg-gradient-to-r from-blue-900/40 to-purple-900/40"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      {link.icon && (
                        <span className={`${isActive(link.href) ? "text-blue-300" : "text-gray-400"}`}>
                          {link.icon}
                        </span>
                      )}
                      <span className="font-medium">
                        {navigationDict[lang][link.label]}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* Language Switcher Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <FiGlobe className="w-5 h-5 text-gray-400" />
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="font-medium">
                      {lang === "en" ? "Switch to Arabic" : "التغيير للإنجليزية"}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-800 rounded-lg">
                      {lang === "en" ? "العربية" : "EN"}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;