# Sistema de Traducción Automática

Este sistema permite traducir automáticamente textos que no están en el diccionario estático, evitando la necesidad de agregar manualmente cada nueva traducción.

## Características Principales

- ✅ **Detección automática** de textos faltantes en el diccionario
- ✅ **Traducción automática** usando Google Translate API
- ✅ **Caché inteligente** para evitar llamadas repetidas a la API
- ✅ **Fallback básico** para textos comunes sin API key
- ✅ **Persistencia** de traducciones en localStorage
- ✅ **Exportar/Importar** diccionarios de traducciones
- ✅ **Configuración flexible** para habilitar/deshabilitar la funcionalidad

## Instalación y Configuración

### 1. Seleccionar Proveedor de Traducción

El sistema soporta múltiples proveedores de traducción:

#### 🟢 LibreTranslate (Recomendado para empezar)

- **Gratuito**: Completamente gratuito
- **Sin API key**: No requiere configuración
- **Fácil**: Solo selecciona como proveedor
- **URL por defecto**: https://libretranslate.de

#### 🔵 MyMemory

- **Gratuito**: Con límites de uso
- **Sin API key**: No requiere configuración
- **Límites**: 1000 palabras por día
- **Calidad**: Buena calidad de traducción

#### 🔵 Azure Translator

- **Gratuito**: Con límites generosos
- **Con API key**: Requiere registro gratuito
- **Límites**: 2 millones de caracteres por mes
- **Calidad**: Excelente calidad

#### 🟠 Google Translate

- **Premium**: Requiere facturación
- **Con API key**: Requiere configuración compleja
- **Calidad**: Mejor calidad disponible
- **Costo**: Pago por uso

### 2. Configurar el Sistema

El sistema se configura automáticamente, pero puedes personalizar la configuración:

```typescript
import { autoTranslateService } from "@/lib/auto-translate";

// Configuración para LibreTranslate (recomendado)
autoTranslateService.updateConfig({
  enabled: true,
  provider: "libretranslate",
  libreTranslateUrl: "https://libretranslate.de",
  fallbackLanguage: "es",
  cacheTranslations: true,
});

// Configuración para Azure Translator
autoTranslateService.updateConfig({
  enabled: true,
  provider: "azure",
  apiKey: "tu-azure-api-key",
  azureRegion: "global",
  fallbackLanguage: "es",
  cacheTranslations: true,
});
```

## Uso en Componentes

### Método 1: Hook useLanguage (Recomendado)

```typescript
import { useLanguage } from "@/components/language-provider";

function MiComponente() {
  const { t, tAsync, autoTranslateEnabled } = useLanguage();

  // Traducción síncrona (comportamiento original)
  const textoExistente = t("existing_key");

  // Traducción asíncrona con traducción automática
  const textoNuevo = await tAsync("new_text_key");

  return (
    <div>
      <p>{textoExistente}</p>
      <p>{textoNuevo}</p>
    </div>
  );
}
```

### Método 2: Hook useAutoTranslate (Avanzado)

```typescript
import { useAutoTranslate } from "@/lib/use-auto-translate";

function MiComponente() {
  const { translate, isTranslating } = useAutoTranslate({
    showLoadingState: true,
  });

  const [texto, setTexto] = useState("");

  useEffect(() => {
    const traducirTexto = async () => {
      const traducido = await translate("new_text");
      setTexto(traducido);
    };
    traducirTexto();
  }, []);

  return (
    <div>
      {isTranslating("new_text") ? (
        <Loader2 className="animate-spin" />
      ) : (
        <p>{texto}</p>
      )}
    </div>
  );
}
```

### Método 3: Servicio Directo

```typescript
import { translateMissingText } from "@/lib/auto-translate";

async function traducirTexto(texto: string, idioma: "es" | "en") {
  const traducido = await translateMissingText(texto, idioma);
  return traducido;
}
```

## Ejemplos Prácticos

### Ejemplo 1: Formulario con Etiquetas Dinámicas

```typescript
function FormularioEjemplo() {
  const { tAsync } = useLanguage();
  const [etiquetas, setEtiquetas] = useState({});

  useEffect(() => {
    const cargarEtiquetas = async () => {
      const etiquetasTraducidas = {
        name: await tAsync("Full Name"),
        email: await tAsync("Email Address"),
        phone: await tAsync("Phone Number"),
      };
      setEtiquetas(etiquetasTraducidas);
    };
    cargarEtiquetas();
  }, []);

  return (
    <form>
      <label>{etiquetas.name}</label>
      <input placeholder={etiquetas.name} />
    </form>
  );
}
```

### Ejemplo 2: Lista Dinámica con Traducción

```typescript
function ListaEjemplo() {
  const { tAsync } = useLanguage();
  const [items, setItems] = useState([]);

  const elementos = ["Dashboard", "Settings", "Profile", "Logout"];

  useEffect(() => {
    const traducirElementos = async () => {
      const elementosTraducidos = await Promise.all(
        elementos.map(async (elemento) => ({
          original: elemento,
          traducido: await tAsync(elemento),
        }))
      );
      setItems(elementosTraducidos);
    };
    traducirElementos();
  }, []);

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.traducido}</li>
      ))}
    </ul>
  );
}
```

## Administración y Configuración

### Página de Administración

Accede a `/admin/auto-translate` para:

- **Configuración**: Seleccionar proveedor y configurar API keys
- **Proveedores**: Comparar opciones disponibles
- **Demostración**: Probar la funcionalidad
- **Ayuda**: Documentación completa
- Ver estadísticas del caché
- Exportar/importar traducciones
- Limpiar el caché
- Probar conectividad con proveedores

### Componentes de Administración

```typescript
import { AutoTranslateSettings } from "@/components/auto-translate-settings";
import { AutoTranslateDemo } from "@/components/auto-translate-demo";

function PaginaAdmin() {
  return (
    <div>
      <AutoTranslateSettings />
      <AutoTranslateDemo />
    </div>
  );
}
```

## API del Servicio

### AutoTranslateService

```typescript
// Configuración
autoTranslateService.updateConfig({
  enabled: boolean,
  provider: "libretranslate" | "mymemory" | "azure" | "google",
  apiKey: string, // Solo para Azure y Google
  libreTranslateUrl: string, // Solo para LibreTranslate
  azureRegion: string, // Solo para Azure
  fallbackLanguage: "es" | "en",
  cacheTranslations: boolean,
});

// Traducción
const traducido = await autoTranslateService.translateText(texto, idioma);

// Información de proveedores
const providers = autoTranslateService.getProvidersInfo();

// Probar proveedor
const testResult = await autoTranslateService.testProvider();

// Estadísticas
const stats = autoTranslateService.getCacheStats();

// Caché
autoTranslateService.clearCache();
const traducciones = autoTranslateService.exportTranslations();
autoTranslateService.importTranslations(traducciones);
```

## Fallback y Manejo de Errores

### Diccionario de Fallback

El sistema incluye un diccionario básico de traducciones comunes para casos donde no hay API key configurada:

- Error → Error
- Loading → Cargando
- Save → Guardar
- Cancel → Cancelar
- Delete → Eliminar
- Edit → Editar
- Create → Crear
- Update → Actualizar
- Submit → Enviar
- Close → Cerrar
- Open → Abrir
- Search → Buscar
- Filter → Filtrar
- Sort → Ordenar
- View → Ver
- Details → Detalles
- Settings → Configuración
- Profile → Perfil
- Logout → Cerrar sesión
- Login → Iniciar sesión
- Register → Registrar
- Password → Contraseña
- Email → Correo electrónico
- Name → Nombre
- Address → Dirección
- Phone → Teléfono
- Date → Fecha
- Time → Hora
- Status → Estado
- Type → Tipo
- Category → Categoría
- Description → Descripción
- Title → Título
- Content → Contenido
- Message → Mensaje
- Notification → Notificación
- Warning → Advertencia
- Success → Éxito
- Failed → Falló
- Required → Obligatorio
- Optional → Opcional
- Yes → Sí
- No → No
- True → Verdadero
- False → Falso

### Manejo de Errores

```typescript
try {
  const traducido = await tAsync("texto_nuevo");
  // Usar traducción
} catch (error) {
  console.warn("Error en traducción:", error);
  // Usar texto original o fallback
  const fallback = t("texto_nuevo"); // Devuelve 'texto_nuevo'
}
```

## Mejores Prácticas

### 1. Uso de tAsync vs t

- **Usa `t()`** para textos que ya están en el diccionario
- **Usa `tAsync()`** para textos nuevos que pueden necesitar traducción automática
- **Usa `useAutoTranslate`** para casos complejos con estados de carga

### 2. Manejo de Estados de Carga

```typescript
const { translate, isTranslating } = useAutoTranslate({
  showLoadingState: true,
});

return (
  <div>
    {isTranslating("texto") ? (
      <Loader2 className="animate-spin" />
    ) : (
      <span>{textoTraducido}</span>
    )}
  </div>
);
```

### 3. Optimización de Rendimiento

- Las traducciones se guardan en caché automáticamente
- Usa `translateMultiple` para traducir varios textos a la vez
- Evita traducir el mismo texto repetidamente

### 4. Configuración de Producción

```typescript
// En producción, considera deshabilitar la traducción automática
// y usar solo el diccionario estático para mejor rendimiento
autoTranslateService.updateConfig({
  enabled: process.env.NODE_ENV === "development",
});
```

## Solución de Problemas

### Problema: Las traducciones no se guardan

**Solución**: Verifica que localStorage esté disponible y no esté bloqueado por el navegador.

### Problema: Error de API key

**Solución**:

1. **Para LibreTranslate/MyMemory**: No requieren API key, verifica la configuración del proveedor
2. **Para Azure**: Verifica que la API key sea válida y la región correcta
3. **Para Google**: Verifica que la API key sea válida y la facturación esté habilitada
4. Usa la función "Probar Proveedor" en la configuración para diagnosticar problemas

### Problema: Traducciones lentas

**Solución**:

1. Verifica tu conexión a internet
2. Considera usar el caché local
3. Usa `translateMultiple` para traducir varios textos a la vez

### Problema: Textos no se traducen

**Solución**:

1. Verifica que la traducción automática esté habilitada
2. Revisa que el proveedor esté configurado correctamente
3. Usa la función "Probar Proveedor" para verificar conectividad
4. Revisa la consola para errores
5. Asegúrate de usar `tAsync()` en lugar de `t()`
6. Considera cambiar a LibreTranslate si otros proveedores fallan

## Contribución

Para agregar nuevas traducciones al diccionario de fallback:

1. Edita el archivo `my-app/lib/auto-translate.ts`
2. Agrega la traducción al objeto `commonTranslations`
3. Incluye tanto la versión en español como en inglés

```typescript
const commonTranslations: Record<string, { es: string; en: string }> = {
  // ... traducciones existentes
  "New Text": { es: "Nuevo Texto", en: "New Text" },
};
```

## Licencia

Este sistema de traducción automática es parte del proyecto EOIR y está sujeto a las mismas condiciones de licencia.
