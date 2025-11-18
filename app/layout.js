import { LanguageProvider } from "@/lib/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Bookwise - Discover Your Next Read",
  description: "Explore thousands of books with AI-powered summaries and recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800" suppressHydrationWarning>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}