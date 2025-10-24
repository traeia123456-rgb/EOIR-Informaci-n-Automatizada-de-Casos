"use client"

import { useLanguage } from "@/components/language-provider"

interface BreadcrumbProps {
  caseData: {
    full_name: string
    registration_number: string
    nationality: string
  }
}

export function Breadcrumb({ caseData }: BreadcrumbProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <nav className="text-sm">
          <a href="/" className="text-blue-600 hover:underline">
            {t("home")}
          </a>
          <span className="mx-2">{">"}</span>
          <span className="text-blue-800 font-semibold">
            {caseData.full_name} ({caseData.registration_number}) - {caseData.nationality}
          </span>
        </nav>
      </div>
    </div>
  )
}

