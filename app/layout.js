// app/[lang]/layout.jsx
import { Inter, Cairo } from 'next/font/google';
import "./globals.css"; 
import Footer from "@/components/Footer";
import { getDictionary } from '@/dictionaries';

// Configure fonts WITHOUT variable
const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
});

const cairo = Cairo({ 
  subsets: ['arabic'], 
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }) {
  try {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const seoDict = dictionary?.seo || {};
    const isArabic = lang === 'ar';
    
    return {
      metadataBase: new URL('https://booksummarizer.net'),
      title: {
        default: seoDict.title || (isArabic ? "ملخص الكتب" : "Book Summarizer"),
        template: `%s | ${isArabic ? "ملخص الكتب" : "Book Summarizer"}`,
      },
      description: seoDict.description || (isArabic ? "احصل على ملخصات ذكية للكتب مدعومة بالذكاء الاصطناعي" : "Get smart AI-powered book summaries"),
      keywords: seoDict.keywords || (isArabic ? ["ملخص كتب", "تلخيص كتب", "ذكاء اصطناعي"] : ["book summaries", "AI summaries", "book summarizer"]),
      authors: [{ name: 'Book Summarizer' }],
      creator: 'Book Summarizer',
      publisher: 'Book Summarizer',
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png', // Use a 180x180 version if possible for better Apple touch icon
      },
      manifest: '/manifest.json', 
      openGraph: {
        title: seoDict.title || (isArabic ? "ملخص الكتب" : "Book Summarizer"),
        description: seoDict.description || (isArabic ? "احصل على ملخصات ذكية للكتب" : "Get smart book summaries"),
        url: `/${lang}`,
        siteName: 'Book Summarizer',
        locale: isArabic ? 'ar_EG' : 'en_US',
        type: 'website',
        images: [
          {
            url: '/og-image.png', // Place a default 1200x630 OG image in /public
            width: 1200,
            height: 630,
            alt: isArabic ? "ملخص الكتب" : "Book Summarizer",
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoDict.title || (isArabic ? "ملخص الكتب" : "Book Summarizer"),
        description: seoDict.description || (isArabic ? "احصل على ملخصات ذكية للكتب" : "Get smart book summaries"),
        images: ['/og-image.png'],
        creator: '@yourTwitterHandle', // Optional: add your handle
        site: '@yourTwitterHandle',
      },
      alternates: {
        canonical: `/${lang}`,
        languages: {
          'en-US': '/en',
          'ar-EG': '/ar',
          'x-default': '/en', // Recommended for default language
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Book Summarizer",
      description: "Get smart book summaries powered by AI",
    };
  }
}

export default async function LangLayout({ children, params }) {
  try {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const isArabic = lang === "ar";
    
    const fontClass = isArabic ? cairo.className : inter.className;
    
    return (
      <html 
        lang={lang} 
        dir={isArabic ? "rtl" : "ltr"} 
        className={fontClass}
      >
        <head />
        <body className="bg-gray-900 text-white min-h-screen">
          <main className="pt-16">{children}</main>
          <Footer lang={lang} dictionary={dictionary} />
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in layout:', error);
    return (
      <html lang="en">
        <body className="bg-gray-900 text-white min-h-screen">
          <div className="container mx-auto p-4">
            <h1>Error loading page</h1>
          </div>
        </body>
      </html>
    );
  }
}