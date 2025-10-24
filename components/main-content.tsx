"use client";
import Image from "next/image";
import { RegistrationForm } from "./registration-form";
import { useLanguage } from "@/components/language-provider";

export function MainContent() {
  const { t } = useLanguage()
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Column - Information */}
        <div className="bg-white px-8 py-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto text-center">
            {/* Court Icon */}
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
              <div>
          <Image
            src="/flags/logo512.png"
            alt="Logo de la Corte de Inmigración"
            width={100}
            height={100}
            className="inline-block"
            />
          </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6">{t("info_automated_cases")}</h2>

            <p className="text-slate-700 leading-relaxed">{t("info_automated_text")}</p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div
          style={{
            background: "radial-gradient(at center center, rgb(24, 59, 94) 0%, rgb(26, 42, 57) 100%)",
          }}
        >
          <RegistrationForm />
        </div>
      </div>
    </main>
  )
}
