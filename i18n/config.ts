export const locales = ['en', 'om', 'am'] as const;
export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  om: 'Afaan Oromo',
  am: 'አማርኛ'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  om: '🇪🇹',
  am: '🇪🇹'
};