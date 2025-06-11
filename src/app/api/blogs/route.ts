import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// GET - جلب جميع المقالات المنشورة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PUBLISHED';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // شروط البحث
    const where: Prisma.BlogPostWhereInput = {};
    
    if (status === 'PUBLISHED') {
      where.status = 'PUBLISHED';
      where.published = true;
    } else if (status === 'ALL') {
      // لا توجد شروط إضافية - عرض الكل
    } else {
      where.status = status as any;
    }

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true
            }
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ]);

    // تحويل tags من string إلى array
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      tags: JSON.parse(blog.tags || '[]')
    }));

    return NextResponse.json({
      blogs: formattedBlogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المقالات' },
      { status: 500 }
    );
  }
}

// POST - إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, tags } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء slug من العنوان
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + Date.now();

    // تحديد حالة المقال بناءً على دور المستخدم
    let status = 'PENDING';
    let published = false;
    let publishedAt = null;

    if (user.role === 'MANAGER' || user.role === 'ADMIN') {
      status = 'PUBLISHED';
      published = true;
      publishedAt = new Date();
    }

    const blogData = {
      title,
      content,
      excerpt,
      slug,
      coverImage: coverImage || null,
      authorId: user.id,
      authorName: user.name || user.email || 'كاتب مجهول',
      authorAvatar: user.image || null,
      tags: JSON.stringify(tags || []),
      status: status as any,
      published,
      publishedAt,
      approvedById: (user.role === 'MANAGER' || user.role === 'ADMIN') ? user.id : null
    };

    const blog = await prisma.blogPost.create({
      data: blogData,
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
      }
    });

    return NextResponse.json({
      ...blog,
      tags: JSON.parse(blog.tags)
    });

  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء المقال: ' + error.message },
      { status: 500 }
    );
  }
} 