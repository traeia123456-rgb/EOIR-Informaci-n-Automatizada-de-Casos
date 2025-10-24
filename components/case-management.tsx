"use client"

import type React from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, AlertCircle, CheckCircle, Edit, Trash2, RefreshCw, FileText } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface CaseManagementProps {
  user: AdminUser
  onStatsUpdate: () => void
}

interface ImmigrationCase {
  id: string
  registration_number: string
  full_name: string
  nationality: string
  cause_list_date: string | null
  appeal_status: string
  court_phone: string | null
  appeal_received_date: string | null
  next_hearing_date: string | null
  hearing_notes: string | null
  decision: string | null
  decision_date: string | null
  decision_summary: string | null
  appeal_board_info: string | null
  created_at: string
  updated_at: string
  decision_court_address: string | null
  next_hearing_info: string | null
  court_address: string | null
}

export default function CaseManagement({ user, onStatsUpdate }: CaseManagementProps): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [cases, setCases] = useState<ImmigrationCase[]>([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCase, setSelectedCase] = useState<ImmigrationCase | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [caseToDelete, setCaseToDelete] = useState<ImmigrationCase | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("standard")
  const router = useRouter()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    registration_number: "",
    full_name: "",
    nationality: "",
    cause_list_date: "",
    appeal_status: "pending",
    court_phone: "",
    appeal_received_date: "",
    next_hearing_date: "",
    hearing_notes: "",
    decision: "",
    decision_date: "",
    decision_summary: "",
    appeal_board_info: "",
    decision_court_address: "",
    next_hearing_info: "",
    court_address: ""
  })

  const supabase = createClient()

  const loadCases = useCallback(async () => {
    try {
      setLoadingCases(true)
      console.log("Cargando casos...")
      
      const { data, error } = await supabase
        .from("immigration_cases")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error en la consulta:", error)
        throw error
      }
      
      console.log("Casos cargados:", data?.length || 0)
      setCases(data || [])
    } catch (error) {
      console.error("Error loading cases:", error)
      setError("Error al cargar los casos")
    } finally {
      setLoadingCases(false)
    }
  }, [supabase])

  // Función auxiliar para convertir texto con asteriscos (*texto*) a HTML con negritas
  const formatTextWithBold = (text: string | null): string => {
    if (!text) return ""
    
    // Reemplazar texto entre asteriscos con etiquetas de negrita
    return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
  }

  // Función auxiliar para convertir fecha a formato ISO sin problemas de zona horaria
  const formatDateForDatabase = (dateString: string): string | null => {
    if (!dateString) return null
    
    // Crear fecha en zona horaria local para evitar problemas de UTC
    const [year, month, day] = dateString.split('-').map(Number)
    const localDate = new Date(year, month - 1, day) // month - 1 porque Date() usa 0-based months
    
    // Convertir a ISO string pero mantener la fecha local
    return localDate.toISOString().split('T')[0]
  }

  // Función auxiliar para formatear fecha para mostrar
  const formatDateForDisplay = (dateString: string | null): string => {
    if (!dateString) return "No especificada"
    
    try {
      // Crear fecha en zona horaria local
      const [year, month, day] = dateString.split('-').map(Number)
      const localDate = new Date(year, month - 1, day)
      
      return localDate.toLocaleDateString("es-ES", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  useEffect(() => {
    loadCases()
    // Detectar plantilla seleccionada
    const template = localStorage.getItem('selectedTemplate') || 'standard'
    setSelectedTemplate(template)
    // Limpiar localStorage después de detectar
    localStorage.removeItem('selectedTemplate')
  }, [loadCases])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    
    // Manejar campos de fecha específicamente
    if (name === 'cause_list_date' ||
        name === 'appeal_received_date' ||
        name === 'next_hearing_date' ||
        name === 'decision_date') {
      // Para inputs de fecha HTML5, el valor ya viene en formato YYYY-MM-DD
      // Solo validar que no esté vacío
      setFormData(prevData => ({
        ...prevData,
        [name]: value || ""
      }))
    } else {
      // Para campos que no son de fecha
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }))
    }

    // Limpiar mensajes de error y éxito
    setError("")
    setSuccess("")
  }

  const generateAlienNumber = () => {
    // Generate a 9-digit alien registration number
    const number = Math.floor(100000000 + Math.random() * 900000000).toString()
    setFormData((prev) => ({
      ...prev,
      registration_number: number,
    }))
  }

  const resetForm = () => {
    setFormData({
      registration_number: "",
      full_name: "",
      nationality: "",
      cause_list_date: "",
      appeal_status: "pending",
      court_address: "",
      court_phone: "",
      appeal_received_date: "",
      next_hearing_date: "",
      hearing_notes: "",
      decision: "",
      decision_date: "",
      decision_summary: "",
      appeal_board_info: "",
      decision_court_address: "",
      next_hearing_info: "",
    })
    setIsEditMode(false)
    setSelectedCase(null)
  }

  const handleEditCase = (case_: ImmigrationCase) => {
    setFormData({
      registration_number: case_.registration_number,
      full_name: case_.full_name,
      nationality: case_.nationality,
      cause_list_date: case_.cause_list_date || "",
      appeal_status: case_.appeal_status,
      court_address: case_.court_address || "",
      court_phone: case_.court_phone || "",
      appeal_received_date: case_.appeal_received_date || "",
      next_hearing_date: case_.next_hearing_date || "",
      hearing_notes: case_.hearing_notes || "",
      decision: case_.decision || "",
      decision_date: case_.decision_date || "",
      decision_summary: case_.decision_summary || "",
      appeal_board_info: case_.appeal_board_info || "",
      decision_court_address: case_.decision_court_address || "",
      next_hearing_info: case_.next_hearing_info || ""
    })
    setSelectedCase(case_)
    setIsEditMode(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteCase = async (case_: ImmigrationCase) => {
    setCaseToDelete(case_)
    setShowDeleteDialog(true)
  }

  const confirmDeleteCase = async () => {
    if (!caseToDelete) return

    setLoading(true)
    try {
      const { error } = await supabase.from("immigration_cases").delete().eq("id", caseToDelete.id)

      if (error) throw error

      // Log the action
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "DELETE_CASE",
        resource_type: "IMMIGRATION_CASE",
        resource_id: caseToDelete.registration_number,
        details: {
          case_name: caseToDelete.full_name,
          deleted_case_id: caseToDelete.id,
        },
      })

      setSuccess(`Caso ${caseToDelete.registration_number} eliminado exitosamente`)
      loadCases()
      onStatsUpdate()
    } catch (error) {
      console.error("Error deleting case:", error)
      setError("Error al eliminar el caso")
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
      setCaseToDelete(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
  
    try {
      const cleanedFormData = {
        ...formData,
        court_address: formData.court_address || "915 2ND AVENUE, SUITE 613\nSEATTLE, WA 98174",
        // Asegurarse de que court_location también se actualice para mantener compatibilidad
        court_location: formData.court_address || "915 2ND AVENUE, SUITE 613\nSEATTLE, WA 98174",
      }
  
      if (selectedCase) {
        // Modo edición
        const { error: updateError } = await supabase
          .from('immigration_cases')
          .update({
            ...cleanedFormData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedCase.id)
          .select()
  
        if (updateError) throw updateError
  
        // Registrar en el historial de auditoría
        const { error: auditError } = await supabase
          .from('admin_audit_log')
          .insert({
            admin_id: user.id,
            action: 'UPDATE_CASE',
            resource_type: 'IMMIGRATION_CASE',
            resource_id: selectedCase.id,
            details: {
              old: selectedCase,
              new: cleanedFormData
            }
          })
  
        if (auditError) throw auditError
  
        setSuccess('Caso actualizado exitosamente')
        resetForm()
        loadCases()
        onStatsUpdate()
      } else {
        // Modo creación
        const { data: newCase, error: insertError } = await supabase
          .from('immigration_cases')
          .insert([{
            registration_number: cleanedFormData.registration_number,
            full_name: cleanedFormData.full_name,
            nationality: cleanedFormData.nationality,
            cause_list_date: cleanedFormData.cause_list_date,
            appeal_status: cleanedFormData.appeal_status,
            court_phone: cleanedFormData.court_phone,
            appeal_received_date: cleanedFormData.appeal_received_date,
            next_hearing_date: cleanedFormData.next_hearing_date,
            hearing_notes: cleanedFormData.hearing_notes,
            decision: cleanedFormData.decision,
            decision_date: cleanedFormData.decision_date,
            decision_summary: cleanedFormData.decision_summary,
            appeal_board_info: cleanedFormData.appeal_board_info,
            decision_court_address: cleanedFormData.decision_court_address,
            next_hearing_info: cleanedFormData.next_hearing_info,
            court_address: cleanedFormData.court_address,
            created_by: user?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
  
        if (insertError) throw insertError
  
        // Registrar en el historial de auditoría
        const { error: auditError } = await supabase
          .from('admin_audit_log')
          .insert({
            admin_id: user.id,
            action: 'CREATE_CASE',
            resource_type: 'IMMIGRATION_CASE',
            resource_id: newCase[0].id,
            details: newCase[0]
          })
  
        if (auditError) throw auditError
  
        setSuccess('Caso creado exitosamente')
        resetForm()
        loadCases()
        onStatsUpdate()
      }
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message)
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
    return formatDateForDisplay(dateString)
  }

  const filteredCases = cases.filter(
    (case_) =>
      case_.registration_number?.includes(searchTerm) ||
      case_.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (case_.court_address && case_.court_address.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Determinar si el caso es de plantilla estándar o simplificada
  /* const hasExtendedFields = case_.decision || case_.decision_date || case_.decision_summary
  const template = hasExtendedFields ? "standard" : "simplified"
  setSelectedTemplate(template) */
  
  // Actualizar campos en el formulario
  const formDataWithUpdates = {
    ...formData,
    next_hearing_notes: formData.hearing_notes,
    decision_summary: formData.decision_summary,
    decision: formData.decision
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Casos</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCases} disabled={loadingCases}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          {isEditMode && (
            <Button variant="outline" onClick={resetForm}>
              Cancelar Edición
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

      <Tabs defaultValue="form" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">{isEditMode ? "Editar Caso" : "Crear Caso"}</TabsTrigger>
          <TabsTrigger value="list">Lista de Casos</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? t("edit_case") : t("create_new_case")}</CardTitle>
              <CardDescription>
                {isEditMode
                  ? `Editando caso: ${selectedCase?.registration_number} - ${selectedCase?.full_name}`
                  : "Registre un nuevo caso en el sistema de información automatizada de casos de inmigración"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de Plantilla */}
                {!isEditMode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-blue-900">{t("selected_template")}</h3>
                        <p className="text-sm text-blue-700">
                          {selectedTemplate === "simplified" 
                            ? t("simplified_template")
                            : t("standard_template")
                          }
                        </p>
                      </div>
                      <Select
                        value={selectedTemplate}
                        onValueChange={(value) => {
                          setSelectedTemplate(value)
                          resetForm()
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simplified">Plantilla Simplificada</SelectItem>
                          <SelectItem value="standard">Plantilla Estándar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="alien_number">Número de Registro de Extranjero *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="alien_number"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleInputChange}
                        placeholder="123456789"
                        maxLength={9}
                        pattern="[0-9]{9}"
                        required
                        disabled={isEditMode}
                      />
                      {!isEditMode && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateAlienNumber}
                          className="whitespace-nowrap bg-transparent"
                        >
                          Generar
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Número de 9 dígitos</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidad *</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => {
                        handleInputChange({ target: { name: "nationality", value } })
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione Nacionalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AF">AFGANISTÁN</SelectItem>
                        <SelectItem value="AL">ALBANIA</SelectItem>
                        <SelectItem value="DE">ALEMANIA</SelectItem>
                        <SelectItem value="AD">ANDORRA</SelectItem>
                        <SelectItem value="AO">ANGOLA</SelectItem>
                        <SelectItem value="AI">ANGUILA</SelectItem>
                        <SelectItem value="AQ">ANTÁRTIDA</SelectItem>
                        <SelectItem value="AG">ANTIGUA Y BARBUDA</SelectItem>
                        <SelectItem value="SA">ARABIA SAUDITA</SelectItem>
                        <SelectItem value="DZ">ARGELIA</SelectItem>
                        <SelectItem value="AR">ARGENTINA</SelectItem>
                        <SelectItem value="AM">ARMENIA</SelectItem>
                        <SelectItem value="AW">ARUBA</SelectItem>
                        <SelectItem value="AU">AUSTRALIA</SelectItem>
                        <SelectItem value="AT">AUSTRIA</SelectItem>
                        <SelectItem value="AZ">AZERBAIYÁN</SelectItem>
                        <SelectItem value="BS">BAHAMAS</SelectItem>
                        <SelectItem value="BD">BANGLADÉS</SelectItem>
                        <SelectItem value="BB">BARBADOS</SelectItem>
                        <SelectItem value="BH">BARÉIN</SelectItem>
                        <SelectItem value="BE">BÉLGICA</SelectItem>
                        <SelectItem value="BZ">BELICE</SelectItem>
                        <SelectItem value="BJ">BENÍN</SelectItem>
                        <SelectItem value="BM">BERMUDAS</SelectItem>
                        <SelectItem value="BY">BIELORRUSIA</SelectItem>
                        <SelectItem value="BO">BOLIVIA</SelectItem>
                        <SelectItem value="BA">BOSNIA Y HERZEGOVINA</SelectItem>
                        <SelectItem value="BW">BOTSUANA</SelectItem>
                        <SelectItem value="BR">BRASIL</SelectItem>
                        <SelectItem value="BN">BRUNÉI</SelectItem>
                        <SelectItem value="BG">BULGARIA</SelectItem>
                        <SelectItem value="BF">BURKINA FASO</SelectItem>
                        <SelectItem value="BI">BURUNDI</SelectItem>
                        <SelectItem value="BT">BUTÁN</SelectItem>
                        <SelectItem value="CV">CABO VERDE</SelectItem>
                        <SelectItem value="KH">CAMBOYA</SelectItem>
                        <SelectItem value="CM">CAMERÚN</SelectItem>
                        <SelectItem value="CA">CANADÁ</SelectItem>
                        <SelectItem value="TD">CHAD</SelectItem>
                        <SelectItem value="CL">CHILE</SelectItem>
                        <SelectItem value="CN">CHINA</SelectItem>
                        <SelectItem value="CY">CHIPRE</SelectItem>
                        <SelectItem value="VA">CIUDAD DEL VATICANO</SelectItem>
                        <SelectItem value="CO">COLOMBIA</SelectItem>
                        <SelectItem value="KM">COMORAS</SelectItem>
                        <SelectItem value="CG">CONGO</SelectItem>
                        <SelectItem value="KP">COREA DEL NORTE</SelectItem>
                        <SelectItem value="KR">COREA DEL SUR</SelectItem>
                        <SelectItem value="CI">COSTA DE MARFIL</SelectItem>
                        <SelectItem value="CR">COSTA RICA</SelectItem>
                        <SelectItem value="HR">CROACIA</SelectItem>
                        <SelectItem value="CU">CUBA</SelectItem>
                        <SelectItem value="CW">CURAZAO</SelectItem>
                        <SelectItem value="DK">DINAMARCA</SelectItem>
                        <SelectItem value="DM">DOMINICA</SelectItem>
                        <SelectItem value="EC">ECUADOR</SelectItem>
                        <SelectItem value="EG">EGIPTO</SelectItem>
                        <SelectItem value="SV">EL SALVADOR</SelectItem>
                        <SelectItem value="AE">EMIRATOS ÁRABES UNIDOS</SelectItem>
                        <SelectItem value="ER">ERITREA</SelectItem>
                        <SelectItem value="SK">ESLOVAQUIA</SelectItem>
                        <SelectItem value="SI">ESLOVENIA</SelectItem>
                        <SelectItem value="ES">ESPAÑA</SelectItem>
                        <SelectItem value="US">ESTADOS UNIDOS</SelectItem>
                        <SelectItem value="EE">ESTONIA</SelectItem>
                        <SelectItem value="ET">ETIOPÍA</SelectItem>
                        <SelectItem value="PH">FILIPINAS</SelectItem>
                        <SelectItem value="FI">FINLANDIA</SelectItem>
                        <SelectItem value="FJ">FIYI</SelectItem>
                        <SelectItem value="FR">FRANCIA</SelectItem>
                        <SelectItem value="GA">GABÓN</SelectItem>
                        <SelectItem value="GM">GAMBIA</SelectItem>
                        <SelectItem value="GE">GEORGIA</SelectItem>
                        <SelectItem value="GH">GHANA</SelectItem>
                        <SelectItem value="GI">GIBRALTAR</SelectItem>
                        <SelectItem value="GD">GRANADA</SelectItem>
                        <SelectItem value="GR">GRECIA</SelectItem>
                        <SelectItem value="GL">GROENLANDIA</SelectItem>
                        <SelectItem value="GP">GUADALUPE</SelectItem>
                        <SelectItem value="GU">GUAM</SelectItem>
                        <SelectItem value="GT">GUATEMALA</SelectItem>
                        <SelectItem value="GF">GUAYANA FRANCESA</SelectItem>
                        <SelectItem value="GG">GUERNSEY</SelectItem>
                        <SelectItem value="GN">GUINEA</SelectItem>
                        <SelectItem value="GQ">GUINEA ECUATORIAL</SelectItem>
                        <SelectItem value="GW">GUINEA-BISÁU</SelectItem>
                        <SelectItem value="GY">GUYANA</SelectItem>
                        <SelectItem value="HT">HAITÍ</SelectItem>
                        <SelectItem value="HN">HONDURAS</SelectItem>
                        <SelectItem value="HK">HONG KONG</SelectItem>
                        <SelectItem value="HU">HUNGRÍA</SelectItem>
                        <SelectItem value="IN">INDIA</SelectItem>
                        <SelectItem value="ID">INDONESIA</SelectItem>
                        <SelectItem value="IQ">IRAK</SelectItem>
                        <SelectItem value="IR">IRÁN</SelectItem>
                        <SelectItem value="IE">IRLANDA</SelectItem>
                        <SelectItem value="BV">ISLA BOUVET</SelectItem>
                        <SelectItem value="IM">ISLA DE MAN</SelectItem>
                        <SelectItem value="CX">ISLA DE NAVIDAD</SelectItem>
                        <SelectItem value="NF">ISLA NORFOLK</SelectItem>
                        <SelectItem value="IS">ISLANDIA</SelectItem>
                        <SelectItem value="BM_ISLANDS">ISLAS BERMUDAS</SelectItem>
                        <SelectItem value="KY">ISLAS CAIMÁN</SelectItem>
                        <SelectItem value="CC">ISLAS COCOS (KEELING)</SelectItem>
                        <SelectItem value="CK">ISLAS COOK</SelectItem>
                        <SelectItem value="FO">ISLAS FEROE</SelectItem>
                        <SelectItem value="GS">ISLAS GEORGIAS DEL SUR Y SANDWICH DEL SUR</SelectItem>
                        <SelectItem value="HM">ISLAS HEARD Y MCDONALD</SelectItem>
                        <SelectItem value="FK">ISLAS MALVINAS</SelectItem>
                        <SelectItem value="MP">ISLAS MARIANAS DEL NORTE</SelectItem>
                        <SelectItem value="MH">ISLAS MARSHALL</SelectItem>
                        <SelectItem value="PN">ISLAS PITCAIRN</SelectItem>
                        <SelectItem value="SB">ISLAS SALOMÓN</SelectItem>
                        <SelectItem value="TC">ISLAS TURCAS Y CAICOS</SelectItem>
                        <SelectItem value="UM">ISLAS ULTRAMARINAS MENORES DE ESTADOS UNIDOS</SelectItem>
                        <SelectItem value="VG">ISLAS VÍRGENES BRITÁNICAS</SelectItem>
                        <SelectItem value="VI">ISLAS VÍRGENES DE LOS ESTADOS UNIDOS</SelectItem>
                        <SelectItem value="IL">ISRAEL</SelectItem>
                        <SelectItem value="IT">ITALIA</SelectItem>
                        <SelectItem value="JM">JAMAICA</SelectItem>
                        <SelectItem value="JP">JAPÓN</SelectItem>
                        <SelectItem value="JE">JERSEY</SelectItem>
                        <SelectItem value="JO">JORDANIA</SelectItem>
                        <SelectItem value="KZ">KAZAJISTÁN</SelectItem>
                        <SelectItem value="KE">KENIA</SelectItem>
                        <SelectItem value="KG">KIRGUISTÁN</SelectItem>
                        <SelectItem value="KI">KIRIBATI</SelectItem>
                        <SelectItem value="KW">KUWAIT</SelectItem>
                        <SelectItem value="LA">LAOS</SelectItem>
                        <SelectItem value="LS">LESOTO</SelectItem>
                        <SelectItem value="LV">LETONIA</SelectItem>
                        <SelectItem value="LB">LÍBANO</SelectItem>
                        <SelectItem value="LR">LIBERIA</SelectItem>
                        <SelectItem value="LY">LIBIA</SelectItem>
                        <SelectItem value="LI">LIECHTENSTEIN</SelectItem>
                        <SelectItem value="LT">LITUANIA</SelectItem>
                        <SelectItem value="LU">LUXEMBURGO</SelectItem>
                        <SelectItem value="MO">MACAO</SelectItem>
                        <SelectItem value="MK">MACEDONIA DEL NORTE</SelectItem>
                        <SelectItem value="MG">MADAGASCAR</SelectItem>
                        <SelectItem value="MY">MALASIA</SelectItem>
                        <SelectItem value="MW">MALAUI</SelectItem>
                        <SelectItem value="MV">MALDIVAS</SelectItem>
                        <SelectItem value="ML">MALÍ</SelectItem>
                        <SelectItem value="MT">MALTA</SelectItem>
                        <SelectItem value="MA">MARRUECOS</SelectItem>
                        <SelectItem value="MQ">MARTINICA</SelectItem>
                        <SelectItem value="MU">MAURICIO</SelectItem>
                        <SelectItem value="MR">MAURITANIA</SelectItem>
                        <SelectItem value="YT">MAYOTTE</SelectItem>
                        <SelectItem value="MX">MÉXICO</SelectItem>
                        <SelectItem value="FM">MICRONESIA</SelectItem>
                        <SelectItem value="MD">MOLDAVIA</SelectItem>
                        <SelectItem value="MC">MÓNACO</SelectItem>
                        <SelectItem value="MN">MONGOLIA</SelectItem>
                        <SelectItem value="ME">MONTENEGRO</SelectItem>
                        <SelectItem value="MS">MONTSERRAT</SelectItem>
                        <SelectItem value="MZ">MOZAMBIQUE</SelectItem>
                        <SelectItem value="MM">MYANMAR</SelectItem>
                        <SelectItem value="NA">NAMIBIA</SelectItem>
                        <SelectItem value="NR">NAURU</SelectItem>
                        <SelectItem value="NP">NEPAL</SelectItem>
                        <SelectItem value="NI">NICARAGUA</SelectItem>
                        <SelectItem value="NE">NÍGER</SelectItem>
                        <SelectItem value="NG">NIGERIA</SelectItem>
                        <SelectItem value="NU">NIUE</SelectItem>
                        <SelectItem value="NO">NORUEGA</SelectItem>
                        <SelectItem value="NC">NUEVA CALEDONIA</SelectItem>
                        <SelectItem value="NZ">NUEVA ZELANDA</SelectItem>
                        <SelectItem value="OM">OMÁN</SelectItem>
                        <SelectItem value="NL">PAÍSES BAJOS</SelectItem>
                        <SelectItem value="PK">PAKISTÁN</SelectItem>
                        <SelectItem value="PW">PALAOS</SelectItem>
                        <SelectItem value="PS">PALESTINA</SelectItem>
                        <SelectItem value="PA">PANAMÁ</SelectItem>
                        <SelectItem value="PG">PAPÚA NUEVA GUINEA</SelectItem>
                        <SelectItem value="PY">PARAGUAY</SelectItem>
                        <SelectItem value="PE">PERÚ</SelectItem>
                        <SelectItem value="PF">POLINESIA FRANCESA</SelectItem>
                        <SelectItem value="PL">POLONIA</SelectItem>
                        <SelectItem value="PT">PORTUGAL</SelectItem>
                        <SelectItem value="PR">PUERTO RICO</SelectItem>
                        <SelectItem value="QA">QATAR</SelectItem>
                        <SelectItem value="GB">REINO UNIDO</SelectItem>
                        <SelectItem value="CF">REPÚBLICA CENTROAFRICANA</SelectItem>
                        <SelectItem value="CZ">REPÚBLICA CHECA</SelectItem>
                        <SelectItem value="CD">REPÚBLICA DEMOCRÁTICA DEL CONGO</SelectItem>
                        <SelectItem value="DO">REPÚBLICA DOMINICANA</SelectItem>
                        <SelectItem value="RE">REUNIÓN</SelectItem>
                        <SelectItem value="RW">RUANDA</SelectItem>
                        <SelectItem value="RO">RUMANÍA</SelectItem>
                        <SelectItem value="RU">RUSIA</SelectItem>
                        <SelectItem value="EH">SAHARA OCCIDENTAL</SelectItem>
                        <SelectItem value="WS">SAMOA</SelectItem>
                        <SelectItem value="AS">SAMOA AMERICANA</SelectItem>
                        <SelectItem value="BL">SAN BARTOLOMÉ</SelectItem>
                        <SelectItem value="KN">SAN CRISTÓBAL Y NIEVES</SelectItem>
                        <SelectItem value="SM">SAN MARINO</SelectItem>
                        <SelectItem value="MF">SAN MARTÍN (FRANCIA)</SelectItem>
                        <SelectItem value="PM">SAN PEDRO Y MIQUELÓN</SelectItem>
                        <SelectItem value="VC">SAN VICENTE Y LAS GRANADINAS</SelectItem>
                        <SelectItem value="SH">SANTA ELENA, ASCENSIÓN Y TRISTÁN DE ACUÑA</SelectItem>
                        <SelectItem value="LC">SANTA LUCÍA</SelectItem>
                        <SelectItem value="ST">SANTO TOMÉ Y PRÍNCIPE</SelectItem>
                        <SelectItem value="SN">SENEGAL</SelectItem>
                        <SelectItem value="RS">SERBIA</SelectItem>
                        <SelectItem value="SC">SEYCHELLES</SelectItem>
                        <SelectItem value="SL">SIERRA LEONA</SelectItem>
                        <SelectItem value="SG">SINGAPUR</SelectItem>
                        <SelectItem value="SX">SINT MAARTEN</SelectItem>
                        <SelectItem value="SY">SIRIA</SelectItem>
                        <SelectItem value="SO">SOMALIA</SelectItem>
                        <SelectItem value="LK">SRI LANKA</SelectItem>
                        <SelectItem value="SZ">SUAZILANDIA</SelectItem>
                        <SelectItem value="ZA">SUDÁFRICA</SelectItem>
                        <SelectItem value="SD">SUDÁN</SelectItem>
                        <SelectItem value="SS">SUDÁN DEL SUR</SelectItem>
                        <SelectItem value="SE">SUECIA</SelectItem>
                        <SelectItem value="CH">SUIZA</SelectItem>
                        <SelectItem value="SR">SURINAM</SelectItem>
                        <SelectItem value="SJ">SVALBARD Y JAN MAYEN</SelectItem>
                        <SelectItem value="TH">TAILANDIA</SelectItem>
                        <SelectItem value="TW">TAIWÁN</SelectItem>
                        <SelectItem value="TZ">TANZANIA</SelectItem>
                        <SelectItem value="TJ">TAYIKISTÁN</SelectItem>
                        <SelectItem value="IO">TERRITORIO BRITÁNICO DEL OCÉANO ÍNDICO</SelectItem>
                        <SelectItem value="TF">TERRITORIOS AUSTRALES FRANCESES</SelectItem>
                        <SelectItem value="TL">TIMOR ORIENTAL</SelectItem>
                        <SelectItem value="TG">TOGO</SelectItem>
                        <SelectItem value="TK">TOKELAU</SelectItem>
                        <SelectItem value="TO">TONGA</SelectItem>
                        <SelectItem value="TT">TRINIDAD Y TOBAGO</SelectItem>
                        <SelectItem value="TN">TÚNEZ</SelectItem>
                        <SelectItem value="TM">TURKMENISTÁN</SelectItem>
                        <SelectItem value="TR">TURQUÍA</SelectItem>
                        <SelectItem value="TV">TUVALU</SelectItem>
                        <SelectItem value="UA">UCRANIA</SelectItem>
                        <SelectItem value="UG">UGANDA</SelectItem>
                        <SelectItem value="UY">URUGUAY</SelectItem>
                        <SelectItem value="UZ">UZBEKISTÁN</SelectItem>
                        <SelectItem value="VU">VANUATU</SelectItem>
                        <SelectItem value="VE">VENEZUELA</SelectItem>
                        <SelectItem value="VN">VIETNAM</SelectItem>
                        <SelectItem value="WF">WALLIS Y FUTUNA</SelectItem>
                        <SelectItem value="YE">YEMEN</SelectItem>
                        <SelectItem value="DJ">YIBUTI</SelectItem>
                        <SelectItem value="ZM">ZAMBIA</SelectItem>
                        <SelectItem value="ZW">ZIMBABUE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre Completo *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="APELLIDO, NOMBRE"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="case_status">Estado del Caso</Label>
                    <Select
                      value={formData.appeal_status}
                      onValueChange={(value) => {
                        handleInputChange({ target: { name: "appeal_status", value } })
                      }}
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
                    <Label htmlFor="cause_list_date">Fecha de la lista de causas</Label>
                    <Input
                      id="cause_list_date"
                      name="cause_list_date"
                      type="date"
                      value={formData.cause_list_date}
                      onChange={handleInputChange}
                    />
                  </div>
      
                  <div className="space-y-2">
                    <Label htmlFor="appeal_date">Fecha de Recepción de Apelación</Label>
                    <Input
                      id="appeal_date"
                      name="appeal_received_date"
                      type="date"
                      value={formData.appeal_received_date}
                      onChange={handleInputChange}
                    />
                  </div>
      
                  <div className="space-y-2">
                    <Label htmlFor="hearing_date">Próxima Fecha de Audiencia</Label>
                    <Input
                      id="hearing_date"
                      name="next_hearing_date"
                      type="date"
                      value={formData.next_hearing_date}
                      onChange={handleInputChange}
                    />
                  </div>
      
                  <div className="space-y-2">
                    <Label htmlFor="decision_date">Fecha de la Decisión</Label>
                    <Input
                      id="decision_date"
                      name="decision_date"
                      type="date"
                      value={formData.decision_date || ""}
                      onChange={handleInputChange}
                    />
                  </div>
      
                  <div className="space-y-2">
                    <Label htmlFor="court_address">Dirección del Tribunal</Label>
                    <Input
                      id="court_address"
                      name="court_address"
                      type="text"
                      value={formData.court_address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court_phone">{t("court_phone")}</Label>
                    <Input
                      id="court_phone"
                      name="court_phone"
                      type="tel"
                      value={formData.court_phone}
                      onChange={handleInputChange}
                      placeholder={t("court_phone_placeholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hearing_notes">Notas/Acta de la Próxima Audiencia</Label>
                    <Textarea
                      id="hearing_notes"
                      name="hearing_notes"
                      value={formData.hearing_notes}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decision">Decisión Judicial</Label>
                    <Textarea
                      id="decision"
                      name="decision"
                      value={formData.decision}
                      onChange={handleInputChange}
                      placeholder={t('decision_placeholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decision_summary">Descripción del Tribunal de la Decisión</Label>
                    <Textarea
                      id="decision_summary"
                      name="decision_summary"
                      value={formData.decision_summary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decision_court_address">Dirección del Tribunal de la Decisión</Label>
                    <Textarea
                      id="decision_court_address"
                      name="decision_court_address"
                      value={formData.decision_court_address || ""}
                      onChange={handleInputChange}
                      placeholder="Dirección del tribunal donde se tomó la decisión..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appeal_board_info">Información del caso ante la Junta de Apelaciones de Inmigración</Label>
                    <Textarea
                      id="appeal_board_info"
                      name="appeal_board_info"
                      value={formData.appeal_board_info || ""}
                      onChange={handleInputChange}
                      placeholder="Información adicional sobre el caso ante la Junta de Apelaciones..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_hearing_info">Información de la Próxima Audiencia</Label>
                    <Textarea
                      id="next_hearing_info"
                      name="next_hearing_info"
                      value={formData.next_hearing_info || ""}
                      onChange={handleInputChange}
                      placeholder="Información adicional sobre la próxima audiencia... Use *texto* para negrita"
                      rows={4}
                    />
                    {formData.next_hearing_info && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                        <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                        <div 
                          className="text-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: formatTextWithBold(formData.next_hearing_info) 
                          }} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Los campos de decisión judicial ya están incluidos arriba */}

                </div>

                <div className="flex justify-end gap-2">
                  {isEditMode && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" disabled={loading} className="bg-[#1A365D] hover:bg-[#2A4A6D]">
                    <Save className="w-4 h-4 mr-2" />
                    {loading
                      ? isEditMode
                        ? "Actualizando..."
                        : "Creando..."
                      : isEditMode
                        ? "Actualizar Caso"
                        : "Crear Caso"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Casos</CardTitle>
              <CardDescription>
                {loadingCases ? "Cargando casos..." : `${filteredCases.length} casos encontrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por número de registro, nombre o ubicación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {loadingCases ? (
                  <div className="text-center py-8">Cargando casos...</div>
                ) : filteredCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No se encontraron casos que coincidan con la búsqueda" : "No hay casos registrados"}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Número de Registro</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Ubicación</TableHead>
                          <TableHead>Información de Audiencia</TableHead>
                          <TableHead>Fecha de Creación</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCases.map((case_) => (
                          <TableRow key={case_.id}>
                            <TableCell className="font-mono">{case_.registration_number}</TableCell>
                            <TableCell className="font-medium">{case_.full_name}</TableCell>
                            <TableCell>{getStatusBadge(case_.appeal_status)}</TableCell>
                            <TableCell>{case_.court_address || "No especificada"}</TableCell>
                            <TableCell className="max-w-xs">
                              {case_.next_hearing_info ? (
                                <div 
                                  className="text-sm"
                                  dangerouslySetInnerHTML={{ 
                                    __html: formatTextWithBold(case_.next_hearing_info) 
                                  }} 
                                />
                              ) : (
                                <span className="text-muted-foreground text-sm">Sin información</span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(case_.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" onClick={() => handleEditCase(case_)}>
                                  <Edit className="w-3 h-3 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/admin/case-status/${case_.id}`)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  Estado
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteCase(case_)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Eliminar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar el caso {caseToDelete?.registration_number} - {caseToDelete?.full_name}
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCase} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar Caso"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}