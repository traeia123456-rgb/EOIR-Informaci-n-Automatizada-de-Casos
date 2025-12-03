import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EOIR - Sistema de Información Automatizada de Casos',
    short_name: 'EOIR Casos',
    description: 'Sistema de Información Automatizada del Tribunal de Inmigración - Executive Office for Immigration Review',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1A365D',
    icons: [
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    orientation: 'portrait',
    categories: ['government', 'legal', 'immigration'],
    lang: 'es',
  }
}
