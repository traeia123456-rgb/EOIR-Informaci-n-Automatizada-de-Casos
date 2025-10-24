import { z } from 'zod'
import { ComponentProps, TemplateComponent } from '@/types/template'

// Esquemas de validación para propiedades comunes
const commonPropsSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().min(0).max(20).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
  padding: z.number().min(0).max(100).optional(),
  opacity: z.number().min(0).max(1).optional(),
})

// Esquemas específicos por tipo de componente
const textPropsSchema = commonPropsSchema.extend({
  text: z.string().min(1),
  fontSize: z.number().min(8).max(200),
  fontWeight: z.number().min(100).max(900),
  textAlign: z.enum(['left', 'center', 'right', 'justify']),
  lineHeight: z.number().min(1).max(3),
})

const imagePropsSchema = commonPropsSchema.extend({
  src: z.string().url(),
  alt: z.string(),
  objectFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']),
})

const cardPropsSchema = commonPropsSchema.extend({
  title: z.string().min(1),
  content: z.string(),
  elevation: z.number().min(0).max(24),
})

const iconPropsSchema = commonPropsSchema.extend({
  name: z.string().min(1),
  size: z.number().min(8).max(200),
  color: z.string(),
})

const placeholderPropsSchema = commonPropsSchema.extend({
  key: z.string().min(1),
  type: z.enum(['text', 'image', 'number', 'date']),
  defaultValue: z.string().optional(),
})

const separatorPropsSchema = commonPropsSchema.extend({
  orientation: z.enum(['horizontal', 'vertical']),
  thickness: z.number().min(1).max(20),
  style: z.enum(['solid', 'dashed', 'dotted']),
})

const labelPropsSchema = commonPropsSchema.extend({
  text: z.string().min(1),
  htmlFor: z.string().optional(),
})

// Esquema para dimensiones y posición
const dimensionsSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().min(10),
  h: z.number().min(10),
  rotation: z.number().min(-360).max(360).optional(),
  zIndex: z.number().min(0).max(9999).optional(),
})

// Función para validar propiedades según el tipo de componente
export function validateComponentProps(
  type: string,
  props: ComponentProps
): { success: boolean; errors?: string[] } {
  try {
    let schema
    switch (type) {
      case 'text':
        schema = textPropsSchema
        break
      case 'image':
        schema = imagePropsSchema
        break
      case 'card':
        schema = cardPropsSchema
        break
      case 'icon':
        schema = iconPropsSchema
        break
      case 'placeholder':
        schema = placeholderPropsSchema
        break
      case 'separator':
        schema = separatorPropsSchema
        break
      case 'label':
        schema = labelPropsSchema
        break
      default:
        return {
          success: false,
          errors: [`Tipo de componente '${type}' no válido`]
        }
    }

    schema.parse(props)
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      return {
        success: false,
        errors: (error as { errors: Array<{ message: string }> }).errors.map((err: { message: string }) => err.message)
      }
    }
    return {
      success: false,
      errors: ['Error de validación desconocido']
    }
  }
}

// Función para validar dimensiones y posición
export function validateDimensions(
  dimensions: Pick<TemplateComponent, 'x' | 'y' | 'w' | 'h' | 'zIndex'> & { rotation?: number }
): { success: boolean; errors?: string[] } {
  try {
    dimensionsSchema.parse(dimensions)
    return { success: true }
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      return {
        success: false,
        errors: (error as { errors: Array<{ message: string }> }).errors.map((err: { message: string }) => err.message)
      }
    }
    return {
      success: false,
      errors: ['Error de validación de dimensiones']
    }
  }
}

// Función para validar un componente completo
export function validateComponent(
  component: TemplateComponent
): { success: boolean; errors?: string[] } {
  // Validar dimensiones
  const dimensionsResult = validateDimensions({
    x: component.x,
    y: component.y,
    w: component.w,
    h: component.h,
    rotation: component.props.rotation,
    zIndex: component.zIndex
  })

  if (!dimensionsResult.success) {
    return dimensionsResult
  }

  // Validar propiedades específicas del tipo
  return validateComponentProps(component.type, component.props)
}