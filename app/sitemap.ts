import type { MetadataRoute } from 'next'

export const baseUrl = 'https://friday.feynmanpi.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString().split('T')[0]

  // Static routes. Add new pages here as the site grows.
  return ['', '/privacy', '/terms'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.5
  }))
}
