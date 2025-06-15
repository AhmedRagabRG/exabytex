import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// PUT - تعديل تعليق
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

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'التعليق غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الصلاحية (المؤلف أو الإدارة)
    if (comment.authorId !== user.id && user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتعديل هذا التعليق' },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'المحتوى مطلوب' },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
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

    return NextResponse.json(updatedComment);

  } catch (error: unknown) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'فشل في تعديل التعليق: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}

// DELETE - حذف تعليق
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

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'التعليق غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الصلاحية (المؤلف أو الإدارة)
    if (comment.authorId !== user.id && user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لحذف هذا التعليق' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'تم حذف التعليق بنجاح' });

  } catch (error: unknown) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'فشل في حذف التعليق: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
      { status: 500 }
    );
  }
} 