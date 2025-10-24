"use client"

import React from 'react'
import { Template } from '@/types/template'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MoveUp,
  MoveDown
} from 'lucide-react'

interface TemplateToolbarProps {
  template: Template
  onUpdateTemplate: (template: Template) => void
  showGrid: boolean
  snapToGrid: boolean
}

export default function TemplateToolbar({
  template,
  onUpdateTemplate,
  showGrid,
  snapToGrid
}: TemplateToolbarProps) {
  const handleGridChange = (key: string, value: number) => {
    // Validar valores del grid
    let validatedValue = value
    
    if (key === 'columns') {
      validatedValue = Math.max(1, Math.min(24, value)) // Entre 1 y 24 columnas
    } else if (key === 'gutter') {
      validatedValue = Math.max(0, Math.min(100, value)) // Entre 0 y 100px
    } else if (key === 'rowHeight') {
      validatedValue = Math.max(10, Math.min(200, value)) // Entre 10 y 200px
    }
    
    onUpdateTemplate({
      ...template,
      grid: {
        ...template.grid,
        [key]: validatedValue
      }
    })
  }

  const handleSettingChange = (key: string, value: boolean) => {
    onUpdateTemplate({
      ...template,
      settings: {
        ...template.settings,
        [key]: value
      }
    })
  }

  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Configuración del Grid */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-gray-600" />
            <Label htmlFor="gridColumns" className="text-sm font-medium">Columnas:</Label>
            <Input
              id="gridColumns"
              type="number"
              value={template.grid.columns}
              onChange={(e) => handleGridChange('columns', parseInt(e.target.value))}
              className="w-16 h-8 text-center"
              min={1}
              max={24}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="gridGutter" className="text-sm font-medium">Espaciado:</Label>
            <Input
              id="gridGutter"
              type="number"
              value={template.grid.gutter}
              onChange={(e) => handleGridChange('gutter', parseInt(e.target.value))}
              className="w-16 h-8 text-center"
              min={0}
              max={50}
            />
            <span className="text-sm text-gray-500">px</span>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="gridRowHeight" className="text-sm font-medium">Altura:</Label>
            <Input
              id="gridRowHeight"
              type="number"
              value={template.grid.rowHeight}
              onChange={(e) => handleGridChange('rowHeight', parseInt(e.target.value))}
              className="w-16 h-8 text-center"
              min={10}
              max={100}
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>

        {/* Controles de visualización */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('showGrid', !showGrid)}
              className="h-8 px-3"
            >
                             <Grid className="w-4 h-4 mr-1" />
              Grid
            </Button>
            
            <Button
              variant={snapToGrid ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('snapToGrid', !snapToGrid)}
              className="h-8 px-3"
            >
              <Layers className="w-4 h-4 mr-1" />
              Snap
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Controles de alineación */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Alinear a la izquierda"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Alinear al centro"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Alinear a la derecha"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Justificar"
            >
              <AlignJustify className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Controles de capas */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Traer al frente"
            >
              <MoveUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Enviar atrás"
            >
              <MoveDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Controles de zoom */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-600 px-2">100%</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Información del canvas */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Canvas: {template.grid.columns} × ∞</span>
          <span>Componentes: {template.components.length}</span>
        </div>
      </div>
    </div>
  )
}
