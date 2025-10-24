'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/language-provider'
import { useAutoTranslate } from '@/lib/use-auto-translate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export function TranslationTest() {
  const { t, tAsync, autoTranslateEnabled } = useLanguage()
  const { translate, isTranslating } = useAutoTranslate({ showLoadingState: true })
  
  const [testResults, setTestResults] = useState<{
    text: string
    originalLang: string
    translated: string
    success: boolean
    time: number
  }[]>([])

  const [isRunningTests, setIsRunningTests] = useState(false)

  // Textos de prueba que simulan contenido real de casos
  const testCases = [
    {
      text: "The immigration judge has scheduled a hearing for this case",
      expectedLang: "es"
    },
    {
      text: "El juez de inmigración ha programado una audiencia para este caso",
      expectedLang: "en"
    },
    {
      text: "Motion to reopen case filed on January 15, 2024",
      expectedLang: "es"
    },
    {
      text: "Case status: Pending review by immigration court",
      expectedLang: "es"
    },
    {
      text: "Appeal received by Board of Immigration Appeals",
      expectedLang: "es"
    }
  ]

  const runTests = async () => {
    setIsRunningTests(true)
    setTestResults([])
    
    for (const testCase of testCases) {
      const startTime = performance.now()
      try {
        const translated = await translate(testCase.text)
        const endTime = performance.now()
        
        setTestResults(prev => [...prev, {
          text: testCase.text,
          originalLang: testCase.expectedLang === 'es' ? 'en' : 'es',
          translated,
          success: true,
          time: Math.round(endTime - startTime)
        }])
      } catch (error) {
        setTestResults(prev => [...prev, {
          text: testCase.text,
          originalLang: testCase.expectedLang === 'es' ? 'en' : 'es',
          translated: 'Error: ' + (error as Error).message,
          success: false,
          time: 0
        }])
      }
      
      // Pequeña pausa entre pruebas para no sobrecargar el servicio
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunningTests(false)
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Prueba del Sistema de Traducción</CardTitle>
          <CardDescription>
            Verifica el funcionamiento del sistema de traducción automática con casos reales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado del sistema */}
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              {autoTranslateEnabled ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Sistema de traducción: Activo
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  Sistema de traducción: Inactivo
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* Botón para iniciar pruebas */}
          <Button 
            onClick={runTests} 
            disabled={isRunningTests || !autoTranslateEnabled}
            className="w-full"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Ejecutando pruebas...
              </>
            ) : (
              'Iniciar Pruebas de Traducción'
            )}
          </Button>

          {/* Resultados */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Resultados de las Pruebas</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Texto Original ({result.originalLang}):</p>
                        <p className="text-sm">{result.text}</p>
                        <p className="font-medium mt-2">Traducción:</p>
                        <p className="text-sm">{result.translated}</p>
                      </div>
                      <div className="text-right">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {result.time > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.time}ms
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}