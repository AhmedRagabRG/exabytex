import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

// GET - جلب منتج واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      features: JSON.parse(product.features || '[]')
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المنتج' },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT Request for product ID:', id);
    
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
        { error: 'ليس لديك صلاحية لتحديث المنتجات' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('Update request body:', body);
    
    const { title, description, price, discountedPrice, hasDiscount, image, category, features, isPopular } = body;

    // التحقق من صحة بيانات الخصم
    if (hasDiscount && (!discountedPrice || parseFloat(discountedPrice) >= parseFloat(price))) {
      return NextResponse.json(
        { error: 'السعر بعد الخصم يجب أن يكون أقل من السعر الأصلي' },
        { status: 400 }
      );
    }

    // التأكد من أن isActive يبقى true عند التحديث
    const updateData = {
      title,
      description,
      price: parseFloat(price),
      discountedPrice: hasDiscount ? parseFloat(discountedPrice) : null,
      hasDiscount: Boolean(hasDiscount),
      image,
      category,
      features: JSON.stringify(features || []),
      isPopular: Boolean(isPopular),
      isActive: true, // التأكد من بقاء المنتج نشطاً
      updatedAt: new Date()
    };
    
    console.log('Update data to be saved:', updateData);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Product updated successfully:', product);

    return NextResponse.json({
      ...product,
      features: JSON.parse(product.features)
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث المنتج' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج
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
        { error: 'ليس لديك صلاحية لحذف المنتجات' },
        { status: 403 }
      );
    }

    // حذف المنتج (soft delete)
    await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'فشل في حذف المنتج' },
      { status: 500 }
    );
  }
} 