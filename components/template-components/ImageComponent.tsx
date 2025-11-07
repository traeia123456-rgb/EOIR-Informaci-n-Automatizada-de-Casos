"use client"

import React from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { 
  Edit, 
  Trash2, 
  Copy, 
  Image as ImageIcon
} from 'lucide-react'

interface ImageComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate?: (updates: Partial<TemplateComponent>) => void
}

export default function ImageComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate
}: ImageComponentProps) {
  const imageStyles = {
    objectFit: component.props.fit || 'cover',
    opacity: component.props.opacity || 1,
    transform: component.props.rotation ? `rotate(${component.props.rotation}deg)` : 'none'
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 50,
        height: component.h * 50
      }}
      minWidth={50}
      minHeight={50}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative"
        onClick={onSelect}
      >
        <img
          src={component.props.src || '/placeholder-image.jpg'}
          alt={component.props.alt || 'Imagen'}
          className="w-full h-full rounded"
          style={imageStyles}
          onError={(e) => {
            // Si la imagen falla, mostrar placeholder
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-image.jpg'
            target.onerror = null // Prevenir loop infinito
          }}
        />

        {/* Toolbar de edición cuando está seleccionado */}
        {isSelected && (
          <div className="absolute -top-10 left-0 bg-white border rounded-lg shadow-lg p-2 flex items-center gap-1">
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
        <div className="absolute top-1 left-1 text-xs bg-purple-100 text-purple-800 px-1 rounded opacity-75">
          Imagen
        </div>
      </div>
    </Rnd>
  )
}
