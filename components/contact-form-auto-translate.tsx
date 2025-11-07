/**
 * Componente de ejemplo que demuestra el uso práctico de traducción automática
 * Muestra cómo integrar la traducción automática en un formulario real
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '@/components/language-provider'
import { useAutoTranslate } from '@/lib/use-auto-translate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  priority: string
  category: string
}

export function ContactFormWithAutoTranslate() {
  const { t, tAsync, autoTranslateEnabled } = useLanguage()
  const { translate, isTranslating } = useAutoTranslate({ showLoadingState: true })
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    priority: '',
    category: ''
  })
  
  const [translatedLabels, setTranslatedLabels] = useState<Record<string, string>>({})
  const [isTranslatingLabels, setIsTranslatingLabels] = useState(false)

  // Textos que no están en el diccionario y necesitan traducción automática
  const dynamicLabels = useMemo(() => ({
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    message: 'Your Message',
    priority: 'Priority Level',
    category: 'Category',
    submit: 'Submit Form',
    reset: 'Reset Form',
    success: 'Form submitted successfully!',
    error: 'Please fill in all required fields',
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
    general: 'General Inquiry',
    support: 'Technical Support',
    billing: 'Billing Question',
    feedback: 'Feedback'
  }), [])

  // Traducir todas las etiquetas dinámicas
  useEffect(() => {
    const translateLabels = async () => {
      setIsTranslatingLabels(true)
      const translations: Record<string, string> = {}
      
      for (const [key, englishText] of Object.entries(dynamicLabels)) {
        try {
          const translated = await translate(englishText)
          translations[key] = translated
        } catch (error) {
          console.warn(`Error traduciendo "${englishText}":`, error)
          translations[key] = englishText
        }
      }
      
      setTranslatedLabels(translations)
      setIsTranslatingLabels(false)
    }

    if (autoTranslateEnabled) {
      translateLabels()
    } else {
      // Si no está habilitada, usar los textos en inglés
      setTranslatedLabels(dynamicLabels)
    }
  }, [autoTranslateEnabled, translate, dynamicLabels])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simular envío del formulario
    const successMessage = await translate(dynamicLabels.success)
    alert(successMessage)
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      priority: '',
      category: ''
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Contacto con Traducción Automática</CardTitle>
          <CardDescription>
            Este formulario demuestra cómo usar la traducción automática en un caso real
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Estado de traducción */}
          <Alert className="mb-6">
            {isTranslatingLabels ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Traduciendo etiquetas del formulario...
                </AlertDescription>
              </>
            ) : autoTranslateEnabled ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Traducción automática habilitada. Las etiquetas se han traducido automáticamente.
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Traducción automática deshabilitada. Se muestran los textos originales.
                </AlertDescription>
              </>
            )}
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {isTranslating('Full Name') ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {translatedLabels.name || 'Full Name'}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={translatedLabels.name || 'Enter your full name'}
                required
              />
            </div>

            {/* Campo de email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {isTranslating('Email Address') ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {translatedLabels.email || 'Email Address'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={translatedLabels.email || 'Enter your email address'}
                required
              />
            </div>

            {/* Campo de teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                {isTranslating('Phone Number') ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {translatedLabels.phone || 'Phone Number'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={translatedLabels.phone || 'Enter your phone number'}
              />
            </div>

            {/* Campo de categoría */}
            <div className="space-y-2">
              <Label htmlFor="category">
                {isTranslating('Category') ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {translatedLabels.category || 'Category'}
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={translatedLabels.category || 'Select a category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{translatedLabels.general || 'General Inquiry'}</SelectItem>
                  <SelectItem value="support">{translatedLabels.support || 'Technical Support'}</SelectItem>
                  <SelectItem value="billing">{translatedLabels.billing || 'Billing Question'}</SelectItem>
                  <SelectItem value="feedback">{translatedLabels.feedback || 'Feedback'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo de prioridad */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                {isTranslating('Priority Level') ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {translatedLabels.priority || 'Priority Level'}
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={translatedLabels.priority || 'Select priority level'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{translatedLabels.high || 'High Priority'}</SelectItem>
                  <SelectItem value="medium">{translatedLabels.medium || 'Medium Priority'}</SelectItem>
                  <SelectItem value="low">{translatedLabels.low || 'Low Priority'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo de mensaje */}
            <div className="space-y-2">
              <Label htmlFor="message">
                {isTranslating('Your Message') ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {translatedLabels.message || 'Your Message'}
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={translatedLabels.message || 'Enter your message here...'}
                rows={4}
                required
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {isTranslating('Submit Form') ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {translatedLabels.submit || 'Submit Form'}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                {translatedLabels.reset || 'Reset Form'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Información técnica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información Técnica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Características implementadas:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Traducción automática de etiquetas dinámicas</li>
              <li>• Indicadores de carga durante la traducción</li>
              <li>• Fallback a textos originales si falla la traducción</li>
              <li>• Traducción de placeholders y opciones de select</li>
              <li>• Manejo de estados de carga individuales</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Textos traducidos automáticamente:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(dynamicLabels).map(([key, englishText]) => (
                <div key={key} className="p-2 border rounded">
                  <div className="font-medium">{englishText}</div>
                  <div className="text-muted-foreground">
                    {translatedLabels[key] || 'Traduciendo...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
