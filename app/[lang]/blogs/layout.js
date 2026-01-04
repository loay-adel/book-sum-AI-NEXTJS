// app/[lang]/blogs/layout.jsx
import { getDictionary } from '@/dictionaries';

export async function generateMetadata({ params }) {
  // Await params first, then destructure
  const awaitedParams = await params;
  const lang = awaitedParams.lang;
  const isArabic = lang === 'ar';

  return {
    metadataBase: new URL('https://booksummarizer.net'),
    title: isArabic ? "المدونة - ملخص الكتب" : "Blog - Book Summarizer",
    description: isArabic 
      ? "استكشف مقالاتنا وملخصات الكتب والمراجعات المدعومة بالذكاء الاصطناعي"
      : "Explore our blog with AI-powered book summaries, reviews, and insights",
    keywords: isArabic 
      ? ["مدونة", "ملخصات كتب", "مراجعات كتب"] 
      : ["blog", "book summaries", "book reviews"],
    openGraph: {
      title: isArabic ? "المدونة - ملخص الكتب" : "Blog - Book Summarizer",
      description: isArabic 
        ? "استكشف مقالاتنا وملخصات الكتب"
        : "Explore our blog with AI-powered book summaries",
      url: `/${lang}/blogs`,
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
      canonical: `/${lang}/blogs`,
      languages: {
        'en-US': '/en/blogs',
        'ar-EG': '/ar/blogs',
        'x-default': '/en/blogs',
      },
    },
  };
}

export default async function BlogsLayout({ children, params }) {
  return <>{children}</>;
}