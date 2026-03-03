import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://trutina.com.au'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/docs/one-pager`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/docs/quickstart`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/docs/integration`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/docs/risk-scores`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/docs/roi`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/docs/security`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/docs/compliance`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/docs/pitch`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]
}
