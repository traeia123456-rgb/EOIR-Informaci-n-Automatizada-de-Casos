"use client"

import { useLanguage } from "@/components/language-provider"

interface ErrorMessageProps {
  registration?: string
  nationality?: string
}

export function ErrorMessage({ registration, nationality }: ErrorMessageProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">
            <strong>{t("case_not_found")}</strong> {t("case_not_found_message")} {registration} {t("and_nationality")} {nationality}. {t("please_verify")}
          </p>
        </div>
      </div>
    </div>
  )
}

