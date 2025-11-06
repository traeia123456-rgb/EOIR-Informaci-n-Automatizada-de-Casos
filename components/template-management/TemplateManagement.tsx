"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Eye, 
  Download, 
  Trash2, 
  Copy,
  Star,
  MoreHorizontal
} from 'lucide-react'
import { Template, TemplateMeta } from '@/types/template'
import TemplateEditor from '../template-editor/TemplateEditor'

interface TemplateManagementProps {
  user: any
}

export default function TemplateManagement({ user }: TemplateManagementProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showEditor, setShowEditor] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)


  // Datos de ejemplo para plantillas
  const sampleTemplates: Template[] = useMemo(() => [
    {
      meta: {
        id: 'tpl_001',
        name: 'Plantilla - Información de Caso (Predeterminada)',
        description: 'Plantilla predeterminada para mostrar información de casos de inmigración',
        tags: ['audiencia', 'tribunal', 'resumen', 'predeterminada'],
        status: 'active',
        version: 1,
        createdBy: user?.email || 'admin@eoir.gov',
        createdAt: '2025-08-29T10:00:00Z',
        updatedAt: '2025-08-29T10:00:00Z',
        category: 'audiencia',
        thumbnail: '/template-thumb-1.png',
        isDefault: true
      },
      grid: {
        columns: 12,
        gutter: 16,
        rowHeight: 30,
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
      },
      components: [
        {
          id: 'case_info_template',
          type: 'case_information',
          x: 0,
          y: 0,
          w: 12,
          h: 20,
          props: {
            content: {
              next_hearing_title: 'Información acerca de la próxima audiencia',
              next_hearing_default: 'No hay audiencias futuras para este caso.',
              judicial_decisions_title: 'Información sobre Pedimentos y Fallos Judiciales',
              appeal_info_title: 'Información de un caso ante la Junta de Apelaciones de Inmigración',
              court_info_title: 'Información acerca del Tribunal',
              court_info_description: 'Si usted necesita más información con relación a su caso, o desea presentar documentos adicionales, por favor comuníquese con el tribunal de apelaciones de inmigración.'
            }
          },
          zIndex: 1
        }
      ],
      responsive: { breakpoints: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
      settings: {
        autosave: true,
        autosaveInterval: 30000,
        snapToGrid: true,
        showGrid: true,
        showGuides: true
      }
    },
    {
      meta: {
        id: 'tpl_002',
        name: 'Plantilla - Detalles de Apelación',
        description: 'Plantilla para mostrar información detallada de apelaciones',
        tags: ['apelacion', 'detalles', 'legal'],
        status: 'active',
        version: 1,
        createdBy: user?.email || 'admin@eoir.gov',
        createdAt: '2025-08-29T11:00:00Z',
        updatedAt: '2025-08-29T11:00:00Z',
        category: 'apelacion',
        thumbnail: '/template-thumb-2.png'
      },
      grid: {
        columns: 12,
        gutter: 16,
        rowHeight: 30,
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
      },
      components: [],
      responsive: { breakpoints: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
      settings: {
        autosave: true,
        autosaveInterval: 30000,
        snapToGrid: true,
        showGrid: true,
        showGuides: true
      }
    }
  ], [user?.email])

  useEffect(() => {
    // Cargar plantillas de ejemplo
    setTemplates(sampleTemplates)
    setFilteredTemplates(sampleTemplates)
  }, [sampleTemplates])

  useEffect(() => {
    // Filtrar plantillas
    let filtered = templates

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.meta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.meta.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.meta.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.meta.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(template => template.meta.status === selectedStatus)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, selectedCategory, selectedStatus])

  const handleCreateTemplate = () => {
    const newTemplate: Template = {
      meta: {
        id: `tpl_${Date.now()}`,
        name: 'Nueva Plantilla',
        description: 'Descripción de la nueva plantilla',
        tags: ['nueva'],
        status: 'draft',
        version: 1,
        createdBy: user?.email || 'admin@eoir.gov',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'custom',
        thumbnail: ''
      },
      grid: {
        columns: 12,
        gutter: 16,
        rowHeight: 30,
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
      },
      components: [],
      responsive: { breakpoints: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
      settings: {
        autosave: true,
        autosaveInterval: 30000,
        snapToGrid: true,
        showGrid: true,
        showGuides: true
      }
    }
    setEditingTemplate(newTemplate)
    setShowEditor(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setShowEditor(true)
  }

  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      meta: {
        ...template.meta,
        id: `tpl_${Date.now()}`,
        name: `${template.meta.name} (Copia)`,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      }
    }
    setTemplates(prev => [...prev, duplicatedTemplate])
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      setTemplates(prev => prev.filter(t => t.meta.id !== templateId))
    }
  }

  const handleSaveTemplate = (template: Template) => {
    if (editingTemplate) {
      // Actualizar plantilla existente en la lista
      setTemplates(prev => prev.map(t => 
        t.meta.id === template.meta.id ? template : t
      ))
    } else {
      // Crear nueva plantilla en la lista
      setTemplates(prev => [...prev, template])
    }

    // Mantener el editor abierto y actualizar la plantilla en edición
    setEditingTemplate(template)
    setShowEditor(true)
  }

  const handleCancelEdit = () => {
    setShowEditor(false)
    setEditingTemplate(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'draft': return 'outline'
      default: return 'secondary'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'audiencia': return '📅'
      case 'tribunal': return '⚖️'
      case 'apelacion': return '📋'
      case 'general': return '📄'
      case 'custom': return '🎨'
      default: return '📄'
    }
  }

  if (showEditor) {
    return (
      <TemplateEditor
        template={editingTemplate || undefined}
        onSave={handleSaveTemplate}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plantillas de Casos</h1>
          <p className="text-gray-600 mt-2">
            Diseña y gestiona plantillas personalizadas para visualizar información de casos
          </p>
        </div>
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="audiencia">Audiencia</SelectItem>
                <SelectItem value="tribunal">Tribunal</SelectItem>
                <SelectItem value="apelacion">Apelación</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredTemplates.length} plantillas encontradas</span>
            <span>Total: {templates.length} plantillas</span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de plantillas */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.meta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(template.meta.category)}</span>
                    <div>
                      <CardTitle className="text-lg">{template.meta.name}</CardTitle>
                      <Badge variant={getStatusColor(template.meta.status)} className="mt-1">
                        {template.meta.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {template.meta.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {template.meta.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.meta.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.meta.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>v{template.meta.version}</span>
                  <span>{new Date(template.meta.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.meta.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plantilla
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Versión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última actualización
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr key={template.meta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getCategoryIcon(template.meta.category)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {template.meta.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {template.meta.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{template.meta.category}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(template.meta.status)}>
                          {template.meta.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        v{template.meta.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(template.meta.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Duplicar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.meta.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay plantillas */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium mb-2">No se encontraron plantillas</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera plantilla para comenzar'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
              <Button onClick={handleCreateTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Plantilla
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
