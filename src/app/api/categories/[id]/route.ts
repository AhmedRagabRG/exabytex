import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from "next-auth"

const prisma = new PrismaClient();

// GET - جلب فئة واحدة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'الفئة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الفئة' },
      { status: 500 }
    );
  }
}

// PUT - تحديث فئة
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

    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتحديث الفئات' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, icon } = body;

    // التحقق من البيانات المطلوبة
    if (!name) {
      return NextResponse.json(
        { error: 'اسم الفئة مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود فئة أخرى بنفس الاسم
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name,
        id: { not: id }
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'فئة بهذا الاسم موجودة بالفعل' },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || '',
        icon: icon || 'Tag',
        updatedAt: new Date()
      }
    });

    return NextResponse.json(category);

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الفئة' },
      { status: 500 }
    );
  }
}

// DELETE - حذف فئة
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

    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لحذف الفئات' },
        { status: 403 }
      );
    }

    // حذف الفئة (soft delete)
    await prisma.category.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'تم حذف الفئة بنجاح' });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الفئة' },
      { status: 500 }
    );
  }
} 