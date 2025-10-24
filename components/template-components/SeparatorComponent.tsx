"use client"

import React from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Minus } from 'lucide-react'

interface SeparatorComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function SeparatorComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}: SeparatorComponentProps) {
  const separatorStyles = {
    backgroundColor: component.props.backgroundColor || '#d1d5db',
    opacity: component.props.opacity || 1,
    transform: component.props.rotation ? `rotate(${component.props.rotation}deg)` : 'none'
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 50,
        height: component.h * 10
      }}
      minWidth={50}
      minHeight={2}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative flex items-center justify-center"
        onClick={onSelect}
        style={separatorStyles}
      >
        <div className="w-full h-full" />

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
        <div className="absolute top-1 left-1 text-xs bg-gray-100 text-gray-800 px-1 rounded opacity-75">
          <Minus className="w-3 h-3 inline mr-1" />
          Separador
        </div>
      </div>
    </Rnd>
  )
}
