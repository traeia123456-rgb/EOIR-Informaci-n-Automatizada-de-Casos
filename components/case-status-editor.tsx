"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, AlertCircle, CheckCircle, Edit, Calendar, FileText, MapPin, Phone } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { translateMissingText } from "@/lib/auto-translate"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface ImmigrationCase {
  id: string
  registration_number: string
  full_name: string
  appeal_status: string
  court_address: string | null
  court_phone: string | null
  appeal_received_date: string | null
  next_hearing_date: string | null
  next_hearing_info: string | null
  brief_status_respondent: string
  brief_status_dhs: string
  judicial_decision: string | null
  decision_date: string | null
  decision_court_address: string | null
  created_at: string
  updated_at: string
}

interface CaseStatusEditorProps {
  user: AdminUser
  caseId?: string
  onStatusUpdate?: () => void
}

export default function CaseStatusEditor({ user, caseId, onStatusUpdate }: CaseStatusEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [selectedCase, setSelectedCase] = useState<ImmigrationCase | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [cases, setCases] = useState<ImmigrationCase[]>([])

  const { t, lang, tAsync } = useLanguage()
  const [translatedTexts, setTranslatedTexts] = useState({
    judicialDecision: "",
    nextHearingInfo: "",
    briefStatusRespondent: "",
    briefStatusDhs: "",
  })

  const [formData, setFormData] = useState({
    appeal_status: "pending",
    appeal_received_date: "",
    brief_status_respondent: "Todavía no se ha fijado una fecha límite para la presentación de escritos legales.",
    brief_status_dhs: "Todavía no se ha fijado una fecha límite para la presentación de escritos legales.",
    next_hearing_date: "",
    next_hearing_info: "",
    judicial_decision: "",
    decision_date: "",
    decision_court_address: "",
  })

  const supabase = createClient()
  const router = useRouter()

  const loadSpecificCase = useCallback(async (id: string) => {
    try {
      console.log("Cargando caso específico con ID:", id)
      const { data, error } = await supabase
        .from("immigration_cases")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error en la consulta del caso específico:", error)
        throw error
      }
      
      console.log("Caso cargado correctamente:", data?.id)
      setSelectedCase(data)
      setFormData({
        appeal_status: data.appeal_status,
        appeal_received_date: data.appeal_received_date || "",
        brief_status_respondent: data.brief_status_respondent || "Todavía no se ha fijado una fecha límite para la presentación de escritos legales.",
        brief_status_dhs: data.brief_status_dhs || "Todavía no se ha fijado una fecha límite para la presentación de escritos legales.",
        next_hearing_date: data.next_hearing_date || "",
        next_hearing_info: data.next_hearing_info || "",
        judicial_decision: data.judicial_decision || "",
        decision_date: data.decision_date || "",
        decision_court_address: data.decision_court_address || "",
      })
    } catch (error) {
      console.error("Error loading case:", error)
      setError("Error al cargar el caso")
    }
  }, [supabase])

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
      setError("Error al cargar los casos")
    }
  }, [supabase])

  useEffect(() => {
    if (caseId) {
      loadSpecificCase(caseId)
    } else {
      loadCases()
    }
  }, [caseId, loadCases, loadSpecificCase])

  // Translate dynamic texts when language or case data changes
  useEffect(() => {
    const translateTexts = async () => {
      if (selectedCase) {
        try {
          const translations = {
            judicialDecision: selectedCase.judicial_decision ? await tAsync(selectedCase.judicial_decision) : "",
            nextHearingInfo: selectedCase.next_hearing_info ? await tAsync(selectedCase.next_hearing_info) : "",
            briefStatusRespondent: selectedCase.brief_status_respondent ? await tAsync(selectedCase.brief_status_respondent) : "",
            briefStatusDhs: selectedCase.brief_status_dhs ? await tAsync(selectedCase.brief_status_dhs) : "",
          }
          setTranslatedTexts(translations)
        } catch (error) {
          console.warn('Error translating case texts:', error)
          // Fallback to original texts if translation fails
          setTranslatedTexts({
            judicialDecision: selectedCase.judicial_decision || "",
            nextHearingInfo: selectedCase.next_hearing_info || "",
            briefStatusRespondent: selectedCase.brief_status_respondent || "",
            briefStatusDhs: selectedCase.brief_status_dhs || "",
          })
        }
      }
    }

    translateTexts()
  }, [lang, selectedCase, tAsync])

  const handleInputChange = (field: string, value: string) => {
    // Manejar campos de fecha específicamente
    if (field === 'appeal_received_date' ||
        field === 'next_hearing_date' ||
        field === 'decision_date') {
      // Para inputs de fecha HTML5, el valor ya viene en formato YYYY-MM-DD
      // Solo validar que no esté vacío
      setFormData((prev) => ({
        ...prev,
        [field]: value || ""
      }))
    } else {
      // Para campos que no son de fecha
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleEditCase = (case_: ImmigrationCase) => {
    setSelectedCase(case_)
    setFormData({
      appeal_status: case_.appeal_status,
      appeal_received_date: case_.appeal_received_date || "",
      brief_status_respondent: case_.brief_status_respondent,
      brief_status_dhs: case_.brief_status_dhs,
      next_hearing_date: case_.next_hearing_date || "",
      next_hearing_info: case_.next_hearing_info || "",
      judicial_decision: case_.judicial_decision || "",
      decision_date: case_.decision_date || "",
      decision_court_address: case_.decision_court_address || "",
    })
    setIsEditMode(true)
    setError("")
    setSuccess("")
  }

  const resetForm = () => {
    if (selectedCase) {
      setFormData({
        appeal_status: selectedCase.appeal_status,
        appeal_received_date: selectedCase.appeal_received_date || "",
        brief_status_respondent: selectedCase.brief_status_respondent,
        brief_status_dhs: selectedCase.brief_status_dhs,
        next_hearing_date: selectedCase.next_hearing_date || "",
        next_hearing_info: selectedCase.next_hearing_info || "",
        judicial_decision: selectedCase.judicial_decision || "",
        decision_date: selectedCase.decision_date || "",
        decision_court_address: selectedCase.decision_court_address || "",
      })
    }
    setIsEditMode(false)
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCase) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error: updateError } = await supabase
        .from("immigration_cases")
        .update({
          ...formData,
          appeal_received_date: formData.appeal_received_date || null,
          next_hearing_date: formData.next_hearing_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCase.id)

      if (updateError) throw updateError

      // Log the action
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "UPDATE_CASE_STATUS",
        resource_type: "IMMIGRATION_CASE",
        resource_id: selectedCase.registration_number,
        details: {
          case_name: selectedCase.full_name,
          appeal_status: formData.appeal_status,
          updated_case_id: selectedCase.id,
        },
      })

      setSuccess(t("case_status_updated"))
      resetForm()
      if (onStatusUpdate) {
        onStatusUpdate() // Llamar a onStatusUpdate después de actualizar el estado
      }
      if (!caseId) {
        loadCases()
      }
    } catch (err) {
      console.error("Error updating case status:", err)
      setError(t("error_updating_case_status"))
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pendiente: { label: "Pendiente", variant: "secondary" as const },
      "En Progreso": { label: "En Progreso", variant: "default" as const },
      Completado: { label: "Completado", variant: "default" as const },
      Rechazado: { label: "Rechazado", variant: "destructive" as const },
      Apelado: { label: "Apelado", variant: "outline" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No especificada"
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  // Función auxiliar para convertir texto con asteriscos (*texto*) a HTML con negritas
  const formatTextWithBold = (text: string | null): string => {
    if (!text) return ""
    
    // Reemplazar texto entre asteriscos con etiquetas de negrita
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
  }

  const filteredCases = cases.filter(
    (case_) =>
      case_.registration_number?.includes(searchTerm) ||
      case_.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (caseId && selectedCase) {
    // Show editor for specific case
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Editor de Estado del Caso</h2>
          <div className="flex gap-2">
            {caseId && (
              <Button
                variant="outline"
                onClick={() => router.push("/admin/dashboard")}
              >
                Volver al Dashboard
              </Button>
            )}
            {isEditMode && (
              <Button variant="outline" onClick={resetForm}>
                Cancelar Edición
              </Button>
            )}
            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)}>
                <Edit className="w-4 h-4 mr-2" />
                {t("edit_case_status")}
              </Button>
            )}
          </div>
        </div>

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

        {/* Case Information Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información del Caso
            </CardTitle>
            <CardDescription>
              {t("case_information")}: {selectedCase.registration_number} - {selectedCase.full_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t("registration_number")}</Label>
                <p className="font-mono text-lg">{selectedCase.registration_number}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t("full_name")}</Label>
                <p className="text-lg font-medium">{selectedCase.full_name}</p>
              </div>
            </div>
            
            {selectedCase.court_address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("court_address_label")}</Label>
                  <p className="whitespace-pre-line">{selectedCase.court_address}</p>
                </div>
              </div>
            )}
            
            {selectedCase.court_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("court_phone_label")}</Label>
                  <p>{selectedCase.court_phone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Editor Form */}
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>{t("edit_case_status")}</CardTitle>
              <CardDescription>
                Actualice la información del estado del caso de inmigración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Appeal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">{t("appeal_information")}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appeal_status">{t("case_status")}</Label>
                      <Select
                        value={formData.appeal_status}
                        onValueChange={(value) => handleInputChange("appeal_status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En Progreso">En Progreso</SelectItem>
                          <SelectItem value="Completado">Completado</SelectItem>
                          <SelectItem value="Rechazado">Rechazado</SelectItem>
                          <SelectItem value="Apelado">Apelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appeal_received_date">{t("appeal_received_date_label")}</Label>
                      <Input
                        id="appeal_received_date"
                        type="date"
                        value={formData.appeal_received_date}
                        onChange={(e) => handleInputChange("appeal_received_date", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Brief Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">{t("brief_status")}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brief_status_respondent">{t("respondent_brief_status")}</Label>
                      <Textarea
                        id="brief_status_respondent"
                        value={formData.brief_status_respondent}
                        onChange={(e) => handleInputChange("brief_status_respondent", e.target.value)}
                        placeholder="Ingrese el estado del escrito..."
                        rows={3}
                        className="font-normal"
                      />
                      <p className="text-sm text-muted-foreground">
                        Use *texto* para negrita, saltos de línea para párrafos nuevos
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brief_status_dhs">{t("dhs_brief_status")}</Label>
                      <Select
                        value={formData.brief_status_dhs}
                        onValueChange={(value) => handleInputChange("brief_status_dhs", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todavía no se ha fijado una fecha límite para la presentación de escritos legales.">
                            No se ha fijado fecha límite
                          </SelectItem>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="Presentado">Presentado</SelectItem>
                          <SelectItem value="Vencido">Vencido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Hearing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">{t("hearing_information")}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="next_hearing_date">{t("next_hearing_date_label")}</Label>
                      <Input
                        id="next_hearing_date"
                        type="date"
                        value={formData.next_hearing_date}
                        onChange={(e) => handleInputChange("next_hearing_date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_hearing_info">{t("next_hearing_info")}</Label>
                    <Textarea
                      id="next_hearing_info"
                      value={formData.next_hearing_info}
                      onChange={(e) => handleInputChange("next_hearing_info", e.target.value)}
                      placeholder="Información adicional sobre la próxima audiencia..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Judicial Decision */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">{t("judicial_decision_label")}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="judicial_decision">{t("judicial_decision_label")}</Label>
                      <Input
                        id="judicial_decision"
                        value={formData.judicial_decision}
                        onChange={(e) => handleInputChange("judicial_decision", e.target.value)}
                        placeholder={t("judicial_decision_placeholder")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="decision_date">{t("decision_date")}</Label>
                      <Input
                        id="decision_date"
                        type="date"
                        value={formData.decision_date}
                        onChange={(e) => handleInputChange("decision_date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decision_court_address">{t("decision_court_address")}</Label>
                    <Textarea
                      id="decision_court_address"
                      value={formData.decision_court_address}
                      onChange={(e) => handleInputChange("decision_court_address", e.target.value)}
                      placeholder="Dirección del tribunal donde se tomó la decisión..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-[#1A365D] hover:bg-[#2A4A6D]">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Actualizando..." : t("update_case_status")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Status Display */}
        {!isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>{t("case_status")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("case_status")}</Label>
                  <div className="mt-1">{getStatusBadge(selectedCase.appeal_status)}</div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("appeal_received_date_label")}</Label>
                  <p className="mt-1">{formatDate(selectedCase.appeal_received_date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("respondent_brief_status")}</Label>
                  <div
                    className="whitespace-pre-line mt-1"
                    dangerouslySetInnerHTML={{
                      __html: formatTextWithBold(translatedTexts.briefStatusRespondent)
                    }}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("dhs_brief_status")}</Label>
                  <p className="mt-1">{translatedTexts.briefStatusDhs}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t("next_hearing_label")}</Label>
                <div className="mt-1">
                  {selectedCase.next_hearing_date ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(selectedCase.next_hearing_date)}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t("no_future_hearings_admin")}</p>
                  )}
                </div>
                {selectedCase.next_hearing_info && (
                  <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: formatTextWithBold(translatedTexts.nextHearingInfo) }}></p>
                )}
              </div>

              {selectedCase.judicial_decision && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t("judicial_decision_label")}</Label>
                  <p className="mt-1">{translatedTexts.judicialDecision}</p>
                  {selectedCase.decision_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Fecha: {formatDate(selectedCase.decision_date)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Show case selector if no specific case is selected
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor de Estado de Casos</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Caso para Editar</CardTitle>
          <CardDescription>
            Busque y seleccione un caso para editar su estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por número de registro o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCases.map((case_) => (
                <div
                  key={case_.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEditCase(case_)}
                >
                  <div>
                    <p className="font-medium">{case_.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Número: {case_.registration_number}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(case_.appeal_status)}
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
