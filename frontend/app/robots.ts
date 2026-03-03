import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/cases', '/brokers', '/login', '/api/'],
      },
    ],
    sitemap: 'https://trutina.com.au/sitemap.xml',
  }
}
