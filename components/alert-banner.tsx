'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/components/language-provider"

export default function AlertBanner() {
  const { t } = useLanguage()
  
  return (
    <Alert className="mb-4">
      <AlertDescription>
        {t("info_notice")}
      </AlertDescription>
    </Alert>
  )
}