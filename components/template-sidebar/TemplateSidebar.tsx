"use client"

import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Type, 
  Square, 
  Image as ImageIcon, 
  Hash, 
  Minus, 
  Tag,
  Download,
  FileText,
  Image,
  FileDown
} from 'lucide-react'
import { Template, ComponentProps } from '@/types/template'

interface TemplateSidebarProps {
  onAddComponent: (type: string, props?: Partial<ComponentProps>) => void
  onExport: (format: 'json' | 'png' | 'pdf') => void
  template: Template
}

// Componente arrastrable
interface DraggableComponentProps {
  type: string
  icon: React.ReactNode
  label: string
  description: string
  defaultProps?: Partial<ComponentProps>
}

function DraggableComponent({ type, icon, label, description, defaultProps }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type: 'COMPONENT', componentType: type, props: defaultProps },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag as any}
      className={`p-2 border rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-xs truncate">{label}</h4>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function TemplateSidebar({ onAddComponent, onExport, template }: TemplateSidebarProps) {
  const [activeTab, setActiveTab] = useState('components')

  const componentTypes = [
    {
      type: 'text',
      icon: <Type className="w-4 h-4" />,
      label: 'Texto Enriquecido',
      description: 'Editor de texto con formato completo',
      defaultProps: {
        content: 'Texto de ejemplo',
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#000000'
      }
    },
    {
      type: 'card',
      icon: <Square className="w-4 h-4" />,
      label: 'Contenedor',
      description: 'Panel con bordes y sombras',
      defaultProps: {
        backgroundColor: '#f3f4f6',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16
      }
    },
    {
      type: 'case_information',
      icon: <FileText className="w-4 h-4" />,
      label: 'Información de Caso',
      description: 'Plantilla de información de caso',
      defaultProps: {
        content: {
          next_hearing_title: 'Información acerca de la próxima audiencia',
          next_hearing_default: 'No hay audiencias futuras para este caso.',
          judicial_decisions_title: 'Información sobre Pedimentos y Fallos Judiciales',
          appeal_info_title: 'Información de un caso ante la Junta de Apelaciones de Inmigración',
          court_info_title: 'Información acerca del Tribunal',
          court_info_description: 'Si usted necesita más información con relación a su caso, o desea presentar documentos adicionales, por favor comuníquese con el tribunal de apelaciones de inmigración.'
        }
      }
    },
    {
      type: 'image',
      icon: <ImageIcon className="w-4 h-4" />,
      label: 'Imagen',
      description: 'Imagen con opciones de ajuste',
      defaultProps: {
        src: '/placeholder-image.jpg',
        alt: 'Imagen de ejemplo',
        fit: 'cover' as 'cover'
      }
    },
    {
      type: 'icon',
      icon: <Hash className="w-4 h-4" />,
      label: 'Icono/Emoji',
      description: 'Iconos y emojis',
      defaultProps: {
        content: '📄',
        fontSize: 24
      }
    },
    {
      type: 'placeholder',
      icon: <Tag className="w-4 h-4" />,
      label: 'Campo Dinámico',
      description: 'Placeholder para datos del caso',
      defaultProps: {
        placeholderKey: 'nombre',
        placeholderType: 'text' as 'text',
        content: '{{nombre}}'
      }
    },
    {
      type: 'separator',
      icon: <Minus className="w-4 h-4" />,
      label: 'Separador',
      description: 'Líneas divisoras',
      defaultProps: {
        separatorType: 'line' as 'line',
        backgroundColor: '#d1d5db'
      }
    },
    {
      type: 'label',
      icon: <Tag className="w-4 h-4" />,
      label: 'Etiqueta',
      description: 'Etiquetas con estilos',
      defaultProps: {
        labelText: 'Etiqueta',
        labelStyle: 'default' as 'default',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: 8,
        borderRadius: 4
      }
    }
  ]

  const placeholderData = {
    nombre: 'Juan Pérez',
    fecha_audiencia: '15 de octubre de 2025',
    numero_registro: '123456789',
    estado_caso: 'Pendiente',
    tribunal: 'Tribunal de Inmigración de Phoenix',
    juez: 'Dr. García',
    direccion: '250 N 7TH AVENUE, SUITE 300 PHOENIX, AZ 85007'
  }

  return (
    <div className="w-96 bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-3 border-b">
        <h2 className="text-base font-semibold mb-1">Editor de Plantillas</h2>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Componentes: {template.components.length}</span>
          <span>•</span>
          <span>v{template.meta.version}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components" className="text-xs">Componentes</TabsTrigger>
          <TabsTrigger value="data" className="text-xs">Datos</TabsTrigger>
          <TabsTrigger value="export" className="text-xs">Exportar</TabsTrigger>
        </TabsList>

        {/* Tab de Componentes */}
        <TabsContent value="components" className="flex-1 p-4 space-y-3">
          <div>
            <h3 className="font-medium mb-2 text-sm">Componentes Disponibles</h3>
            <p className="text-xs text-gray-600 mb-3">
              Arrastra los componentes al canvas para diseñar tu plantilla
            </p>
            
            <div className="space-y-2">
              {componentTypes.map((component) => (
                <DraggableComponent
                  key={component.type}
                  type={component.type}
                  icon={component.icon}
                  label={component.label}
                  description={component.description}
                  defaultProps={component.defaultProps}
                />
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Acciones Rápidas</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddComponent('text')}
                className="text-xs"
              >
                <Type className="w-3 h-3 mr-1" />
                Agregar Texto
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddComponent('card')}
                className="text-xs"
              >
                <Square className="w-3 h-3 mr-1" />
                Agregar Card
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab de Datos */}
        <TabsContent value="data" className="flex-1 p-4">
          <div>
            <h3 className="font-medium mb-3">Datos de Ejemplo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Estos son los placeholders disponibles para tu plantilla
            </p>
            
            <div className="space-y-3">
              {Object.entries(placeholderData).map(([key, value]) => (
                <div key={key} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <code className="text-sm font-mono text-blue-600">
                        {`{{${key}}}`}
                      </code>
                      <p className="text-xs text-gray-500 mt-1">{value}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddComponent('placeholder', {
                        placeholderKey: key,
                        placeholderType: 'text',
                        content: `{{${key}}}`
                      })}
                    >
                      Usar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab de Exportar */}
        <TabsContent value="export" className="flex-1 p-4">
          <div>
            <h3 className="font-medium mb-3">Exportar Plantilla</h3>
            <p className="text-sm text-gray-600 mb-4">
              Exporta tu plantilla en diferentes formatos
            </p>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onExport('json')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Exportar como JSON
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onExport('png')}
              >
                <Image className="w-4 h-4 mr-2" />
                Exportar como PNG
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onExport('pdf')}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Exportar como PDF
              </Button>
            </div>

            {/* Información de la plantilla */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Información</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span className="font-medium">{template.meta.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categoría:</span>
                  <Badge variant="outline">{template.meta.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <Badge variant={template.meta.status === 'active' ? 'default' : 'secondary'}>
                    {template.meta.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Componentes:</span>
                  <span className="font-medium">{template.components.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Versión:</span>
                  <span className="font-medium">{template.meta.version}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
