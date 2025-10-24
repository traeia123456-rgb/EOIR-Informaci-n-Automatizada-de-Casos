/**
 * Servicio de traducción automática
 * Detecta textos faltantes y los traduce automáticamente usando Google Translate API
 */

export interface TranslationResult {
  translatedText: string
  detectedSourceLanguage: string
}

export interface AutoTranslateConfig {
  enabled: boolean
  provider: 'libretranslate' | 'mymemory' | 'azure' | 'google'
  apiKey?: string
  fallbackLanguage: 'es' | 'en'
  cacheTranslations: boolean
  libreTranslateUrl?: string
  azureRegion?: string
}

class AutoTranslateService {
  private config: AutoTranslateConfig = {
    enabled: true,
    provider: 'mymemory', // Cambiado a MyMemory como proveedor predeterminado
    fallbackLanguage: 'es',
    cacheTranslations: true,
    libreTranslateUrl: 'https://libretranslate.de'
  }

  private readonly LIBRETRANSLATE_URLS = [
    'https://libretranslate.de',
    'https://translate.argosopentech.com',
    'https://translate.fortytwo-it.com',
    'https://translate.terraprint.co'
  ];

  private translationCache = new Map<string, string>();
  private failedUrls = new Set<string>();

  constructor(config?: Partial<AutoTranslateConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
    this.loadCache()
  }

  /**
   * Traduce un texto usando el proveedor configurado
   */
  async translateText(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    // Verificar si ya tenemos la traducción en caché
    const cacheKey = `${text}_${targetLanguage}`
    if (this.config.cacheTranslations && this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!
    }

    // Si no está habilitado, devolver el texto original
    if (!this.config.enabled) {
      return text
    }

    // Si el texto es muy corto o parece ser un código/número, no traducir
    if (text.length < 3 || /^\d+$/.test(text) || /^[A-Z]{2,3}$/.test(text)) {
      return text
    }

    try {
      let translatedText: string

      // Usar el proveedor configurado con timeout
      const translationPromise = this.callTranslationProvider(text, targetLanguage)
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Translation timeout')), 5000)
      )

      translatedText = await Promise.race([translationPromise, timeoutPromise])

      // Guardar en caché
      if (this.config.cacheTranslations) {
        this.translationCache.set(cacheKey, translatedText)
        this.saveCache()
      }

      return translatedText
    } catch (error) {
      console.warn('Error en traducción automática:', error)
      // Fallback: usar traducción básica o devolver texto original
      return this.fallbackTranslation(text, targetLanguage)
    }
  }

  /**
   * Llama al proveedor de traducción configurado
   */
  private async callTranslationProvider(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    switch (this.config.provider) {
      case 'libretranslate':
        return await this.translateWithLibreTranslate(text, targetLanguage)
      case 'mymemory':
        return await this.translateWithMyMemory(text, targetLanguage)
      case 'azure':
        return await this.translateWithAzure(text, targetLanguage)
      case 'google':
        return await this.translateWithGoogleAPI(text, targetLanguage)
      default:
        throw new Error(`Proveedor no soportado: ${this.config.provider}`)
    }
  }


  private async detectLanguage(text: string): Promise<'es' | 'en' | null> {
    const libreTranslateUrl = this.config.libreTranslateUrl || 'https://libretranslate.de';
    
    try {
      // Primero intentamos detectar usando patrones comunes
      if (this.containsSpanishPatterns(text)) {
        return 'es';
      }
      if (this.containsEnglishPatterns(text)) {
        return 'en';
      }
  
      // Si no podemos detectar por patrones, usamos la API
      const response = await fetch(`${libreTranslateUrl}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          api_key: this.config.apiKey || ''
        })
      });
  
      if (!response.ok) {
        console.warn('Error en detección de idioma, usando detección por patrones como respaldo');
        return this.detectLanguageByPatterns(text);
      }
  
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const detection = data[0];
        if (detection && (detection.language === 'es' || detection.language === 'en')) {
          return detection.language;
        }
      }
      
      // Si la API falla, usamos detección por patrones como respaldo
      return this.detectLanguageByPatterns(text);
    } catch (error) {
      console.warn('Error en detección de idioma, usando detección por patrones:', error);
      return this.detectLanguageByPatterns(text);
    }
  }

  private containsSpanishPatterns(text: string): boolean {
    const spanishPatterns = [
      /[áéíóúüñ¿¡]/i,
      /\b(el|la|los|las|un|una|unos|unas)\b/i,
      /\b(está|están|estás)\b/i,
      /\b(ordenó|expulsión|inmigración|juez)\b/i,
      /\b(tribunal|audiencia|fallo|pedimento)\b/i,
      /\b(próxima|última|decisión|fecha)\b/i,
      /\b(dirección|teléfono|número|registro)\b/i
    ];
    return spanishPatterns.some(pattern => pattern.test(text));
  }

  private containsEnglishPatterns(text: string): boolean {
    const englishPatterns = [
      /\b(the|a|an|of|in|on|at)\b/i,
      /\b(is|are|was|were)\b/i,
      /\b(judge|court|hearing|decision)\b/i,
      /\b(ordered|deportation|immigration)\b/i,
      /\b(next|last|date|address)\b/i,
      /\b(phone|number|registration)\b/i,
      /\b(motions|judicial|decisions)\b/i
    ];
    return englishPatterns.some(pattern => pattern.test(text));
  }

  private detectLanguageByPatterns(text: string): 'es' | 'en' | null {
    const spanishScore = this.containsSpanishPatterns(text) ? 1 : 0;
    const englishScore = this.containsEnglishPatterns(text) ? 1 : 0;

    if (spanishScore > englishScore) return 'es';
    if (englishScore > spanishScore) return 'en';
    return null;
  }

  private async translateWithLibreTranslate(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    // No traducir si el texto está en la lista de excepciones o contiene alguna palabra de la lista
    const words = text.split(/\s+/);
    if (words.some(word => DO_NOT_TRANSLATE.includes(word.toUpperCase()))) {
      return text;
    }

    // Detectar el idioma del texto usando patrones primero
    const detectedLanguage = this.detectLanguageByPatterns(text);
    
    // Si ya está en el idioma objetivo, devolver el texto original
    if (detectedLanguage === targetLanguage) {
      return text;
    }

    // Si no pudimos detectar el idioma por patrones, intentar con la API
    if (!detectedLanguage) {
      try {
        const apiDetectedLang = await this.detectLanguage(text);
        if (apiDetectedLang === targetLanguage) {
          return text;
        }
      } catch (error) {
        console.warn('Error en detección de idioma:', error);
        // Si falla la detección, intentamos traducir de todos modos
      }
    }

    // Intentar cada URL disponible hasta que una funcione
    for (const url of this.LIBRETRANSLATE_URLS) {
      if (this.failedUrls.has(url)) {
        continue; // Saltar URLs que ya han fallado
      }

      try {
        const response = await fetch(`${url}/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: detectedLanguage || 'auto',
            target: targetLanguage,
            format: 'text',
            api_key: this.config.apiKey || ''
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.translatedText) {
          return data.translatedText;
        }
      } catch (error) {
        console.warn(`Error con ${url}:`, error);
        this.failedUrls.add(url);
        continue;
      }
    }

    // Si todas las URLs de LibreTranslate fallaron, intentar con MyMemory como respaldo
    try {
      return await this.translateWithMyMemory(text, targetLanguage);
    } catch (error) {
      console.error('Error en traducción de respaldo:', error);
      return text; // Si todo falla, devolver el texto original
    }
  }

  private async translateWithMyMemory(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    // No traducir si el texto está en la lista de excepciones o contiene alguna palabra de la lista
    const words = text.split(/\s+/);
    if (words.some(word => DO_NOT_TRANSLATE.includes(word.toUpperCase()))) {
      return text;
    }

    // Detectar el idioma usando patrones
    const detectedLanguage = this.detectLanguageByPatterns(text);
    
    // Si ya está en el idioma objetivo, devolver el texto original
    if (detectedLanguage === targetLanguage) {
      return text;
    }

    const sourceLanguage = detectedLanguage || (targetLanguage === 'es' ? 'en' : 'es');
    const langPair = `${sourceLanguage}|${targetLanguage}`;
    
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`,
        { signal: AbortSignal.timeout(5000) } // Timeout de 5 segundos
      );

      if (!response.ok) {
        throw new Error(`Error en MyMemory API: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      }
      
      throw new Error(`Error en MyMemory API: ${data.responseDetails}`);
    } catch (error) {
      console.error('Error en MyMemory:', error);
      return text; // Si falla, devolver el texto original
    }
  }

  /**
   * Traduce usando Azure Translator (Gratuita con límites generosos)
   */
  private async translateWithAzure(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Azure API Key no configurada')
    }

    const sourceLanguage = targetLanguage === 'es' ? 'en' : 'es'
    const region = this.config.azureRegion || 'global'
    
    const response = await fetch(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLanguage}&to=${targetLanguage}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.apiKey,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }])
    })

    if (!response.ok) {
      throw new Error(`Error en Azure Translator API: ${response.statusText}`)
    }

    const data = await response.json()
    return data[0].translations[0].text
  }

  /**
   * Traduce usando Google Translate API
   */
  private async translateWithGoogleAPI(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Google API Key no configurada')
    }

    const sourceLanguage = targetLanguage === 'es' ? 'en' : 'es'
    
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error(`Error en Google Translate API: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data.translations[0].translatedText
  }

  /**
   * Traducción básica de fallback para casos comunes
   */
  private fallbackTranslation(text: string, targetLanguage: 'es' | 'en'): string {
    const commonTranslations: Record<string, { es: string; en: string }> = {
      'Error': { es: 'Error', en: 'Error' },
      'Loading': { es: 'Cargando', en: 'Loading' },
      'Save': { es: 'Guardar', en: 'Save' },
      'Cancel': { es: 'Cancelar', en: 'Cancel' },
      'Delete': { es: 'Eliminar', en: 'Delete' },
      'Edit': { es: 'Editar', en: 'Edit' },
      'Create': { es: 'Crear', en: 'Create' },
      'Update': { es: 'Actualizar', en: 'Update' },
      'Submit': { es: 'Enviar', en: 'Submit' },
      'Close': { es: 'Cerrar', en: 'Close' },
      'Open': { es: 'Abrir', en: 'Open' },
      'Search': { es: 'Buscar', en: 'Search' },
      'Filter': { es: 'Filtrar', en: 'Filter' },
      'Sort': { es: 'Ordenar', en: 'Sort' },
      'View': { es: 'Ver', en: 'View' },
      'Details': { es: 'Detalles', en: 'Details' },
      'Settings': { es: 'Configuración', en: 'Settings' },
      'Profile': { es: 'Perfil', en: 'Profile' },
      'Logout': { es: 'Cerrar sesión', en: 'Logout' },
      'Login': { es: 'Iniciar sesión', en: 'Login' },
      'Register': { es: 'Registrar', en: 'Register' },
      'Password': { es: 'Contraseña', en: 'Password' },
      'Email': { es: 'Correo electrónico', en: 'Email' },
      'Name': { es: 'Nombre', en: 'Name' },
      'Address': { es: 'Dirección', en: 'Address' },
      'Phone': { es: 'Teléfono', en: 'Phone' },
      'Date': { es: 'Fecha', en: 'Date' },
      'Time': { es: 'Hora', en: 'Time' },
      'Status': { es: 'Estado', en: 'Status' },
      'Type': { es: 'Tipo', en: 'Type' },
      'Category': { es: 'Categoría', en: 'Category' },
      'Description': { es: 'Descripción', en: 'Description' },
      'Title': { es: 'Título', en: 'Title' },
      'Content': { es: 'Contenido', en: 'Content' },
      'Message': { es: 'Mensaje', en: 'Message' },
      'Notification': { es: 'Notificación', en: 'Notification' },
      'Warning': { es: 'Advertencia', en: 'Warning' },
      'Success': { es: 'Éxito', en: 'Success' },
      'Failed': { es: 'Falló', en: 'Failed' },
      'Required': { es: 'Obligatorio', en: 'Required' },
      'Optional': { es: 'Opcional', en: 'Optional' },
      'Yes': { es: 'Sí', en: 'Yes' },
      'No': { es: 'No', en: 'No' },
      'True': { es: 'Verdadero', en: 'True' },
      'False': { es: 'Falso', en: 'False' }
    }

    // Buscar traducción común
    const commonTranslation = commonTranslations[text]
    if (commonTranslation) {
      return commonTranslation[targetLanguage]
    }

    // Si no hay traducción común, devolver el texto original
    return text
  }

  /**
   * Cargar caché desde localStorage
   */
  private loadCache(): void {
    if (typeof window === 'undefined') return

    try {
      const cached = localStorage.getItem('auto-translate-cache')
      if (cached) {
        const cacheData = JSON.parse(cached)
        this.translationCache = new Map(Object.entries(cacheData))
      }
    } catch (error) {
      console.warn('Error cargando caché de traducciones:', error)
    }
  }

  /**
   * Guardar caché en localStorage
   */
  private saveCache(): void {
    if (typeof window === 'undefined') return

    try {
      const cacheData = Object.fromEntries(this.translationCache)
      localStorage.setItem('auto-translate-cache', JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Error guardando caché de traducciones:', error)
    }
  }

  /**
   * Limpiar caché
   */
  clearCache(): void {
    this.translationCache.clear()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auto-translate-cache')
    }
  }

  /**
   * Obtener estadísticas del caché
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.translationCache.size,
      keys: Array.from(this.translationCache.keys())
    }
  }

  /**
   * Exportar diccionario de traducciones automáticas
   */
  exportTranslations(): Record<string, { es: string; en: string }> {
    const translations: Record<string, { es: string; en: string }> = {}

    Array.from(this.translationCache.entries()).forEach(([key, translation]) => {
      const [originalText, language] = key.split('_')
      if (!translations[originalText]) {
        translations[originalText] = { es: '', en: '' }
      }
      translations[originalText][language as 'es' | 'en'] = translation
    })

    return translations
  }

  /**
   * Importar diccionario de traducciones
   */
  importTranslations(translations: Record<string, { es: string; en: string }>): void {
    for (const [originalText, translationsByLang] of Object.entries(translations)) {
      if (translationsByLang.es) {
        this.translationCache.set(`${originalText}_es`, translationsByLang.es)
      }
      if (translationsByLang.en) {
        this.translationCache.set(`${originalText}_en`, translationsByLang.en)
      }
    }
    this.saveCache()
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig: Partial<AutoTranslateConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Obtener configuración actual
   */
  getConfig(): AutoTranslateConfig {
    return { ...this.config }
  }

  /**
   * Obtener información sobre los proveedores disponibles
   */
  getProvidersInfo(): Record<string, { name: string; free: boolean; requiresApiKey: boolean; description: string; limits?: string }> {
    return {
      libretranslate: {
        name: 'LibreTranslate',
        free: true,
        requiresApiKey: false,
        description: 'API completamente gratuita y de código abierto',
        limits: 'Sin límites conocidos'
      },
      mymemory: {
        name: 'MyMemory',
        free: true,
        requiresApiKey: false,
        description: 'API gratuita con límites de uso',
        limits: '1000 palabras/día sin registro'
      },
      azure: {
        name: 'Azure Translator',
        free: true,
        requiresApiKey: true,
        description: 'Servicio de Microsoft con límites generosos',
        limits: '2M caracteres/mes gratis'
      },
      google: {
        name: 'Google Translate',
        free: false,
        requiresApiKey: true,
        description: 'Servicio premium de Google',
        limits: 'Requiere facturación habilitada'
      }
    }
  }

  /**
   * Probar conectividad con el proveedor actual
   */
  async testProvider(): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const testText = 'Hello'
    const startTime = Date.now()
    
    try {
      const translated = await this.translateText(testText, 'es')
      const responseTime = Date.now() - startTime
      
      return {
        success: true,
        message: `Traducción exitosa: "${testText}" → "${translated}"`,
        responseTime
      }
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
      }
    }
  }
}

// Instancia singleton del servicio
export const autoTranslateService = new AutoTranslateService()

// Función helper para usar en componentes
export async function translateMissingText(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
  return await autoTranslateService.translateText(text, targetLanguage)
}

// Lista de textos que no deben ser traducidos
const DO_NOT_TRANSLATE = [
// Códigos de país
'CO', 'US', 'MX', 'ES', 'AR', 'BR', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY',
// Otros términos técnicos que no deben traducirse
'ID', 'URL', 'API', 'HTML', 'CSS', 'JSON'
];
