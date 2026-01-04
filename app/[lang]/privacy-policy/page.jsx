// app/[lang]/privacy-policy/page.jsx
import PrivacyPolicyClient from '@/components/PrivacyPolicyClient';
import { getDictionary } from '@/dictionaries';

export default async function PrivacyPolicyPage({ params }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  return <PrivacyPolicyClient lang={lang} dictionary={dictionary} />;
}