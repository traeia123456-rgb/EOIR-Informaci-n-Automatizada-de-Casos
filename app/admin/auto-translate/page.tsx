/**
 * Página de administración para gestionar traducciones automáticas
 * Permite configurar, exportar, importar y gestionar las traducciones automáticas
 */

'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { AutoTranslateSettings } from '@/components/auto-translate-settings'
import { AutoTranslateDemo } from '@/components/auto-translate-demo'
import { TranslationProvidersInfo } from '@/components/translation-providers-info'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Settings, Play, BarChart3, Info, Globe } from 'lucide-react'

export default function AutoTranslateAdminPage() {
  const { autoTranslateEnabled, getAutoTranslateStats } = useLanguage()
  const [stats, setStats] = useState<{ size: number; keys: string[] }>({ size: 0, keys: [] })
  const [hasApiKey, setHasApiKey] = useState(false)

  useEffect(() => {
    setStats(getAutoTranslateStats())
    if (typeof window !== 'undefined') {
      setHasApiKey(!!localStorage.getItem('google-translate-api-key'))
    }
  }, [getAutoTranslateStats])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Administración de Traducción Automática</h1>
        <p className="text-muted-foreground">
          Gestiona las traducciones automáticas y configura el sistema de traducción
        </p>
      </div>

      {/* Estado general */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.size}</div>
              <div className="text-sm text-muted-foreground">Traducciones guardadas</div>
            </div>
            <div className="text-center">
              <Badge variant={autoTranslateEnabled ? "default" : "secondary"}>
                {autoTranslateEnabled ? "Habilitado" : "Deshabilitado"}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Estado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {hasApiKey ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">API Key configurada</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información importante */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Información importante:</strong> La traducción automática funciona detectando textos que no están en el diccionario estático y los traduce automáticamente usando múltiples proveedores (LibreTranslate, MyMemory, Azure Translator, Google Translate). Las traducciones se guardan en caché para evitar llamadas repetidas a la API.
        </AlertDescription>
      </Alert>

      {/* Pestañas principales */}
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Demostración
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Ayuda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <AutoTranslateSettings />
        </TabsContent>

        <TabsContent value="providers">
          <TranslationProvidersInfo />
        </TabsContent>

        <TabsContent value="demo">
          <AutoTranslateDemo />
        </TabsContent>

        <TabsContent value="help">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>¿Cómo funciona la traducción automática?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Detección automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Cuando se usa la función <code>t()</code> o <code>tAsync()</code> con una clave que no existe en el diccionario, el sistema detecta automáticamente que necesita traducción.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">2. Traducción automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Si la traducción automática está habilitada, el sistema usa Google Translate API para traducir el texto automáticamente.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">3. Caché inteligente</h4>
                  <p className="text-sm text-muted-foreground">
                    Las traducciones se guardan en caché para evitar llamadas repetidas a la API y mejorar el rendimiento.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">4. Fallback básico</h4>
                  <p className="text-sm text-muted-foreground">
                    Si no hay API key configurada, se usa un diccionario básico de traducciones comunes como fallback.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso en componentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Método tradicional (síncrono)</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`const { t } = useLanguage()
const text = t('existing_key') // Devuelve traducción del diccionario
const missing = t('missing_key') // Devuelve 'missing_key'`}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Método con traducción automática (asíncrono)</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`const { tAsync } = useLanguage()
const text = await tAsync('existing_key') // Devuelve traducción del diccionario
const missing = await tAsync('missing_key') // Traduce automáticamente`}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Hook personalizado</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`const { translate, isTranslating } = useAutoTranslate()
const text = await translate('missing_key')
const loading = isTranslating('missing_key')`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Proveedores de Traducción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* LibreTranslate */}
                <div className="space-y-2">
                  <h4 className="font-medium text-green-800">LibreTranslate (Recomendado para empezar)</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Ventajas:</strong> Completamente gratuito, no requiere API key, fácil configuración
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Configuración:</strong> Solo selecciona LibreTranslate como proveedor. No se requiere configuración adicional.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>URL por defecto:</strong> https://libretranslate.de
                  </p>
                </div>

                {/* MyMemory */}
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">MyMemory</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Ventajas:</strong> Gratuito, buena calidad, no requiere API key
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Límites:</strong> 1000 palabras por día sin registro
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Configuración:</strong> Solo selecciona MyMemory como proveedor.
                  </p>
                </div>

                {/* Azure Translator */}
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Azure Translator</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Ventajas:</strong> Excelente calidad, límites generosos (2M caracteres/mes gratis)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Configuración:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground ml-4 space-y-1">
                    <li>1. Crea una cuenta gratuita en <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Azure Portal</a></li>
                    <li>2. Crea un recurso de Translator</li>
                    <li>3. Copia la API key</li>
                    <li>4. Configura la región (generalmente &quot;global&quot;)</li>
                  </ol>
                </div>

                {/* Google Translate */}
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800">Google Translate</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Ventajas:</strong> Mejor calidad de traducción, muy estable
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Desventajas:</strong> Requiere facturación habilitada, costo por uso
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Configuración:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground ml-4 space-y-1">
                    <li>1. Crea un proyecto en <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                    <li>2. Habilita la Google Translate API</li>
                    <li>3. Crea una API key</li>
                    <li>4. Habilita facturación (requerido)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
