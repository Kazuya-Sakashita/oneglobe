'use client';

import {NextIntlClientProvider} from 'next-intl';

type Props = {
  locale: string;
  messages: Record<string, unknown>;
  timeZone?: string;
  /** サーバから渡す固定時刻（number | string | Date どれでもOK） */
  now: number | string | Date;
  children: React.ReactNode;
};

export default function I18nProvider({
  locale,
  messages,
  timeZone = 'Asia/Tokyo',
  now,
  children
}: Props) {
  // 受けとった now を Date に正規化（クライアントで new Date() は作らない）
  const fixedNow = typeof now === 'number' || typeof now === 'string' ? new Date(now) : now;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone} now={fixedNow}>
      {children}
    </NextIntlClientProvider>
  );
}
