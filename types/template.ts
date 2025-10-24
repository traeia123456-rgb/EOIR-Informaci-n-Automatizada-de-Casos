// Tipos para el sistema de plantillas de casos

export interface TemplateComponent {
  id: string
  type: 'text' | 'card' | 'image' | 'icon' | 'placeholder' | 'separator' | 'label' | 'case_information'
  x: number
  y: number
  w: number
  h: number
  props: ComponentProps
  zIndex: number
  locked?: boolean
  groupId?: string
}

export interface ComponentProps {
  // Texto enriquecido
  content?: string | Record<string, string>
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  lineHeight?: number
  
  // Contenedores
  title?: string
  backgroundColor?: string
  backgroundImage?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  padding?: number
  margin?: number
  shadow?: string
  
  // Imágenes
  src?: string
  alt?: string
  fit?: 'cover' | 'contain' | 'fill' | 'none'
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
  
  // Placeholders
  placeholderKey?: string
  placeholderType?: 'text' | 'date' | 'number' | 'currency'
  
  // Separadores y etiquetas
  separatorType?: 'line' | 'dashed' | 'dotted'
  labelText?: string
  labelStyle?: 'default' | 'success' | 'warning' | 'error' | 'info'
  
  // Estilos generales
  opacity?: number
  rotation?: number
  customCSS?: string
}

export interface TemplateGrid {
  columns: number
  gutter: number
  rowHeight: number
  breakpoints: {
    lg: number
    md: number
    sm: number
    xs: number
    xxs: number
  }
}

export interface TemplateMeta {
  id: string
  name: string
  description: string
  tags: string[]
  status: 'active' | 'inactive' | 'draft'
  version: number
  createdBy: string
  createdAt: string
  updatedAt: string
  thumbnail?: string
  category: 'audiencia' | 'tribunal' | 'apelacion' | 'general' | 'custom'
  isDefault?: boolean
}

export interface Template {
  meta: TemplateMeta
  grid: TemplateGrid
  components: TemplateComponent[]
  responsive: {
    breakpoints: {
      lg: TemplateComponent[]
      md: TemplateComponent[]
      sm: TemplateComponent[]
      xs: TemplateComponent[]
      xxs: TemplateComponent[]
    }
  }
  settings: {
    autosave: boolean
    autosaveInterval: number
    snapToGrid: boolean
    showGrid: boolean
    showGuides: boolean
  }
}

export interface TemplateHistory {
  id: string
  templateId: string
  version: number
  data: Template
  createdAt: string
  createdBy: string
  message: string
}

export interface TemplateExport {
  json: string
  png?: string
  pdf?: string
  html: string
}

export interface PlaceholderData {
  [key: string]: string | number | Date | null
}

// Tipos para el editor
export interface EditorState {
  selectedComponent: string | null
  clipboard: TemplateComponent | null
  history: TemplateHistory[]
  currentHistoryIndex: number
  isDirty: boolean
  lastSaved: string | null
}

export interface DragItem {
  type: string
  componentType: string
  props?: Partial<ComponentProps>
}

// Tipos para la API
export interface CreateTemplateRequest {
  name: string
  description: string
  tags: string[]
  category: string
  grid: Partial<TemplateGrid>
}

export interface UpdateTemplateRequest {
  id: string
  data: Partial<Template>
  message?: string
}

export interface RenderTemplateRequest {
  templateId: string
  data: PlaceholderData
  format: 'html' | 'pdf' | 'png'
}

export interface TemplateListResponse {
  templates: Template[]
  total: number
  page: number
  limit: number
  filters: {
    status?: string
    category?: string
    tags?: string[]
    search?: string
  }
}
