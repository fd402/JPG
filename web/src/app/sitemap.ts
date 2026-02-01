import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://picswitch.org'

    // Define valid conversion pairs for SEO
    const routes = [
        // HEIC conversions (High Volume)
        { source: 'heic', target: 'jpg' },
        { source: 'heic', target: 'png' },
        { source: 'heic', target: 'webp' },
        // WebP conversions
        { source: 'webp', target: 'jpg' },
        { source: 'webp', target: 'png' },
        // Component conversions
        { source: 'png', target: 'jpg' },
        { source: 'png', target: 'webp' },
        { source: 'jpg', target: 'png' },
        { source: 'jpg', target: 'webp' },
    ]

    const conversionUrls = routes.map(route => ({
        url: `${baseUrl}/${route.source}-to-${route.target}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...conversionUrls,
        {
            url: `${baseUrl}/legal`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]
}
