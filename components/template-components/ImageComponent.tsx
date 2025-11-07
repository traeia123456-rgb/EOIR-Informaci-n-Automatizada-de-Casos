"use client"

import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { 
  Edit, 
  Trash2, 
  Copy
} from 'lucide-react'
import Image from 'next/image'

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
  const [src, setSrc] = useState(component.props.src || '/placeholder-image.jpg')
  useEffect(() => {
    setSrc(component.props.src || '/placeholder-image.jpg')
  }, [component.props.src])

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
        <Image
          fill
          src={src}
          alt={component.props.alt || 'Imagen'}
          className="rounded"
          style={imageStyles}
          sizes="100vw"
          onError={() => {
            setSrc('/placeholder-image.jpg')
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
