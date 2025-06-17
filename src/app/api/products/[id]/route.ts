import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'next-auth';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string
  }
}

// GET - جلب منتج واحد
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// PUT - تحديث منتج
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, image, emailSubject, emailContent } = body

    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price,
        image,
        emailSubject,
        emailContent,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// DELETE - حذف منتج
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const productId = params.id;

    // التحقق من وجود المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    // حذف جميع السجلات المرتبطة في ترتيب صحيح
    await prisma.$transaction(async (tx) => {
      // حذف المراجعات
      await tx.review.deleteMany({
        where: { productId },
      });

      // حذف عناصر قائمة الرغبات
      await tx.wishlist.deleteMany({
        where: { productId },
      });

      // حذف عناصر السلة
      await tx.cartItem.deleteMany({
        where: { productId },
      });

      // حذف عناصر الطلبات
      await tx.orderItem.deleteMany({
        where: { productId },
      });

      // أخيراً، حذف المنتج نفسه
      await tx.product.delete({
        where: { id: productId },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 