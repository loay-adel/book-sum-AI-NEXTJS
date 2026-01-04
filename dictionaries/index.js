import 'server-only';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ar: () => import('./ar.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  const defaultLocale = 'en';
  try {
    return await (dictionaries[locale]?.() || dictionaries[defaultLocale]());
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return dictionaries[defaultLocale]();
  }
};