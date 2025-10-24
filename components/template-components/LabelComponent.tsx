"use client"

import React from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Tag } from 'lucide-react'

interface LabelComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function LabelComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}: LabelComponentProps) {
  const labelStyles = {
    backgroundColor: component.props.backgroundColor || '#3b82f6',
    color: component.props.color || '#ffffff',
    padding: `${component.props.padding || 8}px`,
    borderRadius: `${component.props.borderRadius || 4}px`,
    fontSize: `${component.props.fontSize || 12}px`,
    fontWeight: component.props.fontWeight || 'medium',
    opacity: component.props.opacity || 1,
    transform: component.props.rotation ? `rotate(${component.props.rotation}deg)` : 'none'
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 40,
        height: component.h * 30
      }}
      minWidth={60}
      minHeight={30}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative flex items-center justify-center"
        onClick={onSelect}
        style={labelStyles}
      >
        <span className="text-center">
          {component.props.labelText || 'Etiqueta'}
        </span>

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
        <div className="absolute top-1 left-1 text-xs bg-orange-100 text-orange-800 px-1 rounded opacity-75">
          <Tag className="w-3 h-3 inline mr-1" />
          Label
        </div>
      </div>
    </Rnd>
  )
}
