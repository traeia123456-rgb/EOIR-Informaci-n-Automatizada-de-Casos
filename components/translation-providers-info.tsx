/**
 * Componente que muestra información detallada sobre los proveedores de traducción
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Globe, 
  Zap, 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Info
} from 'lucide-react'

interface ProviderInfo {
  id: string
  name: string
  free: boolean
  requiresApiKey: boolean
  description: string
  limits: string
  pros: string[]
  cons: string[]
  setupUrl?: string
  setupInstructions?: string
}

const providersInfo: ProviderInfo[] = [
  {
    id: 'libretranslate',
    name: 'LibreTranslate',
    free: true,
    requiresApiKey: false,
    description: 'Servicio de traducción completamente gratuito y de código abierto',
    limits: 'Sin límites conocidos',
    pros: [
      'Completamente gratuito',
      'No requiere registro',
      'Código abierto',
      'Sin límites de uso',
      'Fácil de configurar'
    ],
    cons: [
      'Calidad de traducción variable',
      'Dependiente de servidores públicos',
      'Velocidad variable'
    ],
    setupUrl: 'https://libretranslate.de',
    setupInstructions: 'No requiere configuración adicional. Solo selecciona LibreTranslate como proveedor.'
  },
  {
    id: 'mymemory',
    name: 'MyMemory',
    free: true,
    requiresApiKey: false,
    description: 'API gratuita con límites de uso diario',
    limits: '1000 palabras por día sin registro',
    pros: [
      'Gratuito',
      'No requiere API key',
      'Buena calidad de traducción',
      'API simple'
    ],
    cons: [
      'Límite de 1000 palabras/día',
      'Requiere registro para más uso',
      'Dependiente del servicio'
    ],
    setupUrl: 'https://mymemory.translated.net',
    setupInstructions: 'No requiere configuración adicional. Solo selecciona MyMemory como proveedor.'
  },
  {
    id: 'azure',
    name: 'Azure Translator',
    free: true,
    requiresApiKey: true,
    description: 'Servicio de Microsoft con límites generosos',
    limits: '2 millones de caracteres por mes gratis',
    pros: [
      'Límites muy generosos',
      'Excelente calidad',
      'Servicio confiable',
      'API robusta',
      'Soporte empresarial'
    ],
    cons: [
      'Requiere registro en Azure',
      'Necesita API key',
      'Configuración más compleja'
    ],
    setupUrl: 'https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation',
    setupInstructions: '1. Crea una cuenta gratuita en Azure Portal\n2. Crea un recurso de Translator\n3. Copia la API key\n4. Configura la región'
  },
  {
    id: 'google',
    name: 'Google Translate',
    free: false,
    requiresApiKey: true,
    description: 'Servicio premium de Google',
    limits: 'Requiere facturación habilitada',
    pros: [
      'Mejor calidad de traducción',
      'Soporte para muchos idiomas',
      'API muy estable',
      'Documentación excelente'
    ],
    cons: [
      'Requiere facturación',
      'Costo por uso',
      'Configuración compleja',
      'Requiere tarjeta de crédito'
    ],
    setupUrl: 'https://console.cloud.google.com/apis/credentials',
    setupInstructions: '1. Crea un proyecto en Google Cloud\n2. Habilita la Translate API\n3. Crea una API key\n4. Habilita facturación'
  }
]

export function TranslationProvidersInfo() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const getProviderIcon = (provider: ProviderInfo) => {
    if (provider.free && !provider.requiresApiKey) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (provider.free && provider.requiresApiKey) {
      return <Shield className="h-5 w-5 text-blue-600" />
    } else {
      return <DollarSign className="h-5 w-5 text-orange-600" />
    }
  }

  const getProviderBadge = (provider: ProviderInfo) => {
    if (provider.free && !provider.requiresApiKey) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Completamente Gratuito</Badge>
    } else if (provider.free && provider.requiresApiKey) {
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Gratuito con Límites</Badge>
    } else {
      return <Badge variant="default" className="bg-orange-100 text-orange-800">Premium</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Proveedores de Traducción Disponibles
          </CardTitle>
          <CardDescription>
            Compara las diferentes opciones de traducción automática disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providersInfo.map((provider) => (
              <Card 
                key={provider.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProvider === provider.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProvider(selectedProvider === provider.id ? null : provider.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getProviderIcon(provider)}
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                    </div>
                    {getProviderBadge(provider)}
                  </div>
                  <CardDescription className="text-sm">
                    {provider.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Límites:</span>
                      <span className="font-medium">{provider.limits}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">API Key:</span>
                      <span className="font-medium">
                        {provider.requiresApiKey ? 'Requerida' : 'No requerida'}
                      </span>
                    </div>

                    {provider.setupUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(provider.setupUrl, '_blank')
                        }}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información detallada del proveedor seleccionado */}
      {selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Información Detallada: {providersInfo.find(p => p.id === selectedProvider)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const provider = providersInfo.find(p => p.id === selectedProvider)!
              return (
                <>
                  {/* Ventajas */}
                  <div>
                    <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Ventajas
                    </h4>
                    <ul className="space-y-1">
                      {provider.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Desventajas */}
                  <div>
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Consideraciones
                    </h4>
                    <ul className="space-y-1">
                      {provider.cons.map((con, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instrucciones de configuración */}
                  {provider.setupInstructions && (
                    <div>
                      <h4 className="font-medium mb-2">Instrucciones de Configuración</h4>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <pre className="whitespace-pre-wrap text-sm">
                            {provider.setupInstructions}
                          </pre>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Recomendación */}
                  <Alert className={provider.free && !provider.requiresApiKey ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recomendación:</strong>{' '}
                      {provider.id === 'libretranslate' && 'Perfecto para empezar. No requiere configuración y es completamente gratuito.'}
                      {provider.id === 'mymemory' && 'Buena opción para uso básico con límites razonables.'}
                      {provider.id === 'azure' && 'Excelente opción para uso profesional con límites generosos.'}
                      {provider.id === 'google' && 'La mejor calidad pero requiere configuración de facturación.'}
                    </AlertDescription>
                  </Alert>
                </>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
