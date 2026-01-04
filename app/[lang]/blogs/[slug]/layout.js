import { getDictionary } from '@/dictionaries';

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang);
  const isArabic = lang === 'ar';

  
  return {
    metadataBase: new URL('https://booksummarizer.net'),
    title: { template: `%s | ${isArabic ? "ملخص الكتب" : "Book Summarizer"}` }, // Inherits brand
    description: isArabic 
      ? "اقرأ المقالة الكاملة وملخصات الكتب المميزة"
      : "Read the full blog post with in-depth book insights",
    openGraph: {
      url: `/${lang}/blogs/${slug}`,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      locale: isArabic ? 'ar_EG' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/${lang}/blogs/${slug}`,
      languages: {
        'en-US': `/en/blogs/${slug}`,
        'ar-EG': `/ar/blogs/${slug}`,
      },
    },
  };
}

export default function BlogDetailLayout({ children }) {
  return <>{children}</>;
}