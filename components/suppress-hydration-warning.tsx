"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/language-provider"

export function SuppressHydrationWarning() {
  const { lang } = useLanguage()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Update the HTML lang attribute
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return null
}
