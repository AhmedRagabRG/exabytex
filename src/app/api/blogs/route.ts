import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { Session } from 'next-auth';
import { prisma } from "@/lib/prisma"

const prismaClient = new PrismaClient();

// GET - جلب جميع المقالات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'PUBLISHED'
    const featured = searchParams.get('featured')
    
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status !== 'ALL') {
      where.status = status
    }
    
    if (featured === 'true') {
      where.featured = true
    }

    if (status === 'PUBLISHED') {
      where.published = true
      where.isVisible = true
    }

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
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
          status: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          comments: {
            where: {
              isApproved: true,
              parentId: null
            },
            select: {
              id: true,
              content: true,
              authorName: true,
              createdAt: true
            },
            take: 3
          }
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "حدث خطأ في جلب المقالات" 
      },
      { status: 500 }
    )
  }
}

// POST - إنشاء مقال جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      title,
      content,
      excerpt,
      slug,
      coverImage,
      authorId,
      authorName,
      authorAvatar,
      tags = [],
      featured = false,
      published = false
    } = body

    // التحقق من البيانات الأساسية المطلوبة
    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { 
          success: false,
          error: "العنوان والمحتوى والمقدمة مطلوبة" 
        },
        { status: 400 }
      )
    }

    // محاولة الحصول على session للاستخدام العادي
    const session = await getServerSession(authOptions) as any
    
    let finalAuthorId = authorId
    let finalAuthorName = authorName
    let finalAuthorAvatar = authorAvatar

    // إذا لم يتم توفير authorId، محاولة الحصول عليه من الـ session
    if (!finalAuthorId && session?.user?.id) {
      finalAuthorId = session.user.id
      finalAuthorName = finalAuthorName || session.user.name || session.user.email || 'مستخدم مجهول'
      finalAuthorAvatar = finalAuthorAvatar || session.user.image
    }

    // التحقق من وجود معلومات الكاتب
    if (!finalAuthorId) {
      return NextResponse.json(
        { 
          success: false,
          error: "يجب تسجيل الدخول أو توفير معلومات الكاتب" 
        },
        { status: 401 }
      )
    }

    // إنشاء slug تلقائياً إذا لم يتم توفيره
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s-]/g, '') // الحفاظ على العربية والإنجليزية
      .replace(/\s+/g, '-')
      .trim()

    // التحقق من أن الـ slug فريد
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: finalSlug }
    })

    if (existingPost) {
      return NextResponse.json(
        { 
          success: false,
          error: "رابط المقال موجود بالفعل" 
        },
        { status: 400 }
      )
    }

    // التحقق من وجود المؤلف
    const author = await prisma.user.findUnique({
      where: { id: finalAuthorId },
      select: { id: true, name: true, image: true }
    })

    if (!author) {
      return NextResponse.json(
        { 
          success: false,
          error: "المؤلف غير موجود" 
        },
        { status: 400 }
      )
    }

    // إنشاء المقال
    const blog = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt,
        slug: finalSlug,
        coverImage: coverImage || null,
        authorId: finalAuthorId,
        authorName: finalAuthorName || author.name || 'مجهول',
        authorAvatar: finalAuthorAvatar || author.image || null,
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        featured,
        status: published ? 'PUBLISHED' : 'PENDING',
        published,
        publishedAt: published ? new Date() : null,
        isVisible: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "تم إنشاء المقال بنجاح",
      data: blog
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating blog:", error)
    
    // التعامل مع أخطاء Prisma
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false,
          error: "رابط المقال موجود بالفعل" 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: "حدث خطأ في إنشاء المقال" 
      },
      { status: 500 }
    )
  }
} 