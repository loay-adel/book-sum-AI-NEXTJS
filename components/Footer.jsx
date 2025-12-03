"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/context/LanguageContext";

const Footer = () => {
  const { lang } = useLanguage();

  const content = {
    en: {
      poweredBy: "Powered by OpenAI",
      madeBy: "Made by",
    },
    ar: {
      poweredBy: "مدعوم بـ OpenAI",
      madeBy: "صنع بواسطة",
    },
  };

  return (
    <footer className="w-full py-4 px-4 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto text-center">
        <p
          className={`text-sm text-gray-400 ${
            lang === "ar" ? "font-arabic" : ""
          }`}
        >
          {content[lang].poweredBy} • {content[lang].madeBy}{" "}
          <Link
            href="mailto:loay-adel@outlook.com"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            Loay Adel
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;