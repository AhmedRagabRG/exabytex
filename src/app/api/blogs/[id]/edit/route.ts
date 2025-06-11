import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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

    // البحث عن المقال
    const post = await prisma.blogPost.findUnique({
      where: { id: resolvedParams.id },
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

    if (!post) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    // فحص الصلاحيات: المؤلف أو الإداري
    const isAuthor = post.authorId === user.id;
    const isAdmin = user.role === 'ADMIN' || user.role === 'MANAGER';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتعديل هذا المقال' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ...post,
      tags: JSON.parse(post.tags || '[]')
    });

  } catch (error: any) {
    console.error('Error fetching blog post for edit:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل المقال: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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

    // البحث عن المقال
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: resolvedParams.id },
      include: { author: true }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    // فحص الصلاحيات: المؤلف أو الإداري
    const isAuthor = existingPost.authorId === user.id;
    const isAdmin = user.role === 'ADMIN' || user.role === 'MANAGER';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتعديل هذا المقال' },
        { status: 403 }
      );
    }

    const { title, content, excerpt, tags, coverImage } = await request.json();

    // التحقق من صحة البيانات
    if (!title?.trim() || !content?.trim() || !excerpt?.trim()) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى والملخص مطلوبة' },
        { status: 400 }
      );
    }

    // تحديث المقال
    const updatedPost = await prisma.blogPost.update({
      where: { id: resolvedParams.id },
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        tags: JSON.stringify(tags || []),
        coverImage: coverImage?.trim() || null,
        updatedAt: new Date()
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

    return NextResponse.json({
      ...updatedPost,
      tags: JSON.parse(updatedPost.tags || '[]')
    });

  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث المقال: ' + error.message },
      { status: 500 }
    );
  }
} 