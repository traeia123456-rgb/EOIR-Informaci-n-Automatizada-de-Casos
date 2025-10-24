"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { templatePersistence } from '@/lib/template-persistence'
import { TemplateExporter } from '@/lib/template-export'
import { validateComponent } from '@/lib/template-validation'
import { VirtualCanvas } from '../template-canvas/VirtualCanvas'
import { 
  Save, 
  Undo, 
  Redo, 
  Plus, 
  Settings, 
  Eye, 
  Download, 
  Trash2, 
  Copy,
  Grid,
  Palette,
  Type,
  Image as ImageIcon,
  Square,
  Hash,
  Minus,
  Tag
} from 'lucide-react'
import { Template, TemplateComponent, ComponentProps, EditorState, DragItem } from '@/types/template'
import TemplateCanvas from '../template-canvas/TemplateCanvas'
import TemplateSidebar from '../template-sidebar/TemplateSidebar'
import ComponentProperties from './ComponentProperties'
import TemplateToolbar from './TemplateToolbar'

interface TemplateEditorProps {
  template?: Template
  onSave: (template: Template) => void
  onCancel: () => void
}

const defaultGrid = {
  columns: 12,
  gutter: 16,
  rowHeight: 30,
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  }
}

const defaultTemplate: Template = {
  meta: {
    id: '',
    name: 'Nueva Plantilla',
    description: '',
    tags: [],
    status: 'draft',
    version: 1,
    createdBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'general'
  },
  grid: defaultGrid,
  components: [],
  responsive: {
    breakpoints: {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: []
    }
  },
  settings: {
    autosave: true,
    autosaveInterval: 30000,
    snapToGrid: true,
    showGrid: true,
    showGuides: true
  }
}

export default function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [currentTemplate, setCurrentTemplate] = useState<Template>(template || defaultTemplate)
  const [editorState, setEditorState] = useState<EditorState>({
    selectedComponent: null,
    clipboard: null,
    history: [],
    currentHistoryIndex: -1,
    isDirty: false,
    lastSaved: null
  })
  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const autosaveRef = useRef<NodeJS.Timeout>()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Función para generar ID único
  const generateId = () => `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Función para agregar componente
  const addComponent = useCallback(async (type: string, props: any = {}) => {
    try {
      const { x, y, ...componentProps } = props
      
      // Validar tipo de componente
      const validTypes = ['text', 'card', 'image', 'icon', 'placeholder', 'separator', 'label', 'case_information']
      if (!validTypes.includes(type)) {
        throw new Error(`Tipo de componente no válido: ${type}`)
      }
      
      const newComponent: TemplateComponent = {
        id: generateId(),
        type: type as any,
        x: Math.max(0, x || 0),
        y: Math.max(0, y || 0),
        w: Math.max(1, Math.min(12, 6)), // Entre 1 y 12 columnas
        h: Math.max(1, Math.min(20, 4)), // Entre 1 y 20 filas
        props: {
          content: type === 'text' ? 'Texto de ejemplo' : '',
          fontSize: Math.max(8, Math.min(72, 14)), // Entre 8 y 72
          fontFamily: 'Arial',
          color: '#000000',
          backgroundColor: type === 'card' ? '#f3f4f6' : 'transparent',
          padding: Math.max(0, Math.min(100, 16)), // Entre 0 y 100
          ...componentProps
        },
        zIndex: currentTemplate.components.length + 1
      }

      const updatedTemplate = {
        ...currentTemplate,
        components: [...currentTemplate.components, newComponent]
      }

      setCurrentTemplate(updatedTemplate)
      setEditorState(prev => ({ ...prev, isDirty: true }))
      setError(null)
      addToHistory(updatedTemplate, `Agregado componente ${type}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar componente')
      console.error('Error adding component:', err)
      await templatePersistence.createBackup(currentTemplate)
    }
  }, [currentTemplate])

  // Función para actualizar componente
  const updateComponent = useCallback(async (id: string, updates: Partial<TemplateComponent>) => {
    // Validar el componente antes de actualizar
    const validation = validateComponent({ ...currentTemplate.components.find(c => c.id === id)!, ...updates })
    if (!validation.success) {
      setError(validation.errors?.join('\n') || 'Error de validación')
      return
    }
    const updatedComponents = currentTemplate.components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    )

    const updatedTemplate = {
      ...currentTemplate,
      components: updatedComponents
    }

    setCurrentTemplate(updatedTemplate)
    setEditorState(prev => ({ ...prev, isDirty: true }))
    
    // Guardar y crear respaldo
    try {
      await templatePersistence.saveTemplate(updatedTemplate)
      await templatePersistence.createBackup(updatedTemplate)
    } catch (err) {
      console.error('Error al guardar:', err)
    }
  }, [currentTemplate])

  // Función para eliminar componente
  const deleteComponent = useCallback((id: string) => {
    const updatedComponents = currentTemplate.components.filter(comp => comp.id !== id)
    const updatedTemplate = {
      ...currentTemplate,
      components: updatedComponents
    }

    setCurrentTemplate(updatedTemplate)
    setEditorState(prev => ({ 
      ...prev, 
      selectedComponent: prev.selectedComponent === id ? null : prev.selectedComponent,
      isDirty: true 
    }))
    addToHistory(updatedTemplate, 'Componente eliminado')
  }, [currentTemplate])

  // Función para duplicar componente
  const duplicateComponent = useCallback((id: string) => {
    const component = currentTemplate.components.find(comp => comp.id === id)
    if (!component) return

    const duplicatedComponent: TemplateComponent = {
      ...component,
      id: generateId(),
      x: component.x + 1,
      y: component.y + 1,
      zIndex: currentTemplate.components.length + 1
    }

    const updatedTemplate = {
      ...currentTemplate,
      components: [...currentTemplate.components, duplicatedComponent]
    }

    setCurrentTemplate(updatedTemplate)
    setEditorState(prev => ({ ...prev, isDirty: true }))
    addToHistory(updatedTemplate, 'Componente duplicado')
  }, [currentTemplate])

  // Función para seleccionar componente
  const selectComponent = useCallback((id: string | null) => {
    setEditorState(prev => ({ ...prev, selectedComponent: id }))
  }, [])

  // Función para agregar al historial
  const addToHistory = useCallback((template: Template, message: string) => {
    const MAX_HISTORY = 50
    
    const historyItem = {
      id: generateId(),
      templateId: template.meta.id || 'new',
      version: template.meta.version,
      data: template,
      createdAt: new Date().toISOString(),
      createdBy: template.meta.createdBy || 'user',
      message
    }

    setEditorState(prev => {
      const newHistory = [...prev.history.slice(0, prev.currentHistoryIndex + 1), historyItem]
      
      // Mantener solo los últimos MAX_HISTORY elementos
      if (newHistory.length > MAX_HISTORY) {
        newHistory.splice(0, newHistory.length - MAX_HISTORY)
      }
      
      return {
        ...prev,
        history: newHistory,
        currentHistoryIndex: Math.min(prev.currentHistoryIndex + 1, newHistory.length - 1)
      }
    })
  }, [])

  // Función para exportar
  const exportTemplate = useCallback(async (format: 'png' | 'pdf' | 'json') => {
    if (!canvasRef.current) return

    try {
      setExportProgress(0)
      let exportData: any
      let filename: string

      switch (format) {
        case 'png':
          exportData = await TemplateExporter.toPNG(canvasRef.current, currentTemplate, {
            scale: 2,
            quality: 1
          })
          filename = `${currentTemplate.meta.name}_${Date.now()}.png`
          break

        case 'pdf':
          exportData = await TemplateExporter.toPDF(canvasRef.current, currentTemplate, {
            scale: 2,
            quality: 1
          })
          filename = `${currentTemplate.meta.name}_${Date.now()}.pdf`
          break

        case 'json':
          exportData = TemplateExporter.toJSON(currentTemplate)
          filename = `${currentTemplate.meta.name}_${Date.now()}.json`
          break

        default:
          throw new Error('Formato de exportación no válido')
      }

      TemplateExporter.download(exportData, filename)
      setExportProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar plantilla')
      setExportProgress(0)
    }
  }, [currentTemplate])

  // Función para restaurar desde respaldo
  const restoreFromBackup = useCallback(async (timestamp: string) => {
    try {
      const restoredTemplate = await templatePersistence.restoreFromBackup(
        currentTemplate.meta.id,
        timestamp
      )
      setCurrentTemplate(restoredTemplate)
      setEditorState(prev => ({ ...prev, isDirty: true }))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restaurar respaldo')
    }
  }, [currentTemplate.meta.id])

  // Iniciar respaldo automático
  useEffect(() => {
    if (currentTemplate.settings.autosave) {
      templatePersistence.startAutoBackup(currentTemplate)
      return () => templatePersistence.stopAutoBackup()
    }
  }, [currentTemplate])

  // Función para deshacer
  const undo = useCallback(() => {
    if (editorState.currentHistoryIndex > 0) {
      const newIndex = editorState.currentHistoryIndex - 1
      const historyItem = editorState.history[newIndex]
      setCurrentTemplate(historyItem.data)
      setEditorState(prev => ({ 
        ...prev, 
        currentHistoryIndex: newIndex,
        isDirty: true 
      }))
    }
  }, [editorState])

  // Función para rehacer
  const redo = useCallback(() => {
    if (editorState.currentHistoryIndex < editorState.history.length - 1) {
      const newIndex = editorState.currentHistoryIndex + 1
      const historyItem = editorState.history[newIndex]
      setCurrentTemplate(historyItem.data)
      setEditorState(prev => ({ 
        ...prev, 
        currentHistoryIndex: newIndex,
        isDirty: true 
      }))
    }
  }, [editorState])

  // Función para guardar
  const handleSave = useCallback(() => {
    const updatedTemplate = {
      ...currentTemplate,
      meta: {
        ...currentTemplate.meta,
        updatedAt: new Date().toISOString(),
        version: currentTemplate.meta.version + 1
      }
    }

    onSave(updatedTemplate)
    setEditorState(prev => ({ 
      ...prev, 
      isDirty: false,
      lastSaved: new Date().toISOString()
    }))
  }, [currentTemplate, onSave])

  // Autosave y persistencia local
  useEffect(() => {
    if (currentTemplate.settings.autosave && editorState.isDirty) {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current)
      }

      autosaveRef.current = setTimeout(() => {
        handleSave()
      }, currentTemplate.settings.autosaveInterval)
    }

    // Guardar en localStorage para persistencia
    if (editorState.isDirty) {
      try {
        localStorage.setItem(`template_draft_${currentTemplate.meta.id || 'new'}`, JSON.stringify(currentTemplate))
      } catch (err) {
        console.warn('No se pudo guardar en localStorage:', err)
      }
    }

    return () => {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current)
      }
    }
  }, [currentTemplate, editorState.isDirty, handleSave])

  // Cargar desde localStorage al inicializar
  useEffect(() => {
    if (template?.meta.id) {
      try {
        const saved = localStorage.getItem(`template_draft_${template.meta.id}`)
        if (saved) {
          const savedTemplate = JSON.parse(saved)
          // Solo cargar si es más reciente que la plantilla actual
          if (new Date(savedTemplate.meta.updatedAt) > new Date(template.meta.updatedAt)) {
            setCurrentTemplate(savedTemplate)
            setEditorState(prev => ({ ...prev, isDirty: true }))
          }
        }
      } catch (err) {
        console.warn('No se pudo cargar desde localStorage:', err)
      }
    }
  }, [template?.meta.id])

  // Función para exportar
  const handleExport = useCallback((format: 'json' | 'png' | 'pdf') => {
    switch (format) {
      case 'json':
        const jsonData = JSON.stringify(currentTemplate, null, 2)
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentTemplate.meta.name}.json`
        a.click()
        URL.revokeObjectURL(url)
        break
      case 'png':
        // Implementar exportación a PNG
        console.log('Exportando a PNG...')
        break
      case 'pdf':
        // Implementar exportación a PDF
        console.log('Exportando a PDF...')
        break
    }
  }, [currentTemplate])

  const selectedComponent = currentTemplate.components.find(
    comp => comp.id === editorState.selectedComponent
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          {/* Mostrar errores si existen */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-sm font-medium">Error:</span>
                <span className="text-sm">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto h-6 w-6 p-0 text-red-600 hover:text-red-800"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Editor de Plantillas</h1>
              <Badge variant={currentTemplate.meta.status === 'active' ? 'default' : 'secondary'}>
                {currentTemplate.meta.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Button>
              <Button variant="outline" onClick={undo} disabled={editorState.currentHistoryIndex <= 0}>
                <Undo className="w-4 h-4 mr-2" />
                Deshacer
              </Button>
              <Button variant="outline" onClick={redo} disabled={editorState.currentHistoryIndex >= editorState.history.length - 1}>
                <Redo className="w-4 h-4 mr-2" />
                Rehacer
              </Button>
              <Button onClick={handleSave} disabled={!editorState.isDirty}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </div>

          {/* Información de la plantilla */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <Input
                value={currentTemplate.meta.name}
                onChange={(e) => setCurrentTemplate(prev => ({
                  ...prev,
                  meta: { ...prev.meta, name: e.target.value }
                }))}
                placeholder="Nombre de la plantilla"
                className="text-lg font-semibold"
              />
            </div>
            <div className="flex-1">
              <Textarea
                value={currentTemplate.meta.description}
                onChange={(e) => setCurrentTemplate(prev => ({
                  ...prev,
                  meta: { ...prev.meta, description: e.target.value }
                }))}
                placeholder="Descripción de la plantilla"
                rows={1}
              />
            </div>
            <div className="w-48">
              <Select
                value={currentTemplate.meta.category}
                onValueChange={(value) => setCurrentTemplate(prev => ({
                  ...prev,
                  meta: { ...prev.meta, category: value as any }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audiencia">Audiencia</SelectItem>
                  <SelectItem value="tribunal">Tribunal</SelectItem>
                  <SelectItem value="apelacion">Apelación</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <TemplateSidebar
            onAddComponent={addComponent}
            onExport={handleExport}
            template={currentTemplate}
          />

          {/* Canvas */}
          <div className="flex-1 flex flex-col">
            <TemplateToolbar
              template={currentTemplate}
              onUpdateTemplate={setCurrentTemplate}
              showGrid={currentTemplate.settings.showGrid}
              snapToGrid={currentTemplate.settings.snapToGrid}
            />
            
            <div ref={canvasRef} className="flex-1 overflow-auto p-4">
              <VirtualCanvas
                components={currentTemplate.components}
                containerWidth={800}
                containerHeight={600}
                gridSize={currentTemplate.grid.rowHeight}
                onComponentInView={(id) => {
                  // Opcional: Manejar cuando un componente entra en vista
                }}
                className="w-full h-full"
              />
              <TemplateCanvas
                template={currentTemplate}
                onUpdateComponent={updateComponent}
                onSelectComponent={selectComponent}
                onDeleteComponent={deleteComponent}
                onDuplicateComponent={duplicateComponent}
                onAddComponent={addComponent}
                selectedComponent={editorState.selectedComponent}
                showGrid={currentTemplate.settings.showGrid}
                snapToGrid={currentTemplate.settings.snapToGrid}
              />
            </div>
          </div>

          {/* Properties Panel */}
          {selectedComponent && (
            <div className="w-80 bg-white border-l overflow-y-auto">
              <ComponentProperties
                component={selectedComponent}
                onUpdate={(updates) => updateComponent(selectedComponent.id, updates)}
                onDelete={() => deleteComponent(selectedComponent.id)}
                onDuplicate={() => duplicateComponent(selectedComponent.id)}
              />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t px-6 py-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <span>Componentes: {currentTemplate.components.length}</span>
            <span>Grid: {currentTemplate.grid.columns} columnas</span>
            {exportProgress > 0 && exportProgress < 100 && (
              <span>Exportando: {exportProgress}%</span>
            )}
            {editorState.lastSaved && (
              <span>Último guardado: {new Date(editorState.lastSaved).toLocaleTimeString()}</span>
            )}
          </div>
            <div className="flex items-center gap-2">
              {editorState.isDirty && (
                <Badge variant="outline" className="text-orange-600">
                  Sin guardar
                </Badge>
              )}
              <span>v{currentTemplate.meta.version}</span>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
