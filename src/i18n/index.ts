export const locales = ['en', 'ja'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'ja';
export const rtlLocales: Locale[] = [];

export const localeLabels = {
  en: 'English (en)',
  ja: '日本語 (ja)'
} satisfies Record<Locale, string>;
