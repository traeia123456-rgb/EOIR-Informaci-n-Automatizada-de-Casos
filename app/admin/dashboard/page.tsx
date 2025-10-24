import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import AdminDashboard from "@/components/dashboard"

export default async function DashboardPage() {
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

  return <AdminDashboard user={adminData} />
}
