"use client"

import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Save, X } from 'lucide-react'

interface CaseInformationTemplateProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onUpdate?: (updates: Partial<TemplateComponent>) => void
  isAdmin?: boolean
  caseData?: {
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
  }
}

export default function CaseInformationTemplate({
  component,
  isSelected,
  onSelect,
  onUpdate,
  isAdmin = false,
  caseData = {
    full_name: "",
    registration_number: "",
    appeal_received_date: null,
    brief_status_respondent: null,
    brief_status_dhs: null,
    court_address: null,
    court_phone: null,
    next_hearing_info: null,
    decision: null,
    decision_date: null,
    decision_court_address: null
  }
}: CaseInformationTemplateProps) {
  const { lang, t, tAsync } = useLanguage()
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState<Record<string, string>>(
    component.props.content && typeof component.props.content === 'object' ? component.props.content : {}
  )
  const [translatedTexts, setTranslatedTexts] = useState({
    nextHearingInfo: "",
    decision: "",
    briefStatusRespondent: "",
    briefStatusDhs: "",
  })

  useEffect(() => {
    const translateTexts = async () => {
      const translations = {
        nextHearingInfo: caseData.next_hearing_info ? await tAsync(caseData.next_hearing_info) : "",
        decision: caseData.decision ? await tAsync(caseData.decision) : "",
        briefStatusRespondent: caseData.brief_status_respondent ? await tAsync(caseData.brief_status_respondent) : "",
        briefStatusDhs: caseData.brief_status_dhs ? await tAsync(caseData.brief_status_dhs) : "",
      }
      setTranslatedTexts(translations)
    }

    translateTexts()
  }, [lang, caseData, tAsync])

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

  const handleEditClick = () => {
    setEditMode(true)
  }

  const handleSaveClick = () => {
    if (onUpdate) {
      onUpdate({
        props: {
          ...component.props,
          content: editContent
        }
      })
    }
    setEditMode(false)
  }

  const handleCancelClick = () => {
    setEditContent(component.props.content && typeof component.props.content === 'object' ? component.props.content : {})
    setEditMode(false)
  }

  const handleContentChange = (key: string, value: string) => {
    setEditContent({
      ...editContent,
      [key]: value
    })
  }

  const renderEditableTitle = (key: string, value: string) => {
    if (editMode) {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleContentChange(key, e.target.value)}
          className="min-h-[60px] text-lg md:text-xl font-extrabold"
        />
      )
    }
    return <h2 className="text-lg md:text-xl font-extrabold text-slate-900">{value}</h2>
  }

  const renderEditableText = (key: string, value: string) => {
    if (editMode) {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleContentChange(key, e.target.value)}
          className="min-h-[100px]"
        />
      )
    }
    return <p className="text-gray-700 mb-6 text-center">{value}</p>
  }

  return (
    <div
      className={`relative p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      {isAdmin && isSelected && (
        <div className="absolute top-2 right-2 space-x-2 z-10">
          {editMode ? (
            <>
              <Button size="sm" variant="outline" onClick={handleSaveClick}>
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelClick}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={handleEditClick}>
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Next Hearing */}
        <div className="bg-white border rounded-xl shadow-sm order-1">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b">
            <div className="w-7 h-7 bg-green-100 rounded-md flex items-center justify-center">
              <Image src="/flags/calendar.svg" alt={t("hearing_icon")} width={28} height={28} />
            </div>
            {renderEditableTitle('next_hearing_title', editContent.next_hearing_title)}
          </div>

          <div className="p-6">
            {caseData.next_hearing_info ? (
              <div className="text-center">
                <p className="text-gray-800 text-lg">{translatedTexts.nextHearingInfo}</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/flags/relog.svg" alt={t("clock_icon")} width={58} height={58} className="rounded-full" />
                </div>
                <div className="bg-slate-50 border rounded-lg p-5 max-w-2xl mx-auto">
                  <p className="text-slate-600 italic text-lg text-center">
                    {editContent.next_hearing_default}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Decisions */}
        <div className="bg-white border rounded-xl shadow-sm order-2">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b">
            <div className="w-7 h-7 bg-red-100 rounded-md flex items-center justify-center">
              <Image src="/flags/maso.svg" alt={t("judicial_icon")} width={28} height={28} />
            </div>
            {renderEditableTitle('judicial_decisions_title', editContent.judicial_decisions_title)}
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
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/flags/relog.svg" alt={t("clock_icon")} width={58} height={58} className="rounded-full" />
                </div>
                <div className="bg-slate-50 border rounded-lg p-5 max-w-2xl mx-auto">
                  <p className="text-slate-600 italic text-lg">
                    {t("case_pending")}
                  </p>
                </div>
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
            {renderEditableTitle('appeal_info_title', editContent.appeal_info_title)}
          </div>

          <div className="p-6">
            {caseData.appeal_received_date ? (
              <div className="space-y-6">
                <p className="text-gray-700 mb-6 text-center">
                  {t("appeal_received_on")} <strong>{formatDate(caseData.appeal_received_date)}</strong>. {t("still_pending")}
                </p>

                <div className="text-center">
                  <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("status_respondent_brief")}</h3>
                  <p className="text-gray-700">{translatedTexts.briefStatusRespondent || t("pending")}</p>
                </div>

                <div className="text-center">
                  <h3 className="text-slate-900 font-extrabold tracking-wide text-xs mb-1">{t("status_dhs_brief")}</h3>
                  <p className="text-gray-700">{translatedTexts.briefStatusDhs || t("pending")}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/flags/relog.svg" alt={t("clock_icon")} width={58} height={58} className="rounded-full" />
                </div>
                <div className="bg-slate-50 border rounded-lg p-5 max-w-2xl mx-auto">
                  <p className="text-slate-600 italic text-lg">
                    {t("no_appeal_for_case")}
                  </p>
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
            {renderEditableTitle('court_info_title', editContent.court_info_title)}
          </div>

          <div className="p-6">
            {renderEditableText('court_info_description', editContent.court_info_description)}

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