import { LanguageProvider } from "@/lib/context/LanguageContext";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "book summarizer - Discover Your Next Read",
  description: "Explore thousands of books with AI-powered summaries and recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4527228791670330"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
