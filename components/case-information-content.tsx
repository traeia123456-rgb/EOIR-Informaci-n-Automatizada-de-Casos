"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";

interface Props {
  caseData: {
    full_name: string
    registration_number: string
    appeal_received_date: string | null
    brief_status_respondent: string | null
    brief_status_dhs: string | null
    court_address: string | null
    court_phone: string | null
    next_hearing_info: string | null
    decision: string | null
    decision_date: string | null
    decision_court_address: string | null
    appeal_board_info: string | null
  }
}

export default function CaseInformationContent({ caseData }: Props) {
  const { lang, t, tAsync } = useLanguage()
  const [translatedTexts, setTranslatedTexts] = useState({
    nextHearingInfo: "",
    decision: "",
    appealBoardInfo: "",
    briefStatusRespondent: "",
    briefStatusDhs: "",
  })

  useEffect(() => {
    const translateTexts = async () => {
      const translations = {
        nextHearingInfo: caseData.next_hearing_info ? await tAsync(caseData.next_hearing_info) : "",
        decision: caseData.decision ? (caseData.decision === "El juez de inmigración ORDENÓ la expulsión." ? t("judicial_decision_example") : await tAsync(caseData.decision)) : "",
        appealBoardInfo: caseData.appeal_board_info ? await tAsync(caseData.appeal_board_info) : "",
        briefStatusRespondent: caseData.brief_status_respondent ? await tAsync(caseData.brief_status_respondent) : "",
        briefStatusDhs: caseData.brief_status_dhs ? await tAsync(caseData.brief_status_dhs) : "",
      }
      setTranslatedTexts(translations)
    }

    translateTexts()
  }, [lang, caseData, tAsync, t])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("date_not_specified")
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    // Capitalize first letter of month for Spanish
    if (lang === "es") {
      const parts = formatted.split(' de ')
      if (parts.length === 3) {
        parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
        return parts.join(' de ')
      }
    }
    return formatted
  }

  // Función auxiliar para convertir texto con asteriscos (*texto*) a HTML con negritas
  const formatTextWithBold = (text: string | null): string => {
    if (!text) return ""
    
    // Reemplazar texto entre asteriscos con etiquetas de negrita
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Next Hearing */}
        <div className="bg-white border rounded-xl shadow-sm order-1">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b">
            <div className="w-7 h-7 bg-green-100 rounded-md flex items-center justify-center">
              <Image src="/flags/calendar.svg" alt={t("hearing_icon")} width={28} height={28} />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
              {t("next_hearing_info")}
            </h2>
          </div>

          <div className="p-6">
            {caseData.next_hearing_info ? (
              <div className="text-center">
                <div dangerouslySetInnerHTML={{ __html: formatTextWithBold(translatedTexts.nextHearingInfo) }} className="text-gray-800 text-lg" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 opacity-30">
                  <Image src="/flags/relog.svg" alt={t("clock_icon")} width={48} height={48} />
                </div>
                <p className="text-slate-600 italic text-lg text-center">
                  {t("no_future_hearings")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Decisions */}
        <div className="bg-white border rounded-xl shadow-sm order-2">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b">
            <div className="w-7 h-7 bg-red-100 rounded-md flex items-center justify-center">
              <Image src="/flags/maso.svg" alt={t("judicial_icon")} width={28} height={28} />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
              {t("motions_judicial_decisions")}
            </h2>
          </div>

          <div className="p-6">
            {caseData.decision || caseData.decision_date || caseData.decision_court_address ? (
              <div className="text-center space-y-4">
                {caseData.decision && <p className="text-gray-800 text-lg font-medium">{translatedTexts.decision}</p>}

                {caseData.decision_date && (
                  <div>
                    <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("decision_date")}</h3>
                    <p className="text-gray-700">{formatDate(caseData.decision_date)}</p>
                  </div>
                )}

                {caseData.decision_court_address && (
                  <div>
                    <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("decision_court_address")}</h3>
                    <p className="text-gray-700 whitespace-pre-line">{caseData.decision_court_address}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 opacity-30">
                  <Image src="/flags/relog.svg" alt={t("clock_icon")} width={48} height={48} />
                </div>
                <p className="text-slate-600 italic text-lg text-center">
                  {t("case_pending")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Left - BIA Appeal Info */}
        <div className="bg-white border rounded-xl shadow-sm order-3">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b">
            <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center">
              <Image src="/flags/hoja.svg" alt={t("appeal_icon")} width={28} height={28} />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
              {t("bia_appeal_info")}
            </h2>
          </div>

          <div className="p-6">
            {!caseData.appeal_received_date ? (
              <div className="text-center">
                {caseData.appeal_board_info ? (
                  <p className="text-gray-700">{translatedTexts.appealBoardInfo}</p>
                ) : (
                  <p className="text-gray-700">{t("no_appeal_for_case")}</p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  {t("appeal_received_on")} <strong>{formatDate(caseData.appeal_received_date)}</strong>. {t("still_pending")}
                </p>

                <div>
                  <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("status_respondent_brief")}</h3>
                  <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: formatTextWithBold(translatedTexts.briefStatusRespondent || t("pending")) }} />
                </div>

                <div>
                  <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("status_dhs_brief")}</h3>
                  <p className="text-gray-700">{translatedTexts.briefStatusDhs || t("pending")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right - Court Info */}
        <div className="bg-white border rounded-xl shadow-sm order-4">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b">
            <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center">
              <Image src="/flags/torre.svg" alt={t("court_icon")} width={28} height={28} />
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
              {t("court_information")}
            </h2>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-6 text-center">
              {t("contact_court_info")}
            </p>

            <div className="text-center space-y-4">
              <div>
                <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("court_address")}</h3>
                <p className="text-gray-700 whitespace-pre-line">{caseData.court_address || "915 2ND AVENUE, SUITE 613\nSEATTLE, WA 98174"}</p>
              </div>

              {caseData.court_phone && (
                <div>
                  <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("phone_number")}</h3>
                  <p className="text-gray-700">{caseData.court_phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


