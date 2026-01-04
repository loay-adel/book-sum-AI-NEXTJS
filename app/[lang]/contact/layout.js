// app/[lang]/contact/layout.jsx
import { getDictionary } from '@/dictionaries';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isArabic = lang === 'ar';

  return {
    metadataBase: new URL('https://booksummarizer.net'),
    title: isArabic ? "اتصل بنا - ملخص الكتب" : "Contact Us - Book Summarizer",
    description: isArabic 
      ? "تواصل مع فريق ملخص الكتب للدعم، الاستفسارات، أو فرص التعاون."
      : "Get in touch with the Book Summarizer team for support, inquiries, or collaboration opportunities.",
    keywords: isArabic 
      ? ["اتصل بنا", "دعم", "تواصل"] 
      : ["contact us", "support", "get in touch"],
    openGraph: {
      title: isArabic ? "اتصل بنا - ملخص الكتب" : "Contact Us - Book Summarizer",
      description: isArabic 
        ? "تواصل مع فريق ملخص الكتب"
        : "Get in touch with the Book Summarizer team",
      url: `/${lang}/contact`,
      siteName: 'Book Summarizer',
      locale: isArabic ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/${lang}/contact`,
      languages: {
        'en-US': '/en/contact',
        'ar-EG': '/ar/contact',
        'x-default': '/en/contact',
      },
    },
  };
}

export default function ContactLayout({ children }) {
  return <>{children}</>;
}