import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { Prisma, PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// GET - جلب مقال واحد للإدارة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const blog = await prisma.blogPost.findUnique({
      where: { id },
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
      }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...blog,
      tags: JSON.parse(blog.tags || '[]')
    });

  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المقال' },
      { status: 500 }
    );
  }
}

// PUT - تحديث مقال (قبول/رفض/تعديل)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const blog = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الصلاحيات - المؤلف أو الـ Manager/Admin
    if (blog.authorId !== user.id && user.role !== 'MANAGER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتحديث هذا المقال' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, tags, action } = body;

    let updateData: Prisma.BlogPostUpdateInput = {};

    // إذا كان action موجود (approve/reject)
    if (action && (user.role === 'MANAGER' || user.role === 'ADMIN')) {
      if (action === 'approve') {
        updateData = {
          status: 'PUBLISHED',
          published: true,
          publishedAt: new Date(),
          // approvedById: user.id,
          rejectionReason: null
        };
      } else if (action === 'reject') {
        updateData = {
          status: 'REJECTED',
          published: false,
          publishedAt: null,
          rejectionReason: body.rejectionReason || 'تم رفض المقال'
        };
      }
    } else {
      // تحديث عادي للمحتوى
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (excerpt) updateData.excerpt = excerpt;
      if (coverImage !== undefined) updateData.coverImage = coverImage;
      if (tags) updateData.tags = JSON.stringify(tags);
      
      // إذا كان المؤلف يحدث المقال، يعود للحالة PENDING
      if (blog.authorId === user.id && user.role === 'USER') {
        updateData.status = 'PENDING';
        updateData.published = false;
        updateData.publishedAt = null;
        updateData.rejectionReason = null;
      }
    }

    updateData.updatedAt = new Date();

    const updatedBlog = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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
      }
    });

    return NextResponse.json({
      ...updatedBlog,
      tags: JSON.parse(updatedBlog.tags || '[]')
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث المقال' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مقال
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const blog = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الصلاحيات - المؤلف أو الـ Manager/Admin
    if (blog.authorId !== user.id && user.role !== 'MANAGER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لحذف هذا المقال' },
        { status: 403 }
      );
    }

    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'تم حذف المقال بنجاح'
    });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'فشل في حذف المقال' },
      { status: 500 }
    );
  }
} 