import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import CaseStatusEditor from "@/components/case-status-editor"

interface CaseStatusPageProps {
  params: {
    id: string
  }
}

export default async function CaseStatusPage({ params }: CaseStatusPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login")
  }

  // Check if user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (adminError || !adminData) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1A365D] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-[#1A365D] rounded-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Editor de Estado de Caso</h1>
                <p className="text-sm text-blue-200">Información automatizada de casos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{adminData.full_name}</p>
                <p className="text-xs text-blue-200">{adminData.role}</p>
              </div>
              <a
                href="/admin/dashboard"
                className="px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-[#1A365D] transition-colors"
              >
                Volver al Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CaseStatusEditor user={adminData} caseId={params.id} />
      </main>
    </div>
  )
}
