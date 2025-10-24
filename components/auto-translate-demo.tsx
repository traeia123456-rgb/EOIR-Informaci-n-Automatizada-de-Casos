/**
 * Componente de ejemplo que demuestra el uso de traducción automática
 * Muestra cómo usar tanto la función t() tradicional como tAsync() para traducción automática
 */

'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { useAutoTranslate } from '@/lib/use-auto-translate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export function AutoTranslateDemo() {
  const { t, tAsync, autoTranslateEnabled } = useLanguage()
  const { translate, isTranslating } = useAutoTranslate({ showLoadingState: true })
  
  const [customText, setCustomText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslatingCustom, setIsTranslatingCustom] = useState(false)
  const [translationHistory, setTranslationHistory] = useState<Array<{original: string, translated: string, timestamp: Date}>>([])

  // Textos de ejemplo que no están en el diccionario
  const exampleTexts = [
    'Welcome to our system',
    'User dashboard',
    'Settings configuration',
    'Data processing',
    'System maintenance',
    'Error occurred',
    'Success message',
    'Loading content',
    'Save changes',
    'Delete item'
  ]

  const handleTranslateCustom = async () => {
    if (!customText.trim()) return

    setIsTranslatingCustom(true)
    try {
      const translated = await translate(customText)
      setTranslatedText(translated)
      
      // Agregar a historial
      setTranslationHistory(prev => [
        { original: customText, translated, timestamp: new Date() },
        ...prev.slice(0, 9) // Mantener solo los últimos 10
      ])
    } catch (error) {
      console.error('Error traduciendo:', error)
    } finally {
      setIsTranslatingCustom(false)
    }
  }

  const handleTranslateExample = async (text: string) => {
    try {
      const translated = await translate(text)
      setTranslationHistory(prev => [
        { original: text, translated, timestamp: new Date() },
        ...prev.slice(0, 9)
      ])
    } catch (error) {
      console.error('Error traduciendo:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demostración de Traducción Automática</CardTitle>
          <CardDescription>
            Prueba la traducción automática con textos que no están en el diccionario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado de la traducción automática */}
          <Alert>
            {autoTranslateEnabled ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Traducción automática habilitada. Los textos nuevos se traducirán automáticamente.
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Traducción automática deshabilitada. Solo se mostrarán textos del diccionario.
                </AlertDescription>
              </>
            )}
          </Alert>

          {/* Traducción personalizada */}
          <div className="space-y-2">
            <Label htmlFor="custom-text">Texto personalizado para traducir</Label>
            <div className="flex gap-2">
              <Input
                id="custom-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Escribe un texto en inglés para traducir..."
                className="flex-1"
              />
              <Button 
                onClick={handleTranslateCustom}
                disabled={!customText.trim() || isTranslatingCustom}
              >
                {isTranslatingCustom ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Traducir'
                )}
              </Button>
            </div>
            {translatedText && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Traducción:</p>
                <p className="text-sm">{translatedText}</p>
              </div>
            )}
          </div>

          {/* Textos de ejemplo */}
          <div className="space-y-2">
            <Label>Textos de ejemplo (haz clic para traducir)</Label>
            <div className="grid grid-cols-2 gap-2">
              {exampleTexts.map((text, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTranslateExample(text)}
                  disabled={isTranslating(text)}
                  className="justify-start"
                >
                  {isTranslating(text) ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : null}
                  {text}
                </Button>
              ))}
            </div>
          </div>

          {/* Historial de traducciones */}
          {translationHistory.length > 0 && (
            <div className="space-y-2">
              <Label>Historial de traducciones</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {translationHistory.map((item, index) => (
                  <div key={index} className="p-2 border rounded-md text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.original}</p>
                        <p className="text-muted-foreground">{item.translated}</p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparación de métodos */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Métodos de Traducción</CardTitle>
          <CardDescription>
            Diferencia entre traducción síncrona (t) y asíncrona (tAsync)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Método Síncrono (t)</h4>
              <div className="p-3 bg-muted rounded-md text-sm">
                <p><strong>Texto existente:</strong> {t('search')}</p>
                <p><strong>Texto faltante:</strong> {t('nonexistent_text')}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Devuelve inmediatamente el texto del diccionario o la clave original
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Método Asíncrono (tAsync)</h4>
              <div className="p-3 bg-muted rounded-md text-sm">
                <p><strong>Texto existente:</strong> {t('search')}</p>
                <p><strong>Texto faltante:</strong> {autoTranslateEnabled ? 'Se traduciría automáticamente' : 'No se traduciría'}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Puede traducir automáticamente textos faltantes si está habilitado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
