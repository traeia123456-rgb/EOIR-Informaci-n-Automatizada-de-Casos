"use client"

import React, { useState, useCallback } from 'react'
import { Rnd } from 'react-rnd'
import { useDrop } from 'react-dnd'
import { Template, TemplateComponent } from '@/types/template'
import TextComponent from '../template-components/TextComponent'
import CardComponent from '../template-components/CardComponent'
import ImageComponent from '../template-components/ImageComponent'
import IconComponent from '../template-components/IconComponent'
import PlaceholderComponent from '../template-components/PlaceholderComponent'
import SeparatorComponent from '../template-components/SeparatorComponent'
import LabelComponent from '../template-components/LabelComponent'
import CaseInformationTemplate from '../template-components/CaseInformationTemplate'

interface TemplateCanvasProps {
  template: Template
  onUpdateComponent: (id: string, updates: Partial<TemplateComponent>) => void
  onSelectComponent: (id: string | null) => void
  onDeleteComponent: (id: string) => void
  onDuplicateComponent: (id: string) => void
  onAddComponent: (type: string, props?: any) => void
  selectedComponent: string | null
  showGrid: boolean
  snapToGrid: boolean
}

export default function TemplateCanvas({
  template,
  onUpdateComponent,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onAddComponent,
  selectedComponent,
  showGrid,
  snapToGrid
}: TemplateCanvasProps) {
  const [dragging, setDragging] = useState(false)

  // Memoizar el orden de componentes para optimizar el rendimiento
  const sortedComponents = React.useMemo(() => 
    template.components.sort((a, b) => a.zIndex - b.zIndex),
    [template.components]
  )

  // Configurar drop zone para el canvas
  const [{ isOver }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset) {
        const canvasRect = document.querySelector('.template-canvas')?.getBoundingClientRect()
        if (canvasRect) {
          const x = offset.x - canvasRect.left
          const y = offset.y - canvasRect.top
          
          // Aplicar snap-to-grid si está habilitado
          let finalX = x
          let finalY = y
          
          if (snapToGrid) {
            const gridSize = template.grid.rowHeight
            const gutter = template.grid.gutter
            finalX = Math.round(x / (gridSize + gutter)) * (gridSize + gutter)
            finalY = Math.round(y / gridSize) * gridSize
          }
          
          onAddComponent(item.componentType, { x: finalX, y: finalY, ...item.props })
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  // Función para calcular posición con snap-to-grid
  const snapToGridPosition = useCallback((x: number, y: number) => {
    if (!snapToGrid) return { x, y }
    
    const gridSize = template.grid.rowHeight
    
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    }
  }, [template.grid, snapToGrid])

  // Función para manejar el cambio de posición
  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    const snappedPosition = snapToGridPosition(x, y)
    onUpdateComponent(id, { x: snappedPosition.x, y: snappedPosition.y })
  }, [onUpdateComponent, snapToGridPosition])

  // Función para manejar el cambio de tamaño
  const handleResizeChange = useCallback((id: string, width: number, height: number) => {
    if (snapToGrid) {
      const gridSize = template.grid.rowHeight
      
      width = Math.round(width / gridSize) * gridSize
      height = Math.round(height / gridSize) * gridSize
    }
    
    onUpdateComponent(id, { w: width, h: height })
  }, [onUpdateComponent, snapToGrid, template.grid])

  // Función para renderizar componente según su tipo
  const renderComponent = useCallback((component: TemplateComponent) => {
    const commonProps = {
      key: component.id,
      component,
      isSelected: selectedComponent === component.id,
      onSelect: () => onSelectComponent(component.id),
      onDelete: () => onDeleteComponent(component.id),
      onDuplicate: () => onDuplicateComponent(component.id),
      onUpdate: (updates: Partial<TemplateComponent>) => onUpdateComponent(component.id, updates)
    }

    // Validar que el componente tenga propiedades válidas
    if (!component || !component.type) {
      console.warn('Componente inválido:', component)
      return null
    }

    switch (component.type) {
      case 'text':
        return <TextComponent {...commonProps} />
      case 'card':
        return <CardComponent {...commonProps} />
      case 'image':
        return <ImageComponent {...commonProps} />
      case 'icon':
        return <IconComponent {...commonProps} />
      case 'placeholder':
        return <PlaceholderComponent {...commonProps} />
      case 'separator':
        return <SeparatorComponent {...commonProps} />
      case 'label':
        return <LabelComponent {...commonProps} />
      case 'case_information':
        return <CaseInformationTemplate {...commonProps} isAdmin={true} />
      default:
        console.warn(`Tipo de componente no soportado: ${component.type}`)
        return <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded">
          Componente no soportado: {component.type}
        </div>
    }
  }, [selectedComponent, onSelectComponent, onDeleteComponent, onDuplicateComponent, onUpdateComponent])

  // Función para manejar clic en el canvas (deseleccionar)
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectComponent(null)
    }
  }, [onSelectComponent])

  // Función para manejar teclas (Delete, Ctrl+D para duplicar, Escape para deseleccionar)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedComponent) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        onDeleteComponent(selectedComponent)
      } else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        onDuplicateComponent(selectedComponent)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onSelectComponent(null)
      }
    } else if (e.key === 'Escape') {
      // Deseleccionar cualquier componente seleccionado
      onSelectComponent(null)
    }
  }, [selectedComponent, onDeleteComponent, onDuplicateComponent, onSelectComponent])

  // Agregar event listener para teclas
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div 
      ref={drop as any}
      className={`relative w-full h-full bg-white border-2 border-dashed rounded-lg overflow-hidden template-canvas ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
      onClick={handleCanvasClick}
      style={{
        backgroundImage: showGrid ? `
          linear-gradient(to right, #f0f0f0 1px, transparent 1px),
          linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
        ` : 'none',
        backgroundSize: `${template.grid.rowHeight + template.grid.gutter}px ${template.grid.rowHeight}px`
      }}
    >
      {/* Grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${template.grid.rowHeight + template.grid.gutter}px ${template.grid.rowHeight}px`
            }}
          />
        </div>
      )}

      {/* Componentes */}
      {sortedComponents
        .map(renderComponent)
        .filter(Boolean) // Filtrar componentes nulos
      }

      {/* Indicador de área de trabajo */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded border">
        {template.grid.columns} columnas × {template.grid.rowHeight}px altura
      </div>

      {/* Mensaje cuando no hay componentes */}
      {template.components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium mb-2">Canvas vacío</h3>
            <p className="text-sm">Arrastra componentes desde la barra lateral para comenzar a diseñar</p>
          </div>
        </div>
      )}
    </div>
  )
}
