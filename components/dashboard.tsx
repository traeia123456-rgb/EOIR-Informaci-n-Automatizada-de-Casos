"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Settings, LogOut, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CaseManagement from "./case-management"
import CaseTracking from "./case-tracking"
import ReportsSection from "./reports-section"
import CaseStatusEditor from "./case-status-editor"
import TemplateManagement from "./template-management/TemplateManagement"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

interface AdminDashboardProps {
  user: AdminUser
}

interface DashboardStats {
  totalCases: number
  activeCases: number
  scheduledHearings: number
  totalAdmins: number
  pendingCases: number
  completedCases: number
  rejectedCases: number
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalCases: 0,
    activeCases: 0,
    scheduledHearings: 0,
    totalAdmins: 0,
    pendingCases: 0,
    completedCases: 0,
    rejectedCases: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Función para verificar la autenticación
  const checkAuth = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      console.error("Error de autenticación:", error)
      router.push('/admin/login')
    }
  }, [supabase, router])

  const loadDashboardStats = useCallback(async () => {
    try {
      // Get total cases
      const { count: totalCases } = await supabase.from("immigration_cases").select("*", { count: "exact", head: true })

      // Get active cases (cases with pending appeals or in review)
      const { count: activeCases } = await supabase
        .from("immigration_cases")
        .select("*", { count: "exact", head: true })
        .or("appeal_status.ilike.%pending%,appeal_status.ilike.%in_review%")

      // Get pending cases (same as active cases)
      const { count: pendingCases } = await supabase
        .from("immigration_cases")
        .select("*", { count: "exact", head: true })
        .or("appeal_status.ilike.%pending%,appeal_status.ilike.%in_review%")

      // Get completed cases (cases with approved status)
      const { count: completedCases } = await supabase
        .from("immigration_cases")
        .select("*", { count: "exact", head: true })
        .ilike("appeal_status", "%approved%")

      // Get rejected cases (cases with rejected status)
      const { count: rejectedCases } = await supabase
        .from("immigration_cases")
        .select("*", { count: "exact", head: true })
        .ilike("appeal_status", "%rejected%")

      // Get scheduled hearings (cases with future hearing dates)
      const { count: scheduledHearings } = await supabase
        .from("immigration_cases")
        .select("*", { count: "exact", head: true })
        .not("next_hearing_date", "is", null)
        .gte("next_hearing_date", new Date().toISOString().split("T")[0])

      // Get total admins
      const { count: totalAdmins } = await supabase.from("admin_users").select("*", { count: "exact", head: true })

      setStats({
        totalCases: totalCases || 0,
        activeCases: activeCases || 0,
        scheduledHearings: scheduledHearings || 0,
        totalAdmins: totalAdmins || 0,
        pendingCases: pendingCases || 0,
        completedCases: completedCases || 0,
        rejectedCases: rejectedCases || 0,
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      // Fallback: usar consultas más simples si las complejas fallan
      try {
        const { count: totalCases } = await supabase.from("immigration_cases").select("*", { count: "exact", head: true })
        const { count: totalAdmins } = await supabase.from("admin_users").select("*", { count: "exact", head: true })
        
        setStats({
          totalCases: totalCases || 0,
          activeCases: totalCases || 0,
          scheduledHearings: 0,
          totalAdmins: totalAdmins || 0,
          pendingCases: totalCases || 0,
          completedCases: 0,
          rejectedCases: 0,
        })
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
        setStats({
          totalCases: 0,
          activeCases: 0,
          scheduledHearings: 0,
          totalAdmins: 0,
          pendingCases: 0,
          completedCases: 0,
          rejectedCases: 0,
        })
      }
    } finally {
      setLoadingStats(false)
    }
  }, [supabase])

  useEffect(() => {
    loadDashboardStats();
    checkAuth();
  }, [loadDashboardStats, checkAuth]);

  const handleLogout = async () => {
    setLoading(true)

    // Log the logout action
    await supabase.from("admin_audit_log").insert({
      admin_id: user.id,
      action: "LOGOUT",
      resource_type: "AUTH",
      details: { email: user.email },
    })

    await supabase.auth.signOut()
    router.push("/admin/login")
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
                <h1 className="text-xl font-bold">Panel de Administración EOIR</h1>
                <p className="text-sm text-blue-200">Sistema de Gestión de Casos de Inmigración</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.full_name}</p>
                <p className="text-xs text-blue-200">{user.role}</p>
              </div>
              <Button
                onClick={handleLogout}
                disabled={loading}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-[#1A365D] bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Alert */}
        <Alert className="mb-6 border-[#FED700] bg-[#FED700]/10">
          <AlertCircle className="h-4 w-4 text-[#1A365D]" />
          <AlertDescription className="text-[#1A365D]">
            Bienvenido al sistema de administración EOIR. Desde aquí puede gestionar casos de inmigración, generar
            reportes y administrar el sistema.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Casos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalCases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Casos registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loadingStats ? "..." : stats.activeCases.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Casos pendientes de resolución</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audiencias Programadas</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loadingStats ? "..." : stats.scheduledHearings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Próximas audiencias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loadingStats ? "..." : stats.totalAdmins.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Usuarios con acceso administrativo</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casos Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loadingStats ? "..." : stats.pendingCases.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casos Completados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loadingStats ? "..." : stats.completedCases.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casos Rechazados</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loadingStats ? "..." : stats.rejectedCases.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="cases">Gestión de Casos</TabsTrigger>
            <TabsTrigger value="status">Estado de Casos</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-6">
            <CaseManagement user={user} onStatsUpdate={loadDashboardStats} />
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <CaseStatusEditor user={user} onStatusUpdate={loadDashboardStats} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplateManagement user={user} />
          </TabsContent>



          <TabsContent value="tracking" className="space-y-6">
            <CaseTracking user={user} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsSection user={user} stats={stats} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Configuración del Sistema</h2>

            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Administre la configuración del sistema y usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usuario Actual</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rol de Usuario</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Fecha de Registro</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
