import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import AlertBanner from "@/components/alert-banner"
import { Footer } from "@/components/footer"
import Image from "next/image"
import CaseInformationContent from "@/components/case-information-content"
import { Breadcrumb } from "@/components/breadcrumb"
import { CaseHeader } from "@/components/case-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Consulta de Caso de Inmigración",
  description: "Consulta el estado de tu caso de inmigración usando tu número de registro (A-Number). Información actualizada sobre audiencias, decisiones judiciales y estado de apelaciones.",
  keywords: ["consulta caso inmigración", "A-Number", "número de registro", "estado caso EOIR", "audiencia inmigración", "decisión judicial inmigración"],
  openGraph: {
    title: "Consulta tu Caso de Inmigración | EOIR",
    description: "Consulta el estado de tu caso de inmigración usando tu número de registro (A-Number)",
  },
}

export const dynamic = "force-dynamic"
export const revalidate = 0


interface CaseData {
  id: string
  registration_number: string
  full_name: string
  nationality: string
  cause_list_date: string | null
  appeal_received_date: string | null
  appeal_status: string
  brief_status_respondent: string | null
  brief_status_dhs: string | null
  court_address: string | null
  court_phone: string | null
  next_hearing_date: string | null
  next_hearing_info: string | null
  judicial_decision: string | null
  decision_date: string | null
  decision_court_address: string | null
}

export default async function CaseInformationPage({
  searchParams,
}: {
  searchParams: { registration?: string, nationality?: string }
}) {
  const registrationNumber = searchParams.registration
  const nationality = searchParams.nationality

  if (!registrationNumber || !nationality) {
    redirect("/")
  }

  const supabase = await createClient()

  const { data: caseData, error } = await supabase
    .from("immigration_cases")
    .select("*")
    .eq("registration_number", registrationNumber)
    .eq("nationality", nationality)
    .single()

  if (error || !caseData) {
    redirect(`/?error=case-not-found&registration=${registrationNumber}&nationality=${nationality}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AlertBanner />

      {/* Breadcrumb */}
      <Breadcrumb 
        caseData={{
          full_name: caseData.full_name,
          registration_number: caseData.registration_number,
          nationality: caseData.nationality
        }}
      />

      {/* Court Icon and Title */}
      <CaseHeader caseData={caseData} />

      {/* Main Content moved to client component for i18n */}
      <CaseInformationContent caseData={caseData as any} />

      <Footer />
    </div>
  )
}
