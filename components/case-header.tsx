"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"

interface CaseHeaderProps {
  caseData: {
    full_name: string
    registration_number: string
    nationality: string
    cause_list_date: string | null
  }
}

export function CaseHeader({ caseData }: CaseHeaderProps) {
  const { t, tAsync, lang } = useLanguage()
  const [translatedNationality, setTranslatedNationality] = useState(caseData.nationality)

  useEffect(() => {
    const translateNationality = async () => {
      const translated = await tAsync(caseData.nationality)
      setTranslatedNationality(translated)
    }

    translateNationality()
  }, [lang, caseData.nationality, tAsync])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("date_not_specified")
    try {
      const [year, month, day] = dateString.split('-').map(Number)
      if (lang === "en") {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return `${monthNames[month - 1]} ${day}, ${year}`
      } else {
        const monthNames = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ]
        return `${day} de ${monthNames[month - 1]} de ${year}`
      }
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  return (
    <div className="bg-gray-200 px-6 py-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
            <Image
              src="/flags/logo512.png"
              alt={t("court_icon")}
              width={58}
              height={58}
              className="rounded-full"
              priority
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("automated_case_info")}</h1>
        <p className="text-lg text-gray-700">
          <strong>{t("name")}</strong> {caseData.full_name} | <strong>{t("alien_registration_number")}</strong>{" "}
          {caseData.registration_number} | <strong>{t("cause_list_date")}</strong> {formatDate(caseData.cause_list_date)} | <strong>{t("nationality_label")}</strong> {translatedNationality}
        </p>
      </div>
    </div>
  )
}