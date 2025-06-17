import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/_next/',
        '/static/'
      ]
    },
    sitemap: 'https://exabytex.com/sitemap.xml'
  }
} 