// app/[lang]/privacy-policy/layout.jsx
import { getDictionary } from '@/dictionaries';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isArabic = lang === 'ar';

  return {
    metadataBase: new URL('https://booksummarizer.net'),
    title: isArabic ? "سياسة الخصوصية - ملخص الكتب" : "Privacy Policy - Book Summarizer",
    description: isArabic 
      ? "تعرف على كيفية جمع ملخص الكتب لبياناتك الشخصية وحمايتها واستخدامها."
      : "Learn how Book Summarizer collects, uses, and protects your personal information.",
    keywords: isArabic 
      ? ["سياسة الخصوصية", "حماية البيانات"] 
      : ["privacy policy", "data protection"],
    openGraph: {
      title: isArabic ? "سياسة الخصوصية - ملخص الكتب" : "Privacy Policy - Book Summarizer",
      description: isArabic 
        ? "تعرف على سياسة الخصوصية"
        : "Learn how we protect your data",
      url: `/${lang}/privacy-policy`,
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
      canonical: `/${lang}/privacy-policy`,
      languages: {
        'en-US': '/en/privacy-policy',
        'ar-EG': '/ar/privacy-policy',
        'x-default': '/en/privacy-policy',
      },
    },
    robots: { index: true, follow: false }, // Often nofollow for privacy pages
  };
}

export default function PrivacyPolicyLayout({ children }) {
  return <>{children}</>;
}