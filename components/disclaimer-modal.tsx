"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    try {
      const accepted = typeof window !== "undefined" && localStorage.getItem("disclaimerAccepted") === "true"
      if (!accepted) {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem("disclaimerAccepted", "true")
    } catch {}
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl p-0 rounded-2xl border-0 shadow-xl max-h-[95vh] flex flex-col">
        <div className="bg-white rounded-2xl flex flex-col h-full">
          {/* Layout responsivo: columna única en móvil, dos columnas en desktop */}
          <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:min-h-[500px] flex-1 overflow-hidden">
            
            {/* Contenido principal */}
            <div className="flex flex-col h-full">
              {/* Header y contenido con scroll */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 pt-8 pb-4 lg:px-8 lg:pt-10">
                  <DialogHeader>
                    <p className="text-xs font-medium text-gray-600 tracking-wide uppercase mb-2 text-left">
                      {t("disclaimer_title")}
                    </p>
                    <DialogTitle className="text-2xl lg:text-4xl font-normal text-gray-900 mb-6 text-left">
                      {t("welcome")}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {/* Contenido del texto */}
                  <div className="text-left space-y-4 text-gray-700 text-sm lg:text-base leading-relaxed">
                    <p>
                      {t("disclaimer_text_1")}
                    </p>
                    <p>
                      {t("disclaimer_text_2")}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500 italic pt-2">
                      {t("disclaimer_text_3")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer móvil - fijo en la parte inferior */}
              <div className="px-6 py-4 border-t bg-white lg:hidden">
                <div className="flex flex-col items-center space-y-3">
                  {/* Logo */}
                  <div className="flex items-center justify-center">
                    <Image
                      src="/flags/logo192.png"
                      alt="Departamento de Justicia - EOIR"
                      width={90}
                      height={90}
                      className="h-auto w-auto opacity-80"
                      priority
                    />
                  </div>
                  
                  
                  {/* Botón */}
                  <Button
                    onClick={handleAccept}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-colors"
                  >
                    {t("accept")}
                  </Button>
                </div>
              </div>

              {/* Footer desktop */}
              <div className="hidden lg:block px-8 pb-8 mt-auto">
                <div className="flex items-center justify-between">

                  <Button
                    onClick={handleAccept}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-3 font-medium transition-colors"
                  >
                    {t("accept")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Panel lateral derecho - solo desktop */}
            <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-gray-50 lg:p-8">
              <div className="flex items-center justify-center">
                <Image
                  src="/flags/logo192.png"
                  alt="Departamento de Justicia - EOIR"
                  width={420}
                  height={420}
                  className="h-auto w-auto opacity-90"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}