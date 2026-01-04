// app/[lang]/page.jsx
import Header from '@/components/Header';
import {MainContentClient} from '@/components/MainContentClient';
import { getDictionary } from '@/dictionaries';

export async function generateMetadata({ params }) {
  try {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const seoDict = dictionary?.seo || {};
    const isArabic = lang === 'ar';
    
    return {
      title: isArabic ? "الرئيسية - ملخص الكتب" : "Home - Book Summarizer",
      description: seoDict.description,
      alternates: {
        canonical: `/${lang}`,
        languages: {
          'en': '/en',
          'ar': '/ar',
        },
      },
    };
  } catch (error) {
    console.error('Error generating page metadata:', error);
    return {
      title: "Home - Book Summarizer",
      description: "Get smart book summaries powered by AI",
    };
  }
}

// This is a Server Component that passes data to Client Component
export default async function Home({ params }) {
  try {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    

   
    return(<> 
    
       <Header lang={lang} />
    <MainContentClient lang={lang} dictionary={dictionary} />;</>)
  } catch (error) {
    console.error('Error loading page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error loading page</h1>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}