import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TemplateComponent } from '@/types/template'
import { cn } from '@/lib/utils'

interface VirtualCanvasProps {
  components: TemplateComponent[]
  containerWidth: number
  containerHeight: number
  gridSize: number
  onComponentInView?: (componentId: string) => void
  className?: string
}

interface VisibleRange {
  startRow: number
  endRow: number
  startCol: number
  endCol: number
}

export const VirtualCanvas: React.FC<VirtualCanvasProps> = ({
  components,
  containerWidth,
  containerHeight,
  gridSize,
  onComponentInView,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    startRow: 0,
    endRow: 0,
    startCol: 0,
    endCol: 0
  })

  // Calcular número de columnas y filas visibles
  const visibleCols = Math.ceil(containerWidth / gridSize)
  const visibleRows = Math.ceil(containerHeight / gridSize)

  // Buffer adicional para scroll suave
  const BUFFER_CELLS = 2

  // Actualizar rango visible
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollLeft } = containerRef.current

    const startCol = Math.floor(scrollLeft / gridSize) - BUFFER_CELLS
    const endCol = startCol + visibleCols + BUFFER_CELLS * 2
    const startRow = Math.floor(scrollTop / gridSize) - BUFFER_CELLS
    const endRow = startRow + visibleRows + BUFFER_CELLS * 2

    setVisibleRange({
      startCol: Math.max(0, startCol),
      endCol,
      startRow: Math.max(0, startRow),
      endRow
    })
  }, [gridSize, visibleCols, visibleRows])

  // Manejar scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      requestAnimationFrame(updateVisibleRange)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [updateVisibleRange])

  // Intersection Observer para componentes visibles
  useEffect(() => {
    if (!onComponentInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const componentId = entry.target.getAttribute('data-component-id')
            if (componentId) {
              onComponentInView(componentId)
            }
          }
        })
      },
      {
        root: containerRef.current,
        threshold: 0.1
      }
    )

    // Observar componentes visibles
    const componentElements = containerRef.current?.querySelectorAll('[data-component-id]')
    componentElements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [onComponentInView, visibleRange])

  // Filtrar componentes visibles
  const visibleComponents = components.filter((component) => {
    const componentCol = Math.floor(component.x / gridSize)
    const componentRow = Math.floor(component.y / gridSize)
    const componentEndCol = Math.ceil((component.x + component.w) / gridSize)
    const componentEndRow = Math.ceil((component.y + component.h) / gridSize)

    return (
      componentCol <= visibleRange.endCol &&
      componentEndCol >= visibleRange.startCol &&
      componentRow <= visibleRange.endRow &&
      componentEndRow >= visibleRange.startRow
    )
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-auto',
        className
      )}
      style={{
        width: containerWidth,
        height: containerHeight
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        {visibleComponents.map((component) => (
          <div
            key={component.id}
            data-component-id={component.id}
            className="absolute"
            style={{
              transform: `translate(${component.x}px, ${component.y}px)`,
              width: component.w * gridSize,
              height: component.h * gridSize
            }}
          >
            {/* Renderizar el componente específico aquí */}
            <div className="w-full h-full p-2">
              {typeof component.props.content === 'object' ? 
                JSON.stringify(component.props.content) : 
                (component.props.content || '')
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}