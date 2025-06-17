import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // الحصول على جميع المقالات المنشورة
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      published: true
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // إنشاء روابط المقالات
  const postUrls = posts.map((post) => ({
    url: `https://exabytex.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  // الروابط الثابتة للموقع
  const staticUrls = [
    {
      url: 'https://exabytex.com',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: 'https://exabytex.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    {
      url: 'https://exabytex.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    {
      url: 'https://exabytex.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }
  ]

  return [...staticUrls, ...postUrls]
} 