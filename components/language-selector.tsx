"use client"

import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function LanguageSelector() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="relative">
      <select
        className="bg-white text-slate-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded border appearance-none pr-6 sm:pr-8 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
        value={lang}
        onChange={(e) => setLang(e.target.value as any)}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      <ChevronDown className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-600 pointer-events-none" />
    </div>
  )
}
