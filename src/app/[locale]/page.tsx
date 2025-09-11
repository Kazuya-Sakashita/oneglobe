'use client';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations();
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">{t('app.name')}</h1>
      <p>{t('app.tagline')}</p>

      {/* 差が分かる例 */}
      <div className="mt-4">
        <p>{t('nav.settings')}</p>
        <button className="mt-2 px-3 py-1 rounded border">{t('chat.send')}</button>
      </div>
    </main>
  );
}
