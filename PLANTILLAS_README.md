# 📄 Sistema de Plantillas de Casos - EOIR

## 🎯 Descripción General

El Sistema de Plantillas de Casos es un editor visual WYSIWYG tipo canvas que permite a los administradores diseñar plantillas personalizadas para visualizar información de casos de inmigración. Incluye todas las funcionalidades solicitadas: drag & drop, componentes editables, sistema de grid, y capacidades de exportación.

## ✨ Características Principales

### 🎨 Editor Visual WYSIWYG
- Canvas con rejilla configurable (12 columnas por defecto)
- Snap-to-grid y posicionamiento libre
- Sistema de drag & drop para componentes
- Vista previa en tiempo real

### 🧩 Componentes Disponibles

#### 📝 Texto Enriquecido
- Editor con formato completo (bold, italic, alineación)
- Fuentes personalizables (Arial, Helvetica, Times New Roman, etc.)
- Tamaños de fuente de 8px a 72px
- Colores personalizables

#### 📦 Contenedores (Cards)
- Paneles con bordes y sombras configurables
- Padding y margin ajustables
- Fondos personalizables
- Bordes redondeados

#### 🖼️ Imágenes
- Soporte para .png, .jpg, .gif
- Opciones de ajuste: cover, contain, fill, none
- URLs externas o carga de archivos
- Texto alternativo para accesibilidad

#### 🎭 Iconos/Emojis
- Emojis integrados
- Tamaños personalizables
- Rotación y opacidad

#### 🏷️ Campos Dinámicos (Placeholders)
- Mapeo con datos del caso: `{{nombre}}`, `{{fecha_audiencia}}`, etc.
- Tipos: texto, fecha, número, moneda
- Visualización en tiempo real

#### ➖ Separadores
- Líneas: sólidas, punteadas, discontinuas
- Colores y grosores personalizables

#### 🔖 Etiquetas
- Estilos predefinidos: default, success, warning, error, info
- Colores y texto personalizables

### 🛠️ Funcionalidades de Manipulación

#### ↔️ Posicionamiento y Redimensionamiento
- Arrastrar y soltar componentes
- Redimensionamiento con handles
- Snap-to-grid opcional
- Coordenadas precisas (X, Y, ancho, alto)

#### 🎚️ Capas y Orden
- Z-index configurable
- Traer al frente / Enviar atrás
- Agrupación de elementos

#### 🎯 Selección y Edición
- Selección múltiple (próximamente)
- Copiar y pegar
- Duplicar elementos
- Eliminar con tecla Delete

#### ↩️ Historial y Deshacer
- Sistema de Undo/Redo
- Historial de versiones
- Mensajes descriptivos de cambios

### 💾 Gestión de Plantillas

#### 📂 CRUD Completo
- Crear nuevas plantillas
- Listar y filtrar plantillas existentes
- Editar plantillas guardadas
- Duplicar plantillas
- Eliminar plantillas

#### 🔍 Búsqueda y Filtros
- Búsqueda por nombre, descripción y tags
- Filtros por categoría (audiencia, tribunal, apelación, etc.)
- Filtros por estado (activo, inactivo, borrador)
- Vista en grid o lista

#### 🏷️ Categorización
- Categorías predefinidas: audiencia, tribunal, apelación, general, custom
- Tags personalizables
- Estados: activo, inactivo, borrador
- Versioning automático

### 📤 Exportación y Uso

#### 📋 Formatos de Exportación
- **JSON**: Estructura completa de la plantilla
- **PNG**: Imagen de la plantilla (próximamente)
- **PDF**: Documento para impresión (próximamente)

#### 🔄 Renderizado Dinámico
- Reemplazo de placeholders con datos reales
- Renderizado server-side y client-side
- Preview con datos de muestra

### ⚙️ Configuración Avanzada

#### 📐 Sistema de Grid
- Columnas configurables (1-24)
- Espaciado (gutter) personalizable
- Altura de fila ajustable
- Sistema responsive (próximamente)

#### 💾 Autosave
- Guardado automático cada 30 segundos
- Indicador de cambios sin guardar
- Recuperación de sesión

#### 🔒 Seguridad y Permisos
- Control de acceso por roles
- Validación de subidas de archivos
- Límites de tamaño y tipo

## 🏗️ Arquitectura Técnica

### 📁 Estructura de Archivos

```
components/
├── template-editor/
│   ├── TemplateEditor.tsx          # Componente principal del editor
│   ├── ComponentProperties.tsx     # Panel de propiedades
│   └── TemplateToolbar.tsx         # Barra de herramientas
├── template-canvas/
│   └── TemplateCanvas.tsx          # Canvas de diseño
├── template-sidebar/
│   └── TemplateSidebar.tsx         # Barra lateral con componentes
├── template-components/
│   ├── TextComponent.tsx           # Componente de texto
│   ├── CardComponent.tsx           # Componente de contenedor
│   ├── ImageComponent.tsx          # Componente de imagen
│   ├── IconComponent.tsx           # Componente de icono
│   ├── PlaceholderComponent.tsx    # Componente de placeholder
│   ├── SeparatorComponent.tsx      # Componente separador
│   └── LabelComponent.tsx          # Componente de etiqueta
└── template-management/
    └── TemplateManagement.tsx      # Gestión de plantillas
```

### 🔧 Tecnologías Utilizadas

#### Frontend
- **React 18** con TypeScript
- **Next.js 14** para SSR/SSG
- **TailwindCSS** para estilos
- **Shadcn/ui** para componentes UI

#### Drag & Drop y Canvas
- **react-dnd** para drag & drop
- **react-rnd** para redimensionamiento
- **react-grid-layout** para sistema de grid

#### Editor de Texto
- **@tiptap/react** para texto enriquecido
- Extensiones: placeholder, text-align, color, font-family

#### Estado y Datos
- **React Hooks** para estado local
- **Supabase** para almacenamiento (futuro)
- **LocalStorage** para configuraciones

### 📊 Modelo de Datos

#### Template Interface
```typescript
interface Template {
  meta: TemplateMeta           // Metadatos
  grid: TemplateGrid          // Configuración del grid
  components: TemplateComponent[]  // Componentes
  responsive: ResponsiveConfig     // Configuración responsive
  settings: TemplateSettings       // Configuraciones
}
```

#### TemplateComponent Interface
```typescript
interface TemplateComponent {
  id: string                  // ID único
  type: ComponentType         // Tipo de componente
  x: number                   // Posición X
  y: number                   // Posición Y
  w: number                   // Ancho
  h: number                   // Alto
  props: ComponentProps       // Propiedades específicas
  zIndex: number             // Orden de capas
  locked?: boolean           // Bloqueado para edición
  groupId?: string           // Agrupación
}
```

## 📋 Datos de Placeholder Disponibles

El sistema incluye los siguientes placeholders para mapear datos de casos:

- `{{nombre}}` - Nombre completo del caso
- `{{numero_registro}}` - Número de registro
- `{{fecha_audiencia}}` - Fecha de la próxima audiencia
- `{{estado_caso}}` - Estado actual del caso
- `{{tribunal}}` - Tribunal asignado
- `{{juez}}` - Juez asignado
- `{{direccion}}` - Dirección del tribunal

## 🚀 Uso del Sistema

### 1. Acceso al Editor
1. Navegar al Dashboard
2. Seleccionar la pestaña "Plantillas"
3. Hacer clic en "Nueva Plantilla"

### 2. Diseño de Plantilla
1. Arrastrar componentes desde la barra lateral
2. Posicionar y redimensionar en el canvas
3. Configurar propiedades en el panel derecho
4. Previsualizar con datos de muestra

### 3. Guardado y Gestión
1. Asignar nombre y descripción
2. Seleccionar categoría y tags
3. Guardar plantilla
4. Gestionar desde la lista principal

### 4. Uso en Casos
1. Seleccionar plantilla al crear caso
2. Los placeholders se reemplazan automáticamente
3. Exportar en formato deseado

## 🎯 Ejemplos de Plantillas

### Plantilla de Audiencia
```json
{
  "meta": {
    "name": "Vista Resumen de Audiencia",
    "category": "audiencia",
    "tags": ["audiencia", "tribunal"]
  },
  "components": [
    {
      "type": "card",
      "props": {
        "title": "Información automatizada de casos",
        "backgroundColor": "#f3f4f6"
      }
    },
    {
      "type": "placeholder",
      "props": {
        "content": "{{nombre}}",
        "placeholderKey": "nombre"
      }
    }
  ]
}
```

## 🔄 Flujo de Trabajo

1. **Diseño**: Crear plantilla con editor visual
2. **Configuración**: Ajustar grid, componentes y propiedades
3. **Preview**: Vista previa con datos de muestra
4. **Guardado**: Almacenar plantilla con metadatos
5. **Uso**: Aplicar a casos reales con datos dinámicos
6. **Exportación**: Generar documentos finales

## 🚧 Funcionalidades Futuras

### Próximas Mejoras
- [ ] Sistema responsive completo
- [ ] Exportación a PNG/PDF
- [ ] Plantillas prediseñadas
- [ ] Colaboración en tiempo real
- [ ] Importación de plantillas
- [ ] API REST completa
- [ ] Sistema de permisos granular
- [ ] Analytics de uso
- [ ] Integración con almacenamiento en la nube

### Optimizaciones Técnicas
- [ ] Lazy loading de componentes
- [ ] Optimización de performance
- [ ] Cache de plantillas
- [ ] Compresión de datos
- [ ] Tests unitarios y E2E

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema de plantillas:

1. Revisar esta documentación
2. Verificar ejemplos de uso
3. Consultar logs del sistema
4. Contactar al equipo de desarrollo

---

**Desarrollado para EOIR - Executive Office for Immigration Review**  
*Sistema de Gestión de Casos de Inmigración*
