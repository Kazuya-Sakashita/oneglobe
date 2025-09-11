import { notFound } from 'next/navigation';
import I18nProvider from '@/components/I18nProvider';
import HtmlLangSync from '@/components/HtmlLangSync';
import { locales, rtlLocales, type Locale } from '@/i18n';
import '@/styles/tokens.css';

export function generateStaticParams() {
  return locales.map((l) => ({ locale: l }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return {
    title: 'OneGlobe',
    description: 'One world, one conversation.',
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`]))
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  // 直 import で辞書読込（config 不要）
  const messages = (await import(`@/i18n/${locale}.json`)).default;

  // SSR/CSR の時刻差を防ぐ
  const now = Date.now();
  const isRTL = rtlLocales.includes(locale);

  // ★ html/body は描かない（RootLayout が担当）
  return (
  <div data-locale={locale} data-dir={isRTL ? 'rtl' : 'ltr'}>
    <HtmlLangSync lang={locale} dir={isRTL ? 'rtl' : 'ltr'} />
    <I18nProvider locale={locale} messages={messages} timeZone="Asia/Tokyo" now={now}>
      {children}
      </I18nProvider>
      <div className="text-xs text-gray-500">locale: {locale}</div>
  </div>
  );
}
