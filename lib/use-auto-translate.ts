/**
 * Hook personalizado para traducción automática
 * Facilita el uso de traducciones automáticas en componentes React
 */

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/components/language-provider'

interface UseAutoTranslateOptions {
  fallbackToKey?: boolean
  showLoadingState?: boolean
}

export function useAutoTranslate(options: UseAutoTranslateOptions = {}) {
  const { fallbackToKey = true, showLoadingState = false } = options
  const { t, tAsync, autoTranslateEnabled } = useLanguage()
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set())
  const [translatedTexts, setTranslatedTexts] = useState<Map<string, string>>(new Map())

  const translate = useCallback(async (key: string): Promise<string> => {
    // Si ya tenemos la traducción en caché, devolverla
    if (translatedTexts.has(key)) {
      return translatedTexts.get(key)!
    }

    // Intentar obtener traducción del diccionario estático primero
    const staticTranslation = t(key)
    if (staticTranslation !== key) {
      setTranslatedTexts(prev => new Map(prev).set(key, staticTranslation))
      return staticTranslation
    }

    // Si no existe en el diccionario estático y la traducción automática está habilitada
    if (autoTranslateEnabled) {
      if (showLoadingState) {
        setLoadingKeys(prev => new Set(prev).add(key))
      }

      try {
        const translatedText = await tAsync(key)
        setTranslatedTexts(prev => new Map(prev).set(key, translatedText))
        return translatedText
      } catch (error) {
        console.warn(`Error traduciendo "${key}":`, error)
        if (fallbackToKey) {
          return key
        }
        return ''
      } finally {
        if (showLoadingState) {
          setLoadingKeys(prev => {
            const newSet = new Set(prev)
            newSet.delete(key)
            return newSet
          })
        }
      }
    }

    // Fallback: devolver la clave original o string vacío
    return fallbackToKey ? key : ''
  }, [t, tAsync, autoTranslateEnabled, fallbackToKey, showLoadingState, translatedTexts])

  const translateMultiple = useCallback(async (keys: string[]): Promise<Record<string, string>> => {
    const results: Record<string, string> = {}
    
    // Procesar todas las traducciones en paralelo
    const promises = keys.map(async (key) => {
      const translation = await translate(key)
      results[key] = translation
    })

    await Promise.all(promises)
    return results
  }, [translate])

  const isTranslating = useCallback((key: string) => {
    return loadingKeys.has(key)
  }, [loadingKeys])

  const clearCache = useCallback(() => {
    setTranslatedTexts(new Map())
  }, [])

  return {
    translate,
    translateMultiple,
    isTranslating,
    clearCache,
    autoTranslateEnabled
  }
}

/**
 * Hook para traducción automática con estado de carga
 */
export function useAutoTranslateWithLoading() {
  return useAutoTranslate({ showLoadingState: true })
}

/**
 * Hook para traducción automática sin fallback a la clave
 */
export function useAutoTranslateStrict() {
  return useAutoTranslate({ fallbackToKey: false })
}
