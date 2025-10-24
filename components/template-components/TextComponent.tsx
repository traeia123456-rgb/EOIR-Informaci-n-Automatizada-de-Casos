"use client"

import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Palette,
  Type,
  Trash2,
  Copy,
  Edit
} from 'lucide-react'

interface TextComponentProps {
  component: TemplateComponent
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate?: (updates: Partial<TemplateComponent>) => void
}

export default function TextComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate
}: TextComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(
    typeof component.props.content === 'object' ? 
    JSON.stringify(component.props.content) : 
    (component.props.content || '')
  )

  const handleContentChange = (newContent: string) => {
    setEditContent(newContent)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (onUpdate) {
      onUpdate({
        props: {
          ...component.props,
          content: editContent
        }
      })
    }
  }



  const handleCancel = () => {
    setEditContent(
      typeof component.props.content === 'object' ? 
      JSON.stringify(component.props.content) : 
      (component.props.content || '')
    )
    setIsEditing(false)
  }

  const textStyles = {
    fontSize: `${component.props.fontSize || 14}px`,
    fontFamily: component.props.fontFamily || 'Arial',
    fontWeight: component.props.fontWeight || 'normal',
    color: component.props.color || '#000000',
    textAlign: component.props.textAlign || 'left',
    lineHeight: component.props.lineHeight || 1.4,
    padding: `${component.props.padding || 0}px`,
    backgroundColor: component.props.backgroundColor || 'transparent',
    border: component.props.borderWidth ? `${component.props.borderWidth}px solid ${component.props.borderColor || '#000000'}` : 'none',
    borderRadius: `${component.props.borderRadius || 0}px`,
    opacity: component.props.opacity || 1,
    transform: component.props.rotation ? `rotate(${component.props.rotation}deg)` : 'none'
  }

  return (
    <Rnd
      default={{
        x: component.x,
        y: component.y,
        width: component.w * 50, // Ancho base para texto
        height: component.h * 30  // Alto base para texto
      }}
      minWidth={100}
      minHeight={30}
      bounds="parent"
      onMouseDown={onSelect}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className="w-full h-full relative"
        style={textStyles}
        onClick={onSelect}
      >
        {isEditing ? (
          <div className="w-full h-full">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-full border-none p-0 text-inherit bg-transparent"
              autoFocus
            />
            <div className="absolute top-0 right-0 flex gap-1 bg-white border rounded shadow-sm">
              <Button size="sm" variant="outline" onClick={handleSave}>
                ✓
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                ✕
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center">
            {typeof component.props.content === 'object' ? 
              JSON.stringify(component.props.content) : 
              (component.props.content || 'Texto de ejemplo')
            }
          </div>
        )}

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
        <div className="absolute top-1 left-1 text-xs bg-blue-100 text-blue-800 px-1 rounded opacity-75">
          Texto
        </div>
      </div>
    </Rnd>
  )
}
