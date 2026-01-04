// app/[lang]/about/page.jsx
import { AboutContent } from "@/components/AboutContent";
import { getDictionary } from '@/dictionaries';

export default async function AboutUs({ params }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  return <AboutContent lang={lang} dictionary={dictionary} />;
}