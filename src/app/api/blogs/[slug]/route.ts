import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    // البحث عن المقال باستخدام slug
    const post = await prisma.blogPost.findUnique({
      where: { 
        slug: slug,
        published: true,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        slug: true,
        coverImage: true,
        authorId: true,
        authorName: true,
        authorAvatar: true,
        tags: true,
        featured: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // تحويل المقال للصيغة المطلوبة
    const formattedPost = {
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }

    return NextResponse.json({
      success: true,
      post: formattedPost
    })

  } catch (error) {
    console.error('خطأ في جلب المقال:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    )
  }
} 