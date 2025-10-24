"use client"

import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Edit, 
  Trash2, 
  Copy, 
  Square,
  Palette
} from 'lucide-react'

interface CardComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate?: (updates: Partial<TemplateComponent>) => void
}

export default function CardComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate
}: CardComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(component.props.title || '')

  const handleSave = () => {
    setIsEditing(false)
    onUpdate?.({
      props: {
        ...component.props,
        title: editTitle
      }
    })
  }

  const handleCancel = () => {
    setEditTitle(component.props.title || '')
    setIsEditing(false)
  }

  const cardStyles = {
    backgroundColor: component.props.backgroundColor || '#f3f4f6',
    border: component.props.borderWidth ? `${component.props.borderWidth}px solid ${component.props.borderColor || '#d1d5db'}` : 'none',
    borderRadius: `${component.props.borderRadius || 8}px`,
    padding: `${component.props.padding || 16}px`,
    margin: `${component.props.margin || 0}px`,
    boxShadow: component.props.shadow || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    opacity: component.props.opacity || 1,
    transform: component.props.rotation ? `rotate(${component.props.rotation}deg)` : 'none'
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 60, // Ancho base para contenedores
        height: component.h * 60  // Alto base para contenedores
      }}
      minWidth={150}
      minHeight={100}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative"
        style={cardStyles}
        onClick={onSelect}
      >
        {/* Header de la tarjeta */}
        <div className="flex items-center justify-between mb-3">
          {isEditing ? (
            <div className="flex-1 mr-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-sm font-medium border-none p-0 bg-transparent"
                placeholder="Título de la tarjeta"
                autoFocus
              />
            </div>
          ) : (
            <h3 className="text-sm font-medium text-gray-900">
              {component.props.title || 'Título de la tarjeta'}
            </h3>
          )}
          
          {isEditing && (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleSave} className="h-6 w-6 p-0">
                ✓
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-6 w-6 p-0">
                ✕
              </Button>
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="text-sm text-gray-600">
          {typeof component.props.content === 'object' ? 
            JSON.stringify(component.props.content) : 
            (component.props.content || 'Contenido de la tarjeta. Haz clic para editar.')}
        </div>

        {/* Toolbar de edición cuando está seleccionado */}
        {isSelected && !isEditing && (
          <div className="absolute -top-10 left-0 bg-white border rounded-lg shadow-lg p-2 flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDuplicate}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Indicador de tipo de componente */}
        <div className="absolute top-1 left-1 text-xs bg-green-100 text-green-800 px-1 rounded opacity-75">
          Card
        </div>

        {/* Indicador de estilos */}
        <div className="absolute bottom-1 right-1 text-xs bg-gray-100 text-gray-600 px-1 rounded opacity-75">
          <Palette className="w-3 h-3 inline mr-1" />
          {component.props.backgroundColor ? 'Fondo' : 'Sin fondo'}
        </div>
      </div>
    </Rnd>
  )
}
