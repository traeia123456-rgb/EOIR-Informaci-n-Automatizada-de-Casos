"use client";
import Image from "next/image";
import { LanguageSelector } from "./language-selector";
import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";

export function Header() {
  const { t, lang } = useLanguage()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    // Actualizar la fecha cada minuto
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formattedDate = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate)
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      {/* Government site banner */}
      <div className="bg-gray-900 py-2 px-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/flags/us-flag.png"
                alt="Bandera de Estados Unidos"
                width={20}
                height={14}
                className="rounded-sm shadow-sm"
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="text-sm font-medium">{t("gov_banner")}</span>
            </div>
          </div>
          <button className="text-blue-300 hover:text-blue-200 underline text-xs transition-colors">
            {t("how_you_know")}
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <Image
                  src="/flags/logo192.png"
                  alt="EOIR - Executive Office for Immigration Review"
                  width={48}
                  height={48}
                  className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{t("site_title")}</h1>
              <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">
                {t("site_subtitle")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
      {/* Court Closures Banner */}
      <div className="bg-yellow-500 text-black py-0.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span>
            {t("court_closures")} {formattedDate}. {t("please_check")} 
            <a 
              href="hp://www.justice.gov/eoir-operational-status" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-900 hover:text-blue-900 underline"
            >
              hp://www.justice.gov/eoir-operational-status
            </a>
            {t("for_updates")}
          </span>
        </div>
      </div>
    </header>
  );
}
