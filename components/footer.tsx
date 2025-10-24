"use client";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t, lang } = useLanguage()
  return (
    <footer 
      style={{ backgroundColor: "#242424" }} 
      className="text-white py-12 relative overflow-hidden"
    >
      {/* Background watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute right-0 top-0 w-96 h-96 transform translate-x-32 -translate-y-16">
          <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 rounded-full"></div>
        </div>
      </div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Archive Column */}
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">{t("archive")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("accessibility")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("information_quality")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("privacy_policy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("legal_policies")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Networks Column */}
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">{t("social_networks")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("budget_performance")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("office_inspector_general")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("no_fear_act")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("for_employees")}
                  </a>
                </li>
              </ul>
            </div>

            {/* FOIA Column */}
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">{t("eoir_foia")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    USA.gov
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("contact_eoir")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("eoir_homepage")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    Justice.gov
                  </a>
                </li>
              </ul>
            </div>

            {/* Immigration Court Column */}
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">{t("immigration_court_resource")}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-yellow-400 underline">
                    {t("contact_technical_assistance")}
                  </a>
                </li>
                <li className="text-xs">{t("site_protected")}</li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline text-xs">
                    {t("hcaptcha_privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 underline text-xs">
                    {t("hcaptcha_terms")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-slate-400 mb-4 md:mb-0">
                <p>{t("department_justice")}</p>
                <p>5107 Leesburg Pike, Suite 2600, Falls Church, VA 22041</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/flags/logo192.png"
                    alt="Department of Justice - Executive Office for Immigration Review"
                    width={56}
                    height={56}
                    className="rounded-full shadow-lg"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white leading-tight">EOIR</span>
                  <span className="text-sm text-slate-300 leading-tight">{t("automated_case_information")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
