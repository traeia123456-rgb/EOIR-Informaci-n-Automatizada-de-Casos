"use client"

import React from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Tag } from 'lucide-react'

interface PlaceholderComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function PlaceholderComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}: PlaceholderComponentProps) {
  const placeholderStyles = {
    fontSize: `${component.props.fontSize || 14}px`,
    fontFamily: component.props.fontFamily || 'monospace',
    color: component.props.color || '#3b82f6',
    backgroundColor: component.props.backgroundColor || '#dbeafe',
    padding: `${component.props.padding || 4}px`,
    border: `1px dashed ${component.props.borderColor || '#3b82f6'}`,
    borderRadius: `${component.props.borderRadius || 4}px`,
    opacity: component.props.opacity || 1
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 40,
        height: component.h * 30
      }}
      minWidth={80}
      minHeight={30}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative flex items-center justify-center"
        onClick={onSelect}
        style={placeholderStyles}
      >
        <span className="font-mono">
          {typeof component.props.content === 'object' ? 
            JSON.stringify(component.props.content) : 
            (component.props.content || `{{${component.props.placeholderKey || 'campo'}}}`)
          }
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
        <div className="absolute top-1 left-1 text-xs bg-blue-100 text-blue-800 px-1 rounded opacity-75">
          <Tag className="w-3 h-3 inline mr-1" />
          Campo
        </div>
      </div>
    </Rnd>
  )
}
