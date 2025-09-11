'use client';
import {usePathname, useRouter} from 'next/navigation';
import {locales, localeLabels, type Locale} from '@/i18n';

export function LanguageSwitcher({current}: {current: Locale}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(target: Locale) {
    if (!pathname) return;
    const parts = pathname.split('/');
    parts[1] = target; // 先頭のロケールセグメントを置換
    router.push(parts.join('/'));
  }

  return (
    <div className="inline-flex gap-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={l === current ? 'page' : undefined}
          className={`px-3 py-1 rounded-md border ${
            l === current ? 'bg-[var(--color-surface)] font-semibold' : ''
          }`}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
