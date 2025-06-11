import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from "next-auth"

const prisma = new PrismaClient();

// GET - جلب جميع الفئات
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الفئات' },
      { status: 500 }
    );
  }
}

// POST - إضافة فئة جديدة (للمدراء فقط)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من أن المستخدم مانجر أو أدمن
    if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لإضافة فئات' },
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

    // التحقق من عدم وجود فئة بنفس الاسم
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'فئة بهذا الاسم موجودة بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء الفئة الجديدة
    const category = await prisma.category.create({
      data: {
        name,
        description: description || '',
        icon: icon || 'Tag',
        isActive: true
      }
    });

    return NextResponse.json(category, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء الفئة' },
      { status: 500 }
    );
  }
} 