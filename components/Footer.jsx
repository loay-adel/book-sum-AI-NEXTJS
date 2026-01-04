// components/Footer.jsx
import Link from "next/link";

const Footer = ({ lang }) => {
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

  const currentContent = content[lang] || content.en;

  return (
    <footer className="w-full py-4 px-4 bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto text-center">
        <p
          className={`text-sm text-gray-400 ${
            lang === "ar" ? "font-arabic" : ""
          }`}
        >
          {currentContent.poweredBy} • {currentContent.madeBy}{" "}
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