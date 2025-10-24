"use client"

import React from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Trash2, Copy } from 'lucide-react'

interface IconComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function IconComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}: IconComponentProps) {
  const iconStyles = {
    fontSize: `${component.props.fontSize || 24}px`,
    opacity: component.props.opacity || 1,
    transform: component.props.rotation ? `rotate(${component.props.rotation}deg)` : 'none'
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 30,
        height: component.h * 30
      }}
      minWidth={30}
      minHeight={30}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative flex items-center justify-center"
        onClick={onSelect}
        style={iconStyles}
      >
        <span>{typeof component.props.content === 'object' ? 
          JSON.stringify(component.props.content) : 
          (component.props.content || '📄')}</span>

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
        <div className="absolute top-1 left-1 text-xs bg-yellow-100 text-yellow-800 px-1 rounded opacity-75">
          Icono
        </div>
      </div>
    </Rnd>
  )
}
