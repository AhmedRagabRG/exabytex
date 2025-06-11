import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

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

    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لهذا الإجراء' },
        { status: 403 }
      );
    }

    const { isVisible } = await request.json();

    const updatedBlog = await prisma.blogPost.update({
      where: { id: resolvedParams.id },
      data: { isVisible },
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
      ...updatedBlog,
      tags: JSON.parse(updatedBlog.tags || '[]')
    });

  } catch (error: any) {
    console.error('Error updating blog visibility:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث إعدادات العرض: ' + error.message },
      { status: 500 }
    );
  }
} 