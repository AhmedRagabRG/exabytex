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
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL
      }
      if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL
      }
      if (process.env.NODE_ENV === 'production') {
        return 'https://exabytex.com'
      }
      return 'http://localhost:3000'
    }

    const response = await fetch(`${getBaseUrl()}/api/blogs?slug=${slug}`, {
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

// دالة معالجة المحتوى لتحسين العرض والتنظيف من inline styles
export const formatContent = (content: string): string => {
  if (!content) return ''
  
  let formattedContent = content
  
  // تنظيف inline styles والنصوص الخاصة بـ CSS التي تظهر كنص
  formattedContent = formattedContent
    .replace(/style="[^"]*"/g, '') // إزالة style attributes
    .replace(/style='[^']*'/g, '') // إزالة style attributes بعلامات تنصيص مفردة
    // إزالة CSS properties التي تظهر كنص عادي
    .replace(/border-right-width:\s*\d+px;?\s*/g, '')
    .replace(/border-right-color:\s*rgb\([^)]+\);?\s*/g, '')
    .replace(/background:\s*rgb\([^)]+\);?\s*/g, '')
    .replace(/padding:\s*\d+px;?\s*/g, '')
    .replace(/margin[^:]*:\s*\d+px[^;]*;?\s*/g, '')
    .replace(/border-radius:\s*\d+px;?\s*/g, '')
    .replace(/font-style:\s*italic;?\s*/g, '')
    .replace(/color:\s*rgb\([^)]+\);?\s*/g, '')
    .replace(/text-align:\s*center;?\s*/g, '')
    .replace(/font-weight:\s*\d+;?\s*/g, '')
  
  // إذا كان المحتوى لا يحتوي على HTML، نعالجه كنص عادي
  if (!formattedContent.includes('<') || (!formattedContent.includes('<p>') && !formattedContent.includes('<h') && !formattedContent.includes('<a'))) {
    formattedContent = formattedContent
      // معالجة علامات التنصيص العربية والإنجليزية
      .replace(/[""]([^""]*?)[""|""]/g, '<mark class="quote-highlight">"$1"</mark>')
      .replace(/[''']([^''']*?)['''|'']/g, '<mark class="quote-light">\'$1\'</mark>')
      // معالجة النص العريض
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // معالجة النص المائل
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // معالجة العناوين
      .replace(/^### (.*$)/gm, '<h3 class="content-heading">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="content-heading">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="content-heading">$1</h1>')
      // معالجة القوائم
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      // معالجة الأكواد
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // معالجة أسطر جديدة
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />')
    
    // تغليف النص في فقرات
    if (formattedContent && !formattedContent.includes('<p>')) {
      formattedContent = `<p>${formattedContent}</p>`
    }
  } else {
    // المحتوى يحتوي على HTML بالفعل، نحسنه ونضيف classes
    formattedContent = formattedContent
      // معالجة علامات التنصيص
      .replace(/[""]([^""]*?)[""|""]/g, '<mark class="quote-highlight">"$1"</mark>')
      .replace(/[''']([^''']*?)['''|'']/g, '<mark class="quote-light">\'$1\'</mark>')
      // إضافة classes للعناصر إذا لم تكن موجودة
      .replace(/<h([1-6])(?![^>]*class)/g, '<h$1 class="content-heading"')
      .replace(/<blockquote(?![^>]*class)/g, '<blockquote class="content-quote"')
      .replace(/<img(?![^>]*class)/g, '<img class="content-image"')
      .replace(/<a(?![^>]*class)([^>]*target="_blank"[^>]*)>/g, '<a class="content-link"$1>')
      // إضافة div container للصور إذا لم تكن موجودة
      .replace(/<img([^>]*class="content-image"[^>]*)>/g, '<div class="image-container"><img$1></div>')
  }
  
  // تنظيف المسافات الزائدة
  formattedContent = formattedContent
    .replace(/\s+/g, ' ') // تنظيف المسافات الزائدة
    .trim()
  
  return formattedContent
} 