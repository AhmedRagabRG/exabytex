import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// GET - جلب التعليقات لمقال معين
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogPostId = searchParams.get('blogPostId');

    if (!blogPostId) {
      return NextResponse.json(
        { error: 'معرف المقال مطلوب' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        blogPostId: blogPostId,
        isApproved: true,
        parentId: null // فقط التعليقات الرئيسية
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
        },
        replies: {
          where: {
            isApproved: true
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
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ comments });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'فشل في جلب التعليقات' },
      { status: 500 }
    );
  }
}

// POST - إضافة تعليق جديد
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
    const { content, blogPostId, parentId } = body;

    // التحقق من البيانات المطلوبة
    if (!content || !blogPostId) {
      return NextResponse.json(
        { error: 'المحتوى ومعرف المقال مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من وجود المقال
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId }
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    // إذا كان رد على تعليق، التحقق من وجود التعليق الأصلي
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'التعليق الأصلي غير موجود' },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        blogPostId,
        authorId: user.id,
        authorName: user.name || user.email || 'مستخدم مجهول',
        authorAvatar: user.image || null,
        parentId: parentId || null,
        isApproved: true // يمكن تغييرها لتتطلب موافقة
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
      }
    });

    return NextResponse.json(comment);

  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'فشل في إضافة التعليق: ' + error.message },
      { status: 500 }
    );
  }
} 