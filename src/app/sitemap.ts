import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

// تعريف الروابط الثابتة خارج الدالة
const staticUrls: MetadataRoute.Sitemap = [
  {
    url: 'https://exabytex.com',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  },
  {
    url: 'https://exabytex.com/blog',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  },
  {
    url: 'https://exabytex.com/about',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: 'https://exabytex.com/contact',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // إذا كان في وضع التطوير، نرجع الروابط الثابتة فقط
  if (process.env.NODE_ENV === 'development') {
    return staticUrls
  }

  let prisma: PrismaClient | null = null
  try {
    prisma = new PrismaClient()
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `https://exabytex.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticUrls, ...postUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // في حالة فشل الاتصال بقاعدة البيانات، نرجع الروابط الثابتة فقط
    return staticUrls
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
} 