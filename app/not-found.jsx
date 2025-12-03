"use client"; 
import Link from "next/link";
import { useLanguage } from "@/lib/context/LanguageContext";

const notFoundDict = {
  en: {
    title: "404",
    subtitle: "Oops! Page Not Found",
    description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    button: "Back to Home",
  },
  ar: {
    title: "404",
    subtitle: "عذراً، هذه الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها قد تكون حُذفت، تغير اسمها، أو أنها غير متاحة مؤقتاً.",
    button: "العودة للرئيسية",
  },
};

export default function NotFound() {

  const { lang } = useLanguage() || { lang: 'ar' };
  const content = notFoundDict[lang] || notFoundDict.ar;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* light BG*/}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
          {content.title}
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-200">
          {content.subtitle}
        </h2>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
          {content.description}
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          <svg
            className={`w-5 h-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {content.button}
        </Link>
      </div>
    </div>
  );
}