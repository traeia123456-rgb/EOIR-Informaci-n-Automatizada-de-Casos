"use client"

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"
import { autoTranslateService, translateMissingText } from "@/lib/auto-translate"

type Lang = "es" | "en"

type Dictionary = Record<string, string>

const es: Dictionary = {
  court_closures: "Cierre de Tribunales",
  please_check: "Por favor consulte",
  for_updates: "para actualizaciones.",
  gov_banner: "Un sitio oficial del Gobierno de Estados Unidos",
  how_you_know: "Así es como lo sabe",
  site_title: "EOIR | Información Automatizada de Casos",
  site_subtitle: "Información automatizada de casos",
  info_automated_cases: "Información automatizada de casos",
  info_automated_text:
    "Bienvenido al sistema de información automatizada del Tribunal de Inmigración. La siguiente información está relacionada exclusivamente con el caso principal. Por favor comuníquese con su tribunal asignado si necesita información sobre una audiencia de fianza.",
  form_title: "Ingrese su número de registro de Extranjero",
  form_label: "Número de registro de extranjero",
  required: "Obligatorio",
  what_is_a_number: "¿Qué es un número de inmigrante extranjero?",
  search: "Buscar",
  searching: "Buscando...",
  form_error_digits: "Por favor ingrese los 9 dígitos del número de registro",
  form_error_generic: "Error al buscar el caso. Por favor intente nuevamente.",
  info_notice:
    "La información sobre el caso que aparece en este sistema automatizado, se provee a penas para su conveniencia. Los documentos que se le entregan a usted o a su representante por el tribunal de inmigración o el tribunal de apelaciones, son los únicos de carácter oficial relacionado a su caso.",
  select_nationality: "-- Seleccione Nacionalidad --",
  nationality: "Nacionalidad",
  what_is_nationality: "¿Qué es la nacionalidad?",
  error_select_nationality: "Por favor seleccione una nacionalidad",
  // Nuevas traducciones para case-information-content
  next_hearing_info: "Información acerca de la próxima audiencia",
  no_future_hearings: "No hay audiencias futuras para este caso.",
  motions_judicial_decisions: "Información sobre Pedimentos y Fallos Judiciales",
  case_pending: "Este caso está pendiente.",
  decision_date: "FECHA DEL FALLO",
  decision_court_address: "DIRECCIÓN DEL TRIBUNAL DEL FALLO",
  ordered_deportation: "El juez de inmigración ORDENÓ la expulsión.",
  bia_appeal_info: "Información de un caso ante la Junta de Apelaciones de Inmigración",
  no_appeal_received: "No se recibió una apelación para este caso.",
  no_appeal_for_case: "No se recibió una apelación para este caso.",
  contact_court_info: "Si usted necesita más información con relación a su caso, o desea presentar documentos adicionales, por favor comuníquese con el tribunal de apelaciones de inmigración.",
  appeal_received_on: "Se recibió una apelación en",
  still_pending: "Aún está pendiente.",
  status_respondent_brief: "EL ESTADO DEL ESCRITO DEL COMPARECIENTE",
  status_dhs_brief: "EL ESTADO DEL ESCRITO DEL DHS",
  pending: "Pendiente",
  court_information: "Información acerca del Tribunal",
  need_more_info: "Si usted necesita más información con relación a su caso, o desea presentar documentos adicionales, por favor comuníquese con el tribunal de apelaciones de inmigración.",
  court_address: "DIRECCIÓN DEL TRIBUNAL",
  phone_number: "NÚMERO DE TELÉFONO",
  date_not_specified: "No especificada",
  // Traducciones para los iconos
  hearing_icon: "Icono de Audiencia",
  clock_icon: "Icono de Reloj",
  judicial_icon: "Icono de Fallos Judiciales",
  appeal_icon: "Icono de Apelaciones",
  court_icon: "Icono del Tribunal",
  // Traducciones para página principal
  case_not_found: "Caso no encontrado:",
  case_not_found_message: "No se encontró ningún caso con el número de registro",
  and_nationality: "y nacionalidad",
  please_verify: "Por favor verifique que ambos datos sean correctos e intente nuevamente.",
  home: "Inicio",
  automated_case_info: "Información automatizada de casos",
  name: "Nombre:",
  alien_registration_number: "Número de registro de extranjero:",
  cause_list_date: "Fecha de la lista de causas:",
  nationality_label: "Nacionalidad:",
  // Traducciones para el footer
  archive: "Archivo",
  accessibility: "Accesibilidad",
  information_quality: "Calidad de Información",
  privacy_policy: "Política de Privacidad",
  legal_policies: "Políticas Legales y Descargos de Responsabilidades",
  social_networks: "Redes Sociales",
  budget_performance: "Presupuesto & Rendimiento",
  office_inspector_general: "Oficina del Inspector General",
  no_fear_act: "No FEAR Act",
  for_employees: "Para Empleados",
  eoir_foia: "Ley de Libertad de Información en EOIR (FOIA)",
  contact_eoir: "Comuníquese con EOIR",
  eoir_homepage: "Página Principal de EOIR",
  immigration_court_resource: "Recurso en Línea del Tribunal de Inmigración",
  contact_technical_assistance: "Comuníquese con la Asistencia Técnica",
  site_protected: "Este sitio está protegido por hCaptcha:",
  hcaptcha_privacy: "Política de Privacidad de hCaptcha",
  hcaptcha_terms: "Términos de Servicio de hCaptcha",
  department_justice: "Departamento de Justicia | Oficina Ejecutiva para la Revisión de Inmigración",
  automated_case_information: "Información Automatizada de Casos",
  // Traducciones para disclaimer modal
  disclaimer_title: "DESCARGO DE RESPONSABILIDAD",
  welcome: "Bienvenido",
  disclaimer_text_1: "Cualquier información proporcionada en este sitio web es solo para fines informativos generales y no reemplaza ningún manual, política o publicación de la Oficina Ejecutiva de Revisión de Casos de Inmigración (EOIR, por sus siglas en inglés). Este sitio web no sustituye el asesoramiento legal. No constituye ninguna opinión legal del Departamento de Justicia ni crea ningún derecho o beneficio.",
  disclaimer_text_2: "Además, este sitio web no proporciona la totalidad de los recursos que podría estar a su disposición. No aborda todas las leyes correspondientes o interpretaciones de casos, y está sujeto a cambios a medida que se promulguen nuevas leyes y normas y se modifiquen los precedentes de casos de circuito.",
  disclaimer_text_3: "Los documentos oficiales del EOIR son los únicos de carácter oficial relacionado a su caso.",
  accept: "ACEPTO",
  // Admin dashboard translations
  create_new_case: "Crear Nuevo Caso de Inmigración",
  edit_case: "Editar Caso de Inmigración",
  selected_template: "Plantilla Seleccionada",
  standard_template: "Plantilla Estándar - Todos los campos disponibles",
  simplified_template: "Plantilla Simplificada - Solo campos esenciales",
  court_phone: "Teléfono del Tribunal",
  court_phone_placeholder: "(XXX) XXX-XXXX",
  decision_placeholder: "Ej: El juez de inmigración ORDENÓ la expulsión",
  judicial_decision_example: "El juez de inmigración ORDENÓ la expulsión."
}

const en: Dictionary = {
  court_closures: "Court Closures",
  please_check: "Please check",
  for_updates: "for up to date closures.",
  gov_banner: "An official website of the United States government",
  how_you_know: "Here's how you know",
  site_title: "EOIR | Automated Case Information",
  site_subtitle: "Automated Immigration Court Case Information System",
  info_automated_cases: "Automated Case Information",
  info_automated_text:
    "Welcome to the Immigration Court Automated Information System. The following information relates only to the primary case. Please contact your assigned court if you need information about a bond hearing.",
  form_title: "Enter your Alien Registration Number",
  form_label: "Alien Registration Number",
  required: "Required",
  what_is_a_number: "What is an Alien Registration Number?",
  search: "Search",
  searching: "Searching...",
  form_error_digits: "Please enter all 9 digits of the registration number",
  form_error_generic: "Error searching the case. Please try again.",
  info_notice:
    "The case information shown in this automated system is provided for your convenience only. Documents issued to you or your representative by the immigration court or the appeals court are the only official records related to your case.",
  select_nationality: "-- Select Nationality --",
  nationality: "Nationality",
  what_is_nationality: "What is nationality?",
  error_select_nationality: "Please select a nationality",
  // New translations for case-information-content
  next_hearing_info: "Next Hearing Information",
  no_future_hearings: "There are no future hearings for this case.",
  motions_judicial_decisions: "Motions and Judicial Decisions",
  case_pending: "This case is pending.",
  decision_date: "DECISION DATE",
  decision_court_address: "DECISION COURT ADDRESS",
  bia_appeal_info: "Information about a case before the Board of Immigration Appeals",
  no_appeal_received: "No appeal received for this case.",
  no_appeal_for_case: "No appeal received for this case.",
  appeal_received_on: "An appeal was received on",
  still_pending: "It is still pending.",
  status_respondent_brief: "STATUS OF RESPONDENT'S BRIEF",
  status_dhs_brief: "STATUS OF DHS BRIEF",
  pending: "Pending",
  court_information: "Court Information",
  need_more_info: "If you need more information about your case, or wish to submit additional documents, please contact the immigration appeals court.",
  court_address: "COURT ADDRESS",
  phone_number: "PHONE NUMBER",
  date_not_specified: "Not specified",
  // Icon translations
  hearing_icon: "Hearing Icon",
  clock_icon: "Clock Icon",
  judicial_icon: "Judicial Decisions Icon",
  appeal_icon: "Appeals Icon",
  court_icon: "Court Icon",
  contact_court_info: "If you need more information about your case, or wish to submit additional documents, please contact the immigration appeals court.",
  // Translations for main page
  case_not_found: "Case not found:",
  case_not_found_message: "No case was found with registration number",
  and_nationality: "and nationality",
  please_verify: "Please verify that both data are correct and try again.",
  home: "Home",
  automated_case_info: "Automated Case Information",
  name: "Name:",
  alien_registration_number: "Alien Registration Number:",
  cause_list_date: "Cause List Date:",
  nationality_label: "Nationality:",
  // Footer translations
  archive: "Archive",
  accessibility: "Accessibility",
  information_quality: "Information Quality",
  privacy_policy: "Privacy Policy",
  legal_policies: "Legal Policies and Disclaimers",
  social_networks: "Resources",
  budget_performance: "Budget & Performance",
  office_inspector_general: "Office of Inspector General",
  no_fear_act: "No FEAR Act",
  for_employees: "For Employees",
  eoir_foia: "EOIR Freedom of Information Act (FOIA)",
  contact_eoir: "Contact EOIR",
  eoir_homepage: "EOIR Homepage",
  immigration_court_resource: "Immigration Court Online Resource",
  contact_technical_assistance: "Contact Technical Assistance",
  site_protected: "This site is protected by hCaptcha:",
  hcaptcha_privacy: "hCaptcha Privacy Policy",
  hcaptcha_terms: "hCaptcha Terms of Service",
  department_justice: "Department of Justice | Executive Office for Immigration Review",
  automated_case_information: "Automated Case Information",
  // Disclaimer modal translations
  disclaimer_title: "DISCLAIMER",
  welcome: "Welcome",
  disclaimer_text_1: "Any information provided on this website is for general informational purposes only and does not replace any manual, policy, or publication of the Executive Office for Immigration Review (EOIR). This website does not substitute legal advice. It does not constitute any legal opinion of the Department of Justice or create any rights or benefits.",
  disclaimer_text_2: "Additionally, this website does not provide the entirety of resources that may be available to you. It does not address all corresponding laws or case interpretations, and is subject to change as new laws and regulations are enacted and circuit case precedents are modified.",
  disclaimer_text_3: "Official EOIR documents are the only official records related to your case.",
  accept: "ACCEPT",
  // Admin dashboard translations
  create_new_case: "Create New Immigration Case",
  edit_case: "Edit Immigration Case",
  selected_template: "Selected Template",
  standard_template: "Standard Template - All fields available",
  simplified_template: "Simplified Template - Essential fields only",
  court_phone: "Court Phone",
  court_phone_placeholder: "(XXX) XXX-XXXX",
  decision_placeholder: "Ex: The immigration judge ORDERED removal",
  judicial_decision_example: "The immigration judge ORDERED the deportation.",
  // Case status editor translations
  judicial_decision_label: "Decisión Judicial",
  respondent_brief_status: "Estado del Escrito del Compareciente",
  dhs_brief_status: "Estado del Escrito del DHS",
  next_hearing_label: "Próxima Audiencia",
  no_future_hearings_admin: "No hay audiencias futuras para este caso.",
  case_information: "Información del Caso",
  registration_number: "Número de Registro",
  full_name: "Nombre Completo",
  case_status: "Estado del Caso",
  court_address_label: "Dirección del Tribunal",
  court_phone_label: "Teléfono del Tribunal",
  appeal_received_date_label: "Fecha de Recepción de Apelación",
  next_hearing_date_label: "Próxima Fecha de Audiencia",
  edit_case_status: "Editar Estado del Caso",
  update_case_status: "Actualizar Estado del Caso",
  case_status_updated: "Estado del caso actualizado exitosamente",
  error_updating_case_status: "Error al actualizar el estado del caso",
  appeal_information: "Información de Apelación",
  brief_status: "Estado de Escritos",
  hearing_information: "Información de Audiencias"
}

const dictionaries: Record<Lang, Dictionary> = { es, en }

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  tAsync: (key: string) => Promise<string>
  autoTranslateEnabled: boolean
  setAutoTranslateEnabled: (enabled: boolean) => void
  getAutoTranslateStats: () => { size: number; keys: string[] }
  clearAutoTranslateCache: () => void
  exportAutoTranslations: () => Record<string, { es: string; en: string }>
  importAutoTranslations: (translations: Record<string, { es: string; en: string }>) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es")
  const [autoTranslateEnabled, setAutoTranslateEnabledState] = useState(true)

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null
    if (saved === "en" || saved === "es") setLangState(saved)
    
    // Cargar configuración de traducción automática
    const autoTranslateConfig = typeof window !== "undefined" ? 
      localStorage.getItem("auto-translate-enabled") : null
    if (autoTranslateConfig !== null) {
      setAutoTranslateEnabledState(JSON.parse(autoTranslateConfig))
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem("lang", l)
    } catch {}
  }

  const setAutoTranslateEnabled = (enabled: boolean) => {
    setAutoTranslateEnabledState(enabled)
    autoTranslateService.updateConfig({ enabled })
    try {
      localStorage.setItem("auto-translate-enabled", JSON.stringify(enabled))
    } catch {}
  }

  // Función de traducción síncrona (comportamiento original)
  const t = useCallback((key: string) => {
    const translation = dictionaries[lang][key]
    if (translation) {
      return translation
    }
    
    // Si no existe la traducción y la traducción automática está habilitada,
    // devolver la clave para que se pueda usar tAsync después
    return key
  }, [lang])

  // Función de traducción asíncrona con traducción automática
  const tAsync = useCallback(async (key: string) => {
    const translation = dictionaries[lang][key]
    if (translation) {
      return translation
    }

    // Skip translation for very short texts, numbers, or codes
    if (key.length < 3 || /^\d+$/.test(key) || /^[A-Z]{2,3}$/.test(key)) {
      return key
    }

    // Si no existe la traducción y la traducción automática está habilitada,
    // intentar traducir automáticamente
    if (autoTranslateEnabled) {
      try {
        // Add timeout to prevent hanging promises
        const translationPromise = translateMissingText(key, lang)
        const timeoutPromise = new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Translation timeout')), 3000)
        )

        const translatedText = await Promise.race([translationPromise, timeoutPromise])
        return translatedText
      } catch (error) {
        console.warn(`Error traduciendo "${key}":`, error)
        return key
      }
    }

    return key
  }, [lang, autoTranslateEnabled])

  const getAutoTranslateStats = useCallback(() => {
    return autoTranslateService.getCacheStats()
  }, [])

  const clearAutoTranslateCache = useCallback(() => {
    autoTranslateService.clearCache()
  }, [])

  const exportAutoTranslations = useCallback(() => {
    return autoTranslateService.exportTranslations()
  }, [])

  const importAutoTranslations = useCallback((translations: Record<string, { es: string; en: string }>) => {
    autoTranslateService.importTranslations(translations)
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t,
      tAsync,
      autoTranslateEnabled,
      setAutoTranslateEnabled,
      getAutoTranslateStats,
      clearAutoTranslateCache,
      exportAutoTranslations,
      importAutoTranslations,
    }),
    [lang, t, tAsync, autoTranslateEnabled, getAutoTranslateStats, clearAutoTranslateCache, exportAutoTranslations, importAutoTranslations]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}


