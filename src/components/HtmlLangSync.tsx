"use client"

import { useEffect } from "react"

type HtmlLangSyncProps = {
  /** e.g. "ja", "en", "ar-SA" など */
  lang: string
  /** 省略時は dir 属性を外す。RTL 言語なら "rtl" を指定 */
  dir?: "ltr" | "rtl"
}

/**
 * <html> の lang / dir をクライアント側で同期するだけの小さなコンポーネント。
 * ルートレイアウトで <HtmlLangSync lang={locale} dir={isRTL ? "rtl" : "ltr"} /> のように使う。
 */
export default function HtmlLangSync({ lang, dir }: HtmlLangSyncProps) {
  useEffect(() => {
    const el = document.documentElement
    if (lang && el.lang !== lang) {
      el.lang = lang
    }
    if (dir) {
      if (el.dir !== dir) el.dir = dir
    } else {
      el.removeAttribute("dir")
    }
  }, [lang, dir])

  return null
}
