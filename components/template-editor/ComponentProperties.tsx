"use client"

import React, { useState } from 'react'
import { TemplateComponent } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trash2, 
  Copy, 
  Type, 
  Palette, 
  Layout, 
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'

interface ComponentPropertiesProps {
  component: TemplateComponent
  onUpdate: (updates: Partial<TemplateComponent>) => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function ComponentProperties({
  component,
  onUpdate,
  onDelete,
  onDuplicate
}: ComponentPropertiesProps) {
  const [activeTab, setActiveTab] = useState('content')

  const handlePropertyChange = (key: string, value: any) => {
    // Validar valores numéricos
    if (typeof value === 'string' && (key.includes('Size') || key.includes('Width') || key.includes('Height') || key.includes('Padding') || key.includes('Margin'))) {
      const numValue = parseInt(value)
      if (isNaN(numValue)) return
      value = numValue
    }
    
    // Validar valores de opacidad
    if (key === 'opacity') {
      const numValue = parseFloat(value)
      if (isNaN(numValue) || numValue < 0 || numValue > 1) return
      value = numValue
    }
    
    // Validar valores de rotación
    if (key === 'rotation') {
      const numValue = parseInt(value)
      if (isNaN(numValue) || numValue < -180 || numValue > 180) return
      value = numValue
    }
    
    onUpdate({
      props: {
        ...component.props,
        [key]: value
      }
    })
  }

  const handlePositionChange = (key: string, value: number) => {
    // Validar posiciones y dimensiones
    let validatedValue = value
    
    if (key === 'x' || key === 'y') {
      validatedValue = Math.max(0, value) // No permitir valores negativos
    } else if (key === 'w') {
      validatedValue = Math.max(1, Math.min(12, value)) // Entre 1 y 12 columnas
    } else if (key === 'h') {
      validatedValue = Math.max(1, Math.min(20, value)) // Entre 1 y 20 filas
    } else if (key === 'zIndex') {
      validatedValue = Math.max(0, value) // Z-index no negativo
    }
    
    onUpdate({ [key]: validatedValue })
  }

  const getComponentIcon = () => {
    switch (component.type) {
      case 'text': return <Type className="w-4 h-4" />
      case 'card': return <Layout className="w-4 h-4" />
      case 'image': return <Eye className="w-4 h-4" />
      case 'icon': return <Type className="w-4 h-4" />
      case 'placeholder': return <Type className="w-4 h-4" />
      case 'separator': return <Layout className="w-4 h-4" />
      case 'label': return <Type className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getComponentName = () => {
    switch (component.type) {
      case 'text': return 'Texto Enriquecido'
      case 'card': return 'Contenedor'
      case 'image': return 'Imagen'
      case 'icon': return 'Icono/Emoji'
      case 'placeholder': return 'Campo Dinámico'
      case 'separator': return 'Separador'
      case 'label': return 'Etiqueta'
      default: return 'Componente'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {getComponentIcon()}
          </div>
          <div>
            <h3 className="font-medium">{getComponentName()}</h3>
            <p className="text-sm text-gray-500">ID: {component.id.slice(0, 8)}...</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            className="flex-1"
          >
            <Copy className="w-3 h-3 mr-1" />
            Duplicar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        {/* Tab de Contenido */}
        <TabsContent value="content" className="flex-1 p-4 space-y-4">
          {component.type === 'text' && (
            <>
              <div>
                <Label htmlFor="content">Texto</Label>
                <Textarea
                  id="content"
                  value={typeof component.props.content === 'object' ? JSON.stringify(component.props.content, null, 2) : (component.props.content || '')}
                  onChange={(e) => handlePropertyChange('content', e.target.value)}
                  placeholder="Ingresa el texto..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fontSize">Tamaño de fuente</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={component.props.fontSize || 14}
                    onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                    min={8}
                    max={72}
                  />
                </div>
                <div>
                  <Label htmlFor="fontFamily">Fuente</Label>
                  <Select
                    value={component.props.fontFamily || 'Arial'}
                    onValueChange={(value) => handlePropertyChange('fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="textAlign">Alineación</Label>
                <Select
                  value={component.props.textAlign || 'left'}
                  onValueChange={(value) => handlePropertyChange('textAlign', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Izquierda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Derecha</SelectItem>
                    <SelectItem value="justify">Justificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {component.type === 'card' && (
            <>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={component.props.title || ''}
                  onChange={(e) => handlePropertyChange('title', e.target.value)}
                  placeholder="Título de la tarjeta"
                />
              </div>
              
              <div>
                <Label htmlFor="cardContent">Contenido</Label>
                <Textarea
                  id="cardContent"
                  value={typeof component.props.content === 'object' ? JSON.stringify(component.props.content, null, 2) : (component.props.content || '')}
                  onChange={(e) => handlePropertyChange('content', e.target.value)}
                  placeholder="Contenido de la tarjeta..."
                  rows={3}
                />
              </div>
            </>
          )}

          {component.type === 'image' && (
            <>
              <div>
                <Label htmlFor="imageSrc">URL de la imagen</Label>
                <Input
                  id="imageSrc"
                  value={component.props.src || ''}
                  onChange={(e) => handlePropertyChange('src', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="imageAlt">Texto alternativo</Label>
                <Input
                  id="imageAlt"
                  value={component.props.alt || ''}
                  onChange={(e) => handlePropertyChange('alt', e.target.value)}
                  placeholder="Descripción de la imagen"
                />
              </div>

              <div>
                <Label htmlFor="imageFit">Ajuste</Label>
                <Select
                  value={component.props.fit || 'cover'}
                  onValueChange={(value) => handlePropertyChange('fit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cubrir</SelectItem>
                    <SelectItem value="contain">Contener</SelectItem>
                    <SelectItem value="fill">Llenar</SelectItem>
                    <SelectItem value="none">Ninguno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {component.type === 'placeholder' && (
            <>
              <div>
                <Label htmlFor="placeholderKey">Clave del campo</Label>
                <Input
                  id="placeholderKey"
                  value={component.props.placeholderKey || ''}
                  onChange={(e) => handlePropertyChange('placeholderKey', e.target.value)}
                  placeholder="nombre, fecha, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="placeholderType">Tipo de campo</Label>
                <Select
                  value={component.props.placeholderType || 'text'}
                  onValueChange={(value) => handlePropertyChange('placeholderType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="date">Fecha</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="currency">Moneda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </TabsContent>

        {/* Tab de Estilo */}
        <TabsContent value="style" className="flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="backgroundColor">Color de fondo</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={component.props.backgroundColor || '#ffffff'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={component.props.backgroundColor || ''}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="color">Color de texto</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={component.props.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={component.props.color || ''}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="borderColor">Color del borde</Label>
              <div className="flex gap-2">
                <Input
                  id="borderColor"
                  type="color"
                  value={component.props.borderColor || '#000000'}
                  onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={component.props.borderColor || ''}
                  onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="borderWidth">Ancho del borde</Label>
              <Input
                id="borderWidth"
                type="number"
                value={component.props.borderWidth || 0}
                onChange={(e) => handlePropertyChange('borderWidth', parseInt(e.target.value))}
                min={0}
                max={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="borderRadius">Radio del borde</Label>
              <Input
                id="borderRadius"
                type="number"
                value={component.props.borderRadius || 0}
                onChange={(e) => handlePropertyChange('borderRadius', parseInt(e.target.value))}
                min={0}
                max={50}
              />
            </div>
            
            <div>
              <Label htmlFor="padding">Padding</Label>
              <Input
                id="padding"
                type="number"
                value={component.props.padding || 0}
                onChange={(e) => handlePropertyChange('padding', parseInt(e.target.value))}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="opacity">Opacidad</Label>
            <Input
              id="opacity"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={component.props.opacity || 1}
              onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
            />
            <div className="text-sm text-gray-500 mt-1">
              {Math.round((component.props.opacity || 1) * 100)}%
            </div>
          </div>
        </TabsContent>

        {/* Tab de Layout */}
        <TabsContent value="layout" className="flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="x">Posición X</Label>
              <Input
                id="x"
                type="number"
                value={component.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                min={0}
              />
            </div>
            
            <div>
              <Label htmlFor="y">Posición Y</Label>
              <Input
                id="y"
                type="number"
                value={component.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="w">Ancho</Label>
              <Input
                id="w"
                type="number"
                value={component.w}
                onChange={(e) => handlePositionChange('w', parseInt(e.target.value))}
                min={1}
                max={12}
              />
            </div>
            
            <div>
              <Label htmlFor="h">Alto</Label>
              <Input
                id="h"
                type="number"
                value={component.h}
                onChange={(e) => handlePositionChange('h', parseInt(e.target.value))}
                min={1}
                max={20}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="zIndex">Z-Index</Label>
            <Input
              id="zIndex"
              type="number"
              value={component.zIndex}
              onChange={(e) => handlePositionChange('zIndex', parseInt(e.target.value))}
              min={0}
            />
          </div>

          <div>
            <Label htmlFor="rotation">Rotación</Label>
            <Input
              id="rotation"
              type="range"
              min="-180"
              max="180"
              value={component.props.rotation || 0}
              onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value))}
            />
            <div className="text-sm text-gray-500 mt-1">
              {component.props.rotation || 0}°
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
