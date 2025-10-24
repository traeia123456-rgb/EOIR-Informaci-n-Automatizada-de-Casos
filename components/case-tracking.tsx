"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Eye,
  Calendar,
  Filter,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  History,
  Bell,
  User,
  MapPin,
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface CaseTrackingProps {
  user: AdminUser
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
  created_at: string
  updated_at: string
}

interface CaseHistory {
  id: string
  action_type: string
  field_changed: string | null
  old_value: string | null
  new_value: string | null
  notes: string | null
  created_at: string
  admin_users: {
    full_name: string
    email: string
  } | null
}

interface CaseNote {
  id: string
  note_type: string
  title: string | null
  content: string
  is_private: boolean
  reminder_date: string | null
  created_at: string
  admin_users: {
    full_name: string
    email: string
  } | null
}

export default function CaseTracking({ user }: CaseTrackingProps) {
  const [cases, setCases] = useState<ImmigrationCase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [filteredCases, setFilteredCases] = useState<ImmigrationCase[]>([])
  const [selectedCase, setSelectedCase] = useState<ImmigrationCase | null>(null)
  const [caseHistory, setCaseHistory] = useState<CaseHistory[]>([])
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [showCaseDetail, setShowCaseDetail] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [editingStatus, setEditingStatus] = useState<string | null>(null)
  const [statusText, setStatusText] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    note_type: "general",
    is_private: false,
    reminder_date: "",
  })
  const [showAddNote, setShowAddNote] = useState(false)
  const [customMessage, setCustomMessage] = useState("La fecha límite para presentar la apelación es 20 de octubre de 2025.")

  const supabase = createClient()

  const loadCases = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("immigration_cases")
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error("Error loading cases:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const filterCases = useCallback(() => {
    let filtered = cases.filter(
      (case_) =>
        (case_.registration_number && case_.registration_number.includes(searchTerm)) ||
        (case_.full_name && case_.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (case_.court_address && case_.court_address.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((case_) => case_.appeal_status === statusFilter)
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((case_) => new Date(case_.updated_at) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((case_) => new Date(case_.updated_at) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((case_) => new Date(case_.updated_at) >= filterDate)
          break
      }
    }

    setFilteredCases(filtered)
  }, [cases, searchTerm, statusFilter, dateFilter])

  useEffect(() => {
    loadCases()
  }, [loadCases])

  useEffect(() => {
    filterCases()
  }, [filterCases])

  const loadCaseHistory = async (caseId: string) => {
    setLoadingHistory(true)
    try {
      const { data: historyData, error: historyError } = await supabase
        .from("case_history")
        .select(`
          *,
          admin_users (
            full_name,
            email
          )
        `)
        .eq("case_id", caseId)
        .order("created_at", { ascending: false })

      if (historyError) throw historyError

      const { data: notesData, error: notesError } = await supabase
        .from("case_notes")
        .select(`
          *,
          admin_users (
            full_name,
            email
          )
        `)
        .eq("case_id", caseId)
        .order("created_at", { ascending: false })

      if (notesError) throw notesError

      setCaseHistory(historyData || [])
      setCaseNotes(notesData || [])
    } catch (error) {
      console.error("Error loading case history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleViewCase = async (case_: ImmigrationCase) => {
    setSelectedCase(case_)
    setShowCaseDetail(true)
    await loadCaseHistory(case_.id)
  }

  const handleAddNote = async () => {
    if (!selectedCase || !newNote.content.trim()) return

    try {
      const { error } = await supabase.from("case_notes").insert({
        case_id: selectedCase.id,
        admin_id: user.id,
        title: newNote.title || null,
        content: newNote.content,
        note_type: newNote.note_type,
        is_private: newNote.is_private,
        reminder_date: newNote.reminder_date || null,
      })

      if (error) throw error

      // Log the action
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "ADD_NOTE",
        resource_type: "IMMIGRATION_CASE",
        resource_id: selectedCase.registration_number,
        details: {
          note_type: newNote.note_type,
          has_reminder: !!newNote.reminder_date,
        },
      })

      // Reset form and reload
      setNewNote({
        title: "",
        content: "",
        note_type: "general",
        is_private: false,
        reminder_date: "",
      })
      setShowAddNote(false)
      await loadCaseHistory(selectedCase.id)
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  const handleStatusEdit = async (caseId: string, newStatus: string) => {
    if (!newStatus.trim() && editingStatus === caseId) {
      setEditingStatus(null)
      setStatusText("")
      return
    }

    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from("immigration_cases")
        .update({
          appeal_status: newStatus.trim() || "No se recibió una apelación para este caso.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", caseId)

      if (error) throw error

      // Log the action
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "UPDATE_CASE_STATUS",
        resource_type: "IMMIGRATION_CASE",
        resource_id: cases.find(c => c.id === caseId)?.registration_number,
        details: {
          case_name: cases.find(c => c.id === caseId)?.full_name,
          old_status: cases.find(c => c.id === caseId)?.appeal_status,
          new_status: newStatus.trim() || "No se recibió una apelación para este caso.",
        },
      })

      // Update local state
      setCases(prevCases =>
        prevCases.map(c =>
          c.id === caseId
            ? {
                ...c,
                appeal_status: newStatus.trim() || "No se recibió una apelación para este caso.",
                updated_at: new Date().toISOString(),
              }
            : c
        )
      )

      setEditingStatus(null)
      setStatusText("")
    } catch (error) {
      console.error("Error updating case status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pendiente: { label: "Pendiente", variant: "secondary" as const, icon: Clock },
      "En Progreso": { label: "En Progreso", variant: "default" as const, icon: FileText },
      Completado: { label: "Completado", variant: "default" as const, icon: CheckCircle },
      Rechazado: { label: "Rechazado", variant: "destructive" as const, icon: XCircle },
      Apelado: { label: "Apelado", variant: "outline" as const, icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status || "Sin Estado",
      variant: "secondary" as const,
      icon: Clock,
    }

    const IconComponent = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getNoteTypeBadge = (type: string) => {
    const typeConfig = {
      general: { label: "General", variant: "secondary" as const },
      important: { label: "Importante", variant: "default" as const },
      reminder: { label: "Recordatorio", variant: "outline" as const },
      alert: { label: "Alerta", variant: "destructive" as const },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || {
      label: type,
      variant: "secondary" as const,
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No especificada"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatActionType = (actionType: string) => {
    const actions = {
      created: "Caso creado",
      status_changed: "Estado cambiado",
      field_updated: "Campo actualizado",
      note_added: "Nota agregada",
      updated: "Caso actualizado"
    }
    return actions[actionType as keyof typeof actions] || actionType
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seguimiento de Casos</h2>
        <Button variant="outline" onClick={loadCases} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Filtre casos por múltiples criterios para encontrar información específica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Búsqueda General</Label>
              <Input
                id="search"
                placeholder="Número, nombre, ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Estado del Caso</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                  <SelectItem value="Apelado">Apelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Última Actualización</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
                className="w-full bg-transparent"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Message Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información de Caso - Junta de Apelaciones de Inmigración
          </CardTitle>
          <CardDescription>Configure el mensaje personalizado que se mostrará en la información de cada caso</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="custom-message">Mensaje Personalizado</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Ingrese el mensaje que se mostrará en la información de los casos..."
              rows={3}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Este mensaje aparecerá destacado en la sección de información de cada caso.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Casos Registrados</CardTitle>
          <CardDescription>
            {loading ? "Cargando casos..." : `${filteredCases.length} casos encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando casos...</div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "No se encontraron casos que coincidan con los filtros"
                : "No hay casos registrados"}
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
                    <TableHead>Próxima Audiencia</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell className="font-mono">{case_.registration_number}</TableCell>
                      <TableCell className="font-medium">{case_.full_name}</TableCell>
                      <TableCell>
                        {editingStatus === case_.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={statusText}
                              onChange={(e) => setStatusText(e.target.value)}
                              placeholder="Ingrese el estado del caso"
                              className="w-full"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleStatusEdit(case_.id, statusText)
                                } else if (e.key === "Escape") {
                                  setEditingStatus(null)
                                  setStatusText("")
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusEdit(case_.id, statusText)}
                              disabled={updatingStatus}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingStatus(null)
                                setStatusText("")
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            onClick={() => {
                              setEditingStatus(case_.id)
                              setStatusText(case_.appeal_status)
                            }}
                          >
                            {getStatusBadge(case_.appeal_status)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {case_.court_address || "No especificada"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {formatDate(case_.next_hearing_date)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(case_.updated_at)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewCase(case_)}>
                          <Eye className="w-3 h-3 mr-1" />
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Detail Dialog */}
      <Dialog open={showCaseDetail} onOpenChange={setShowCaseDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detalle del Caso: {selectedCase?.registration_number}
            </DialogTitle>
            <DialogDescription>{selectedCase?.full_name} - Información completa y historial del caso</DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Información Básica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Número de Registro</Label>
                        <p className="font-mono">{selectedCase.registration_number}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Nombre Completo</Label>
                        <p>{selectedCase.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Estado del Caso</Label>
                        <div className="mt-1">{getStatusBadge(selectedCase.appeal_status)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Ubicación del Tribunal</Label>
                        <p>{selectedCase.court_address || "No especificada"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Información Importante</Label>
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">
                            {customMessage}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fechas Importantes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Fecha de Apelación</Label>
                        <p>{formatDate(selectedCase.appeal_received_date)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Próxima Audiencia</Label>
                        <p>{formatDate(selectedCase.next_hearing_date)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Creado</Label>
                        <p>{formatDate(selectedCase.created_at)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Última Actualización</Label>
                        <p>{formatDate(selectedCase.updated_at)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Historial de Cambios
                  </h3>
                </div>

                {loadingHistory ? (
                  <div className="text-center py-8">Cargando historial...</div>
                ) : caseHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No hay historial disponible</div>
                ) : (
                  <div className="space-y-3">
                    {caseHistory.map((entry) => (
                      <Card key={entry.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{formatActionType(entry.action_type)}</Badge>
                                {entry.field_changed && (
                                  <span className="text-sm text-muted-foreground">Campo: {entry.field_changed}</span>
                                )}
                              </div>
                              {entry.old_value && entry.new_value && (
                                <div className="text-sm">
                                  <span className="text-red-600">Anterior: {entry.old_value}</span>
                                  {" → "}
                                  <span className="text-green-600">Nuevo: {entry.new_value}</span>
                                </div>
                              )}
                              {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {entry.admin_users?.full_name || "Sistema"}
                              </div>
                              <div>{formatDate(entry.created_at)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Notas del Caso
                  </h3>
                  <Button onClick={() => setShowAddNote(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>

                {showAddNote && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Nueva Nota</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="note-title">Título (Opcional)</Label>
                          <Input
                            id="note-title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            placeholder="Título de la nota..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="note-type">Tipo de Nota</Label>
                          <Select
                            value={newNote.note_type}
                            onValueChange={(value) => setNewNote({ ...newNote, note_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="important">Importante</SelectItem>
                              <SelectItem value="reminder">Recordatorio</SelectItem>
                              <SelectItem value="alert">Alerta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="note-content">Contenido *</Label>
                        <Textarea
                          id="note-content"
                          value={newNote.content}
                          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                          placeholder="Escriba el contenido de la nota..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reminder-date">Fecha de Recordatorio (Opcional)</Label>
                          <Input
                            id="reminder-date"
                            type="datetime-local"
                            value={newNote.reminder_date}
                            onChange={(e) => setNewNote({ ...newNote, reminder_date: e.target.value })}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id="is-private"
                            checked={newNote.is_private}
                            onChange={(e) => setNewNote({ ...newNote, is_private: e.target.checked })}
                          />
                          <Label htmlFor="is-private">Nota privada</Label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddNote(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddNote} disabled={!newNote.content.trim()}>
                          Agregar Nota
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {caseNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No hay notas para este caso</div>
                ) : (
                  <div className="space-y-3">
                    {caseNotes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {getNoteTypeBadge(note.note_type)}
                              {note.is_private && <Badge variant="outline">Privada</Badge>}
                              {note.reminder_date && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Bell className="w-3 h-3" />
                                  Recordatorio
                                </Badge>
                              )}
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {note.admin_users?.full_name || "Usuario"}
                              </div>
                              <div>{formatDate(note.created_at)}</div>
                            </div>
                          </div>
                          {note.title && <h4 className="font-medium mb-1">{note.title}</h4>}
                          <p className="text-sm">{note.content}</p>
                          {note.reminder_date && (
                            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              Recordatorio: {formatDate(note.reminder_date)}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
