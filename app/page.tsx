import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { Footer } from "@/components/footer"
import DisclaimerModal from "@/components/disclaimer-modal"
import { ErrorMessage } from "@/components/error-message"

const AlertBanner = dynamic(() => import("@/components/alert-banner"), { ssr: false })

export default function HomePage({
  searchParams,
}: {
  searchParams: { error?: string, registration?: string, nationality?: string }
}) {
  return (
    <div className="min-h-screen bg-white">
      <DisclaimerModal />
      <Header />
      <AlertBanner />
      {searchParams.error === "case-not-found" && (
        <ErrorMessage 
          registration={searchParams.registration} 
          nationality={searchParams.nationality} 
        />
      )}
      <MainContent />
      <Footer />
    </div>
  )
}
