"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, BarChart3, PieChart, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { 
  generateCasesSummaryReport, 
  generateDetailedCasesReport, 
  generateHearingsScheduleReport, 
  generateStatisticsReport, 
  downloadPDF 
} from "@/lib/pdf-generator"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
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

interface ReportsSectionProps {
  user: AdminUser
  stats: DashboardStats
}

interface CaseData {
  id: string
  alien_registration_number: string
  full_name: string
  case_status: string
  court_location: string
  appeal_received_date: string | null
  next_hearing_date: string | null
  created_at: string
  updated_at: string
}

export default function ReportsSection({ user, stats }: ReportsSectionProps) {
  const [reportType, setReportType] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [cases, setCases] = useState<CaseData[]>([])

  const supabase = createClient()

  const loadCases = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("immigration_cases")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error("Error loading cases:", error)
    }
  }, [supabase])

  useEffect(() => {
    loadCases()
  }, [loadCases])

  const filterCasesByDate = (cases: CaseData[], dateFrom?: string, dateTo?: string): CaseData[] => {
    if (!dateFrom && !dateTo) return cases

    return cases.filter((case_) => {
      const caseDate = new Date(case_.created_at)
      const fromDate = dateFrom ? new Date(dateFrom) : new Date("1900-01-01")
      const toDate = dateTo ? new Date(dateTo) : new Date("2100-12-31")

      return caseDate >= fromDate && caseDate <= toDate
    })
  }

  const handleGenerateReport = async () => {
    if (!reportType) {
      setError("Por favor seleccione un tipo de reporte")
      return
    }

    setLoading(true)
    setProgress(0)
    setError("")
    setSuccess("")

    try {
      // Simulate progress
      setProgress(20)

      // Filter cases by date if specified
      const filteredCases = filterCasesByDate(cases, dateFrom, dateTo)
      const dateRange = dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined

      setProgress(40)

      let pdfData: Uint8Array
      let filename: string

      setProgress(60)

      switch (reportType) {
        case "cases-summary":
          pdfData = await generateCasesSummaryReport(filteredCases, stats, dateRange)
          filename = `resumen-casos-${new Date().toISOString().split("T")[0]}.pdf`
          break

        case "cases-detailed":
          pdfData = await generateDetailedCasesReport(filteredCases, dateRange)
          filename = `casos-detallados-${new Date().toISOString().split("T")[0]}.pdf`
          break

        case "hearings-schedule":
          pdfData = await generateHearingsScheduleReport(filteredCases)
          filename = `calendario-audiencias-${new Date().toISOString().split("T")[0]}.pdf`
          break

        case "statistics":
          pdfData = await generateStatisticsReport(stats, filteredCases)
          filename = `estadisticas-${new Date().toISOString().split("T")[0]}.pdf`
          break

        case "audit-log":
          // For audit log, we'll generate a basic report (could be expanded)
          pdfData = await generateCasesSummaryReport(filteredCases, stats, dateRange)
          filename = `registro-auditoria-${new Date().toISOString().split("T")[0]}.pdf`
          break

        default:
          throw new Error("Tipo de reporte no válido")
      }

      setProgress(80)

      // Log the action
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "GENERATE_REPORT",
        resource_type: "PDF_REPORT",
        resource_id: reportType,
        details: {
          report_type: reportType,
          date_range: dateRange,
          cases_count: filteredCases.length,
          filename: filename,
        },
      })

      setProgress(90)

      // Download the PDF
      downloadPDF(pdfData, filename)

      setProgress(100)
      setSuccess(`Reporte "${getReportTypeLabel(reportType)}" generado y descargado exitosamente`)

      // Reset form
      setTimeout(() => {
        setProgress(0)
        setReportType("")
        setDateFrom("")
        setDateTo("")
      }, 2000)
    } catch (err) {
      console.error("Error generating report:", err)
      setError("Error al generar el reporte. Por favor intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickReport = async (type: string) => {
    setReportType(type)
    // Set date range for current month for quick reports
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    setDateFrom(firstDay.toISOString().split("T")[0])
    setDateTo(now.toISOString().split("T")[0])

    // Trigger report generation
    setTimeout(() => {
      handleGenerateReport()
    }, 100)
  }

  const getReportTypeLabel = (type: string): string => {
    const labels = {
      "cases-summary": "Resumen de Casos",
      "cases-detailed": "Casos Detallados",
      "hearings-schedule": "Calendario de Audiencias",
      statistics: "Estadísticas del Sistema",
      "audit-log": "Registro de Auditoría",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generación de Reportes</h2>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumen de Estados</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pendientes:</span>
                <span className="font-medium">{stats.pendingCases}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completados:</span>
                <span className="font-medium">{stats.completedCases}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rechazados:</span>
                <span className="font-medium">{stats.rejectedCases}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad del Sistema</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total de Casos:</span>
                <span className="font-medium">{stats.totalCases}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Casos Activos:</span>
                <span className="font-medium">{stats.activeCases}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Audiencias:</span>
                <span className="font-medium">{stats.scheduledHearings}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administración</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Administradores:</span>
                <span className="font-medium">{stats.totalAdmins}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Usuario Actual:</span>
                <span className="font-medium text-xs">{user.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generar Reportes PDF</CardTitle>
          <CardDescription>Genere reportes detallados de casos y documentos oficiales en formato PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generando reporte...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Tipo de Reporte *</Label>
                <Select value={reportType} onValueChange={setReportType} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cases-summary">Resumen de Casos</SelectItem>
                    <SelectItem value="cases-detailed">Casos Detallados</SelectItem>
                    <SelectItem value="hearings-schedule">Calendario de Audiencias</SelectItem>
                    <SelectItem value="statistics">Estadísticas del Sistema</SelectItem>
                    <SelectItem value="audit-log">Registro de Auditoría</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from">Fecha Desde (Opcional)</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">Fecha Hasta (Opcional)</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateReport}
                disabled={loading || !reportType}
                className="bg-[#1A365D] hover:bg-[#2A4A6D]"
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? "Generando Reporte..." : "Generar Reporte PDF"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Rápidos</CardTitle>
          <CardDescription>Genere reportes predefinidos del mes actual con un solo clic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              onClick={() => handleQuickReport("cases-summary")}
              disabled={loading}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">Resumen del Mes</span>
              <span className="text-xs text-muted-foreground">Casos del mes actual</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              onClick={() => handleQuickReport("statistics")}
              disabled={loading}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-medium">Estadísticas</span>
              <span className="text-xs text-muted-foreground">Análisis estadístico</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              onClick={() => handleQuickReport("hearings-schedule")}
              disabled={loading}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-medium">Audiencias</span>
              <span className="text-xs text-muted-foreground">Calendario de audiencias</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
