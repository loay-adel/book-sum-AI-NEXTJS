import { LanguageProvider } from "@/lib/context/LanguageContext";
import Script from "next/script";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });


export const metadata = {
  metadataBase: new URL('https://booksummarizer.net'), 
  
  title: "Book Summarizer - AI-Powered Book & PDF Summaries",
  description: "Get instant AI-powered summaries for books and PDFs. Save time with concise summaries in English and Arabic. Perfect for students, professionals, and book lovers.",
  keywords: "book summaries, PDF summaries, AI summaries, reading app, Arabic books, English books, book summaries online, summarize books, book summary generator",
  authors: [{ name: "Book Summarizer" }],
  creator: "Book Summarizer Team",
  publisher: "Book Summarizer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Book Summarizer - AI-Powered Book & PDF Summaries",
    description: "Get instant AI-powered summaries for books and PDFs. Save time with concise summaries in English and Arabic.",
    url: "https://booksummarizer.net",
    siteName: "Book Summarizer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Book Summarizer - Smart Reading Made Easy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Summarizer - AI-Powered Book & PDF Summaries",
    description: "Get instant AI-powered summaries for books and PDFs in minutes",
    images: ["/favicon.png"],
    creator: "@booksummarizer",
  },
  alternates: {
    canonical: "https://booksummarizer.net",
    languages: {
      'en-US': 'https://booksummarizer.net',
      'ar-SA': 'https://booksummarizer.net',
    },
  },
  category: "education",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111827",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4527228791670330"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Book Summarizer",
                "url": "https://booksummarizer.net",
                "description": "AI-powered book and PDF summaries in multiple languages",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://booksummarizer.net/search?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Book Summarizer",
                "url": "https://booksummarizer.net",
                "logo": "https://booksummarizer.net/logo.png",
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Book Summarizer",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
              }
            ])
          }}
        />
      </head>

      <body 
        className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 antialiased"
        suppressHydrationWarning
      >

        
       
        {<script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://booksummarizer.net"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Book Summaries",
                  "item": "https://booksummarizer.net/main"
                }
              ]
            })
          }}
        /> }

        <LanguageProvider>
          {children}
        </LanguageProvider>

      </body>
    </html>
  );
}