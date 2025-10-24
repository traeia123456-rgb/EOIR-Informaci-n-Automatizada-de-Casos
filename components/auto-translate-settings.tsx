/**
 * Componente de configuración para traducción automática
 * Permite al usuario configurar las opciones de traducción automática
 */

'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Upload, Trash2, Settings, Info, Play, CheckCircle, XCircle } from 'lucide-react'

export function AutoTranslateSettings() {
  const { 
    autoTranslateEnabled, 
    setAutoTranslateEnabled, 
    getAutoTranslateStats, 
    clearAutoTranslateCache,
    exportAutoTranslations,
    importAutoTranslations
  } = useLanguage()

  const [apiKey, setApiKey] = useState('')
  const [stats, setStats] = useState<{ size: number; keys: string[] }>({ size: 0, keys: [] })
  const [showApiKey, setShowApiKey] = useState(false)
  const [provider, setProvider] = useState<'libretranslate' | 'mymemory' | 'azure' | 'google'>('libretranslate')
  const [libreTranslateUrl, setLibreTranslateUrl] = useState('https://libretranslate.de')
  const [azureRegion, setAzureRegion] = useState('global')
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; responseTime?: number } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    // Cargar configuración desde localStorage
    const savedApiKey = localStorage.getItem('translate-api-key')
    const savedProvider = localStorage.getItem('translate-provider') as 'libretranslate' | 'mymemory' | 'azure' | 'google' | null
    const savedLibreUrl = localStorage.getItem('libretranslate-url')
    const savedAzureRegion = localStorage.getItem('azure-region')
    
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
    if (savedProvider) {
      setProvider(savedProvider)
    }
    if (savedLibreUrl) {
      setLibreTranslateUrl(savedLibreUrl)
    }
    if (savedAzureRegion) {
      setAzureRegion(savedAzureRegion)
    }

    // Cargar estadísticas
    setStats(getAutoTranslateStats())
  }, [getAutoTranslateStats])

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    localStorage.setItem('translate-api-key', value)
  }

  const handleProviderChange = (newProvider: 'libretranslate' | 'mymemory' | 'azure' | 'google') => {
    setProvider(newProvider)
    localStorage.setItem('translate-provider', newProvider)
  }

  const handleLibreUrlChange = (value: string) => {
    setLibreTranslateUrl(value)
    localStorage.setItem('libretranslate-url', value)
  }

  const handleAzureRegionChange = (value: string) => {
    setAzureRegion(value)
    localStorage.setItem('azure-region', value)
  }

  const handleTestProvider = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      // Actualizar configuración temporalmente para la prueba
      const { autoTranslateService } = await import('@/lib/auto-translate')
      autoTranslateService.updateConfig({
        provider,
        apiKey: apiKey || undefined,
        libreTranslateUrl: libreTranslateUrl || undefined,
        azureRegion: azureRegion || undefined
      })
      
      const result = await autoTranslateService.testProvider()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleExportTranslations = () => {
    const translations = exportAutoTranslations()
    const dataStr = JSON.stringify(translations, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'auto-translations.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportTranslations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const translations = JSON.parse(e.target?.result as string)
        importAutoTranslations(translations)
        setStats(getAutoTranslateStats())
        alert('Traducciones importadas exitosamente')
      } catch (error) {
        alert('Error al importar las traducciones')
      }
    }
    reader.readAsText(file)
  }

  const handleClearCache = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el caché de traducciones?')) {
      clearAutoTranslateCache()
      setStats(getAutoTranslateStats())
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuración de Traducción Automática
        </CardTitle>
        <CardDescription>
          Configura las opciones para la traducción automática de textos faltantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado general */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-translate-enabled">Traducción Automática</Label>
            <p className="text-sm text-muted-foreground">
              Traduce automáticamente textos que no están en el diccionario
            </p>
          </div>
          <Switch
            id="auto-translate-enabled"
            checked={autoTranslateEnabled}
            onCheckedChange={setAutoTranslateEnabled}
          />
        </div>

        {/* Selección de Proveedor */}
        <div className="space-y-2">
          <Label htmlFor="provider">Proveedor de Traducción</Label>
          <Select value={provider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="libretranslate">
                <div className="flex flex-col">
                  <span className="font-medium">LibreTranslate</span>
                  <span className="text-xs text-muted-foreground">Completamente gratuito</span>
                </div>
              </SelectItem>
              <SelectItem value="mymemory">
                <div className="flex flex-col">
                  <span className="font-medium">MyMemory</span>
                  <span className="text-xs text-muted-foreground">Gratuito con límites</span>
                </div>
              </SelectItem>
              <SelectItem value="azure">
                <div className="flex flex-col">
                  <span className="font-medium">Azure Translator</span>
                  <span className="text-xs text-muted-foreground">Gratuito con límites generosos</span>
                </div>
              </SelectItem>
              <SelectItem value="google">
                <div className="flex flex-col">
                  <span className="font-medium">Google Translate</span>
                  <span className="text-xs text-muted-foreground">Requiere facturación</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Configuración específica del proveedor */}
        {provider === 'libretranslate' && (
          <div className="space-y-2">
            <Label htmlFor="libre-url">URL del Servidor LibreTranslate</Label>
            <Input
              id="libre-url"
              value={libreTranslateUrl}
              onChange={(e) => handleLibreUrlChange(e.target.value)}
              placeholder="https://libretranslate.de"
            />
            <p className="text-xs text-muted-foreground">
              Puedes usar servidores públicos o tu propia instancia
            </p>
          </div>
        )}

        {provider === 'azure' && (
          <div className="space-y-2">
            <Label htmlFor="azure-region">Región de Azure</Label>
            <Input
              id="azure-region"
              value={azureRegion}
              onChange={(e) => handleAzureRegionChange(e.target.value)}
              placeholder="global"
            />
            <p className="text-xs text-muted-foreground">
              Región donde está configurado tu recurso de Azure Translator
            </p>
          </div>
        )}

        {/* API Key (para Azure y Google) */}
        {(provider === 'azure' || provider === 'google') && (
          <div className="space-y-2">
            <Label htmlFor="api-key">
              {provider === 'azure' ? 'Azure API Key' : 'Google Translate API Key'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={
                  provider === 'azure' 
                    ? 'Ingresa tu Azure API Key' 
                    : 'Ingresa tu Google API Key'
                }
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {provider === 'azure' ? (
                <>
                  Obtén tu API key gratuita en{' '}
                  <a 
                    href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Azure Portal
                  </a>
                </>
              ) : (
                <>
                  Obtén tu API key en{' '}
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </>
              )}
            </p>
          </div>
        )}

        {/* Prueba del proveedor */}
        <div className="space-y-2">
          <Label>Probar Conexión</Label>
          <Button
            variant="outline"
            onClick={handleTestProvider}
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <Play className="h-4 w-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Probar Proveedor
              </>
            )}
          </Button>
          
          {testResult && (
            <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                {testResult.message}
                {testResult.responseTime && (
                  <span className="block text-xs mt-1">
                    Tiempo de respuesta: {testResult.responseTime}ms
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Estadísticas */}
        <div className="space-y-2">
          <Label>Estadísticas del Caché</Label>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Traducciones guardadas: <strong>{stats.size}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStats(getAutoTranslateStats())}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Alertas informativas */}
        {provider === 'libretranslate' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>LibreTranslate:</strong> Servicio completamente gratuito y de código abierto. No requiere API key.
            </AlertDescription>
          </Alert>
        )}

        {provider === 'mymemory' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>MyMemory:</strong> Servicio gratuito con límite de 1000 palabras por día sin registro.
            </AlertDescription>
          </Alert>
        )}

        {provider === 'azure' && !apiKey && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Azure Translator:</strong> Requiere API key gratuita. Incluye 2 millones de caracteres por mes gratis.
            </AlertDescription>
          </Alert>
        )}

        {provider === 'azure' && apiKey && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Azure Translator:</strong> Configurado correctamente. Incluye 2 millones de caracteres por mes gratis.
            </AlertDescription>
          </Alert>
        )}

        {provider === 'google' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Google Translate:</strong> Servicio premium que requiere facturación habilitada en Google Cloud.
            </AlertDescription>
          </Alert>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportTranslations}
            disabled={stats.size === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Traducciones
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Traducciones
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            disabled={stats.size === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Caché
          </Button>
        </div>

        <input
          id="import-file"
          type="file"
          accept=".json"
          onChange={handleImportTranslations}
          className="hidden"
        />

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Las traducciones se guardan automáticamente en el navegador</p>
          <p>• Puedes exportar/importar traducciones entre dispositivos</p>
          <p>• La traducción automática funciona solo cuando está habilitada</p>
        </div>
      </CardContent>
    </Card>
  )
}
