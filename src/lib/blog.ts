import { PrismaClient } from '@prisma/client'
import { BlogPost } from '@/types'

const prisma = new PrismaClient()

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return posts
      .filter(post => (post as any).isVisible !== false)
      .map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage || '/api/placeholder/800/400',
        author: {
          name: post.author?.name || post.authorName || 'كاتب مجهول',
          email: post.author?.email || '',
          image: post.author?.image || post.authorAvatar || '/api/placeholder/100/100',
          role: post.author?.role || 'USER'
        },
        tags: JSON.parse(post.tags || '[]'),
        publishedAt: new Date(post.publishedAt || post.createdAt),
        featured: post.featured || false,
      })) as BlogPost[]
  } catch (error) {
    console.error('Error reading posts from database:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs?slug=${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (!data.success || !data.post) {
      return null
    }

    const post = data.post

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage || '/api/placeholder/800/400',
      author: {
        name: post.author?.name || post.authorName || 'كاتب مجهول',
        email: post.author?.email || '',
        image: post.author?.image || post.authorAvatar || '/api/placeholder/100/100',
        role: post.author?.role || 'USER'
      },
      tags: post.tags || [],
      publishedAt: new Date(post.publishedAt || post.createdAt),
      featured: post.featured || false,
    } as BlogPost
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  // For now, just return the content as HTML
  // You can add markdown processing later if needed
  return markdown.replace(/\n/g, '<br />')
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        published: true,
        featured: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    })

    return posts
      .filter(post => (post as any).isVisible !== false)
      .map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage || '/api/placeholder/800/400',
        author: {
          name: post.author?.name || post.authorName || 'كاتب مجهول',
          email: post.author?.email || '',
          image: post.author?.image || post.authorAvatar || '/api/placeholder/100/100',
          role: post.author?.role || 'USER'
        },
        tags: JSON.parse(post.tags || '[]'),
        publishedAt: new Date(post.publishedAt || post.createdAt),
        featured: post.featured || false,
      })) as BlogPost[]
  } catch (error) {
    console.error('Error reading featured posts:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        published: true,
        tags: {
          contains: tag
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return posts
      .filter(post => (post as any).isVisible !== false)
      .map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage || '/api/placeholder/800/400',
        author: {
          name: post.author?.name || post.authorName || 'كاتب مجهول',
          email: post.author?.email || '',
          image: post.author?.image || post.authorAvatar || '/api/placeholder/100/100',
          role: post.author?.role || 'USER'
        },
        tags: JSON.parse(post.tags || '[]'),
        publishedAt: new Date(post.publishedAt || post.createdAt),
        featured: post.featured || false,
      })) as BlogPost[]
  } catch (error) {
    console.error('Error reading posts by tag:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        published: true
      },
      select: {
        tags: true
      }
    })

    const tags = new Set<string>()
    
    posts.forEach(post => {
      try {
        const postTags = JSON.parse(post.tags || '[]')
        postTags.forEach((tag: string) => tags.add(tag))
      } catch (error) {
        console.error('Error parsing tags:', error)
      }
    })
    
    return Array.from(tags).sort()
  } catch (error) {
    console.error('Error reading tags:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
} 