"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationDict = {
  en: {
    home: "Home",
    about: "About Us",
    contact: "Contact Us",
    privacyPolicy: "Privacy Policy"
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    contact: "اتصل بنا",
    privacyPolicy: "سياسة الخصوصية"
  },
};

const Header = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // Only add event listener on client side
    window.addEventListener("scroll", handleScroll);
    
    // Set initial scroll state
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  // Don't render scroll-dependent classes during SSR
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isMounted && scrolled
      ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 py-2 shadow-xl"
      : "bg-gray-900/90 backdrop-blur-sm border-b border-gray-800/30 py-3"
  }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg mr-3 transition-all duration-300 group-hover:from-blue-400 group-hover:to-purple-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477 4.5 1.253"
                ></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Bookwise</span>
          </Link>

          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center">
  {/* Navigation Links */}
  <div className={`flex items-center ${lang === "ar" ? "flex-row-reverse space-x-reverse" : "flex-row"} space-x-2`}>
    <Link
      href="/"
      className={`transition-colors font-medium px-4 py-2 rounded-lg ${
        isActive("/")
          ? "text-white bg-gray-800 shadow-lg"
          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
      }`}
    >
      {navigationDict[lang].home}
    </Link>
    <Link
      href="/about"
      className={`transition-colors font-medium px-4 py-2 rounded-lg ${
        isActive("/about")
          ? "text-white bg-gray-800 shadow-lg"
          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
      }`}
    >
      {navigationDict[lang].about}
    </Link>
    <Link
      href="/contact"
      className={`transition-colors font-medium px-4 py-2 rounded-lg ${
        isActive("/contact")
          ? "text-white bg-gray-800 shadow-lg"
          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
      }`}
    >
      {navigationDict[lang].contact}
    </Link>
    <Link
      href="/privacy-policy"
      className={`transition-colors font-medium px-4 py-2 rounded-lg ${
        isActive("/privacy-policy")
          ? "text-white bg-gray-800 shadow-lg"
          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
      }`}
    >
      {navigationDict[lang].privacyPolicy}
    </Link>
  </div>

  {/* Language Switcher */}
  <div className={`flex items-center ${lang === "ar" ? "mr-4" : "ml-4"}`}>
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
      aria-label="Toggle language"
    >
      <span className="text-white font-medium">
        {lang === "en" ? "EN" : "AR"}
      </span>
    </button>
  </div>
</nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 py-4" : "max-h-0 py-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4 border-t border-gray-800">
            <Link
              href="/"
              className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                isActive("/")
                  ? "text-white bg-gray-800"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {navigationDict[lang].home}
            </Link>
            <Link
              href="/about"
              className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                isActive("/about")
                  ? "text-white bg-gray-800"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {navigationDict[lang].about}
            </Link>
            <Link
              href="/contact"
              className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                isActive("/contact")
                  ? "text-white bg-gray-800"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {navigationDict[lang].contact}
            </Link>
            <Link
              href="/privacy-policy"
              className={`transition-colors font-medium px-3 py-2 rounded-lg ${
                isActive("/privacy-policy")
                  ? "text-white bg-gray-800"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {navigationDict[lang].privacyPolicy}
            </Link>

            <div className="flex items-center justify-center pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Toggle language"
              >
                <span className="text-white font-medium">
                  {lang === "en" ? "EN" : "AR"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;