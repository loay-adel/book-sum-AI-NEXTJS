import ContactUsClient from '@/components/ContactUsClient';
import { getDictionary } from '@/dictionaries';

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  return <ContactUsClient lang={lang} dictionary={dictionary} />;
}