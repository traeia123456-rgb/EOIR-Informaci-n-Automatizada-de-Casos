import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/admin/dashboard',
          '/admin/login',
          '/admin/auto-translate',
          '/admin/case-status',
          '/admin/translation-test',
        ],
      },
    ],
    sitemap: 'https://www.acis-eoir-justice.org/sitemap.xml',
  }
}
