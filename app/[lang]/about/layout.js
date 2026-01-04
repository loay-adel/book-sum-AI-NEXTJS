// app/[lang]/about/layout.jsx (or page.jsx if no dedicated layout)
import { getDictionary } from '@/dictionaries';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const isArabic = lang === 'ar';

  return {
    metadataBase: new URL('https://booksummarizer.net'),
    title: isArabic ? "من نحن - ملخص الكتب" : "About Us - Book Summarizer",
    description: isArabic 
      ? "تعرف على ملخص الكتب، مهمتنا، وكيف نساعد القراء في اكتشاف واستكشاف الكتب بسهولة باستخدام الذكاء الاصطناعي."
      : "Learn more about Book Summarizer, our mission, and how we help readers discover and explore books effortlessly using AI.",
    keywords: isArabic 
      ? ["من نحن", "ملخص الكتب", "عن الموقع"] 
      : ["about us", "book summarizer", "AI book summaries"],
    openGraph: {
      title: isArabic ? "من نحن - ملخص الكتب" : "About Us - Book Summarizer",
      description: isArabic 
        ? "تعرف على ملخص الكتب، مهمتنا، وكيف نساعد القراء"
        : "Learn more about Book Summarizer and our mission",
      url: `/${lang}/about`,
      siteName: 'Book Summarizer',
      locale: isArabic ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? "من نحن - ملخص الكتب" : "About Us - Book Summarizer",
      description: isArabic 
        ? "تعرف على ملخص الكتب، مهمتنا، وكيف نساعد القراء"
        : "Learn more about Book Summarizer and our mission",
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/${lang}/about`,
      languages: {
        'en-US': '/en/about',
        'ar-EG': '/ar/about',
        'x-default': '/en/about',
      },
    },
    robots: { index: true, follow: true },
  };
}

export default function AboutLayout({ children }) {
  return <>{children}</>;
}