import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Template } from '@/types/template'

interface ExportOptions {
  quality?: number
  scale?: number
  backgroundColor?: string
}

class ExportError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'ExportError'
  }
}

export class TemplateExporter {
  // Exportar a PNG
  static async toPNG(
    templateElement: HTMLElement,
    template: Template,
    options: ExportOptions = {}
  ): Promise<string> {
    try {
      const canvas = await html2canvas(templateElement, {
        backgroundColor: options.backgroundColor || '#ffffff',
        scale: options.scale || 2,
        useCORS: true,
        logging: false,
        allowTaint: false
      })

      return canvas.toDataURL('image/png', options.quality || 1.0)
    } catch (error) {
      throw new ExportError('Error al exportar a PNG', error as Error)
    }
  }

  // Exportar a PDF
  static async toPDF(
    templateElement: HTMLElement,
    template: Template,
    options: ExportOptions = {}
  ): Promise<Blob> {
    try {
      // Convertir el template a canvas primero
      const canvas = await html2canvas(templateElement, {
        backgroundColor: options.backgroundColor || '#ffffff',
        scale: options.scale || 2,
        useCORS: true,
        logging: false,
        allowTaint: false
      })

      // Crear PDF con las dimensiones del template
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })

      // Agregar la imagen del canvas al PDF
      const imgData = canvas.toDataURL('image/png', options.quality || 1.0)
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)

      // Generar el PDF como Blob
      return pdf.output('blob')
    } catch (error) {
      throw new ExportError('Error al exportar a PDF', error as Error)
    }
  }

  // Exportar a JSON
  static toJSON(template: Template): string {
    try {
      return JSON.stringify(template, null, 2)
    } catch (error) {
      throw new ExportError('Error al exportar a JSON', error as Error)
    }
  }

  // Descargar archivo
  static download(data: Blob | string, filename: string) {
    const blob = data instanceof Blob ? data : new Blob([data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}