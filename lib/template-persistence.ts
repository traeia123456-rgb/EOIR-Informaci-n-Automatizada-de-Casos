import { Template } from '@/types/template'

// Configuración de IndexedDB
const DB_NAME = 'template_storage'
const DB_VERSION = 1
const STORE_NAME = 'templates'
const BACKUP_STORE = 'template_backups'

// Interfaz para el sistema de respaldo
interface TemplateBackup {
  template: Template
  timestamp: string
  version: number
}

// Clase para manejar errores de persistencia
class PersistenceError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'PersistenceError'
  }
}

// Inicializar la base de datos
async function initDB(): Promise<IDBDatabase | null> {
  // Verificar si indexedDB está disponible (no disponible en SSR)
  if (typeof window === 'undefined' || !window.indexedDB) {
    console.warn('IndexedDB no está disponible en este entorno');
    return null;
  }
  
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new PersistenceError('Error al abrir la base de datos'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Crear store para plantillas
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'meta.id' })
      }
      
      // Crear store para respaldos
      if (!db.objectStoreNames.contains(BACKUP_STORE)) {
        const backupStore = db.createObjectStore(BACKUP_STORE, { 
          keyPath: ['template.meta.id', 'timestamp']
        })
        backupStore.createIndex('by_template', 'template.meta.id')
        backupStore.createIndex('by_timestamp', 'timestamp')
      }
    }
  })
}

// Clase principal para persistencia
export class TemplatePersistence {
  private db: IDBDatabase | null = null
  private backupInterval: number = 5 * 60 * 1000 // 5 minutos
  private backupTimer: NodeJS.Timeout | null = null

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      this.db = await initDB()
    } catch (error) {
      console.error('Error inicializando persistencia:', error)
    }
  }

  // Guardar plantilla
  async saveTemplate(template: Template): Promise<void> {
    if (!this.db) throw new PersistenceError('Base de datos no inicializada')

    return new Promise((resolve, reject) => {
      try {
        // Guardar en IndexedDB
        if (!this.db) throw new PersistenceError('Base de datos no inicializada')
        const transaction = this.db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const request = store.put(template)
        
        request.onsuccess = () => {
          // También guardar en localStorage como respaldo
          try {
            localStorage.setItem(
              `template_${template.meta.id}`,
              JSON.stringify(template)
            )
          } catch (error) {
            console.warn('Error al guardar en localStorage:', error)
          }
          
          resolve()
        }

        request.onerror = () => {
          reject(new PersistenceError('Error al guardar la plantilla'))
        }
      } catch (error) {
        reject(new PersistenceError('Error en la transacción', error as Error))
      }
    })
  }

  // Crear respaldo
  async createBackup(template: Template): Promise<void> {
    if (!this.db) throw new PersistenceError('Base de datos no inicializada')

    const backup: TemplateBackup = {
      template,
      timestamp: new Date().toISOString(),
      version: template.meta.version
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(BACKUP_STORE, 'readwrite')
        const store = transaction.objectStore(BACKUP_STORE)
        
        const request = store.add(backup)
        
        request.onsuccess = () => resolve()
        request.onerror = () => {
          reject(new PersistenceError('Error al crear respaldo'))
        }
      } catch (error) {
        reject(new PersistenceError('Error en la transacción de respaldo', error as Error))
      }
    })
  }

  // Iniciar respaldo automático
  startAutoBackup(template: Template) {
    if (this.backupTimer) {
      clearInterval(this.backupTimer)
    }

    this.backupTimer = setInterval(() => {
      this.createBackup(template).catch(error => {
        console.error('Error en respaldo automático:', error)
      })
    }, this.backupInterval)
  }

  // Detener respaldo automático
  stopAutoBackup() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer)
      this.backupTimer = null
    }
  }

  // Recuperar respaldos
  async getBackups(templateId: string): Promise<TemplateBackup[]> {
    if (!this.db) throw new PersistenceError('Base de datos no inicializada')

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(BACKUP_STORE, 'readonly')
        const store = transaction.objectStore(BACKUP_STORE)
        const index = store.index('by_template')
        
        const request = index.getAll(templateId)
        
        request.onsuccess = () => {
          resolve(request.result)
        }
        
        request.onerror = () => {
          reject(new PersistenceError('Error al recuperar respaldos'))
        }
      } catch (error) {
        reject(new PersistenceError('Error en la transacción', error as Error))
      }
    })
  }

  // Restaurar desde respaldo
  async restoreFromBackup(templateId: string, timestamp: string): Promise<Template> {
    if (!this.db) throw new PersistenceError('Base de datos no inicializada')

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(BACKUP_STORE, 'readonly')
        const store = transaction.objectStore(BACKUP_STORE)
        
        const request = store.get([templateId, timestamp])
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.template)
          } else {
            reject(new PersistenceError('Respaldo no encontrado'))
          }
        }
        
        request.onerror = () => {
          reject(new PersistenceError('Error al restaurar respaldo'))
        }
      } catch (error) {
        reject(new PersistenceError('Error en la transacción', error as Error))
      }
    })
  }
}

// Exportar instancia singleton
export const templatePersistence = new TemplatePersistence()