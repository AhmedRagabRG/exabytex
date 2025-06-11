import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            discountedPrice: true,
            hasDiscount: true,
            image: true,
            category: true,
            isActive: true,
            createdAt: true
          }
        }
      }
    })

    const formattedWishlist = wishlistItems
      .filter(item => item.product.isActive)
      .map(item => ({
        id: item.id,
        createdAt: item.createdAt,
        product: item.product
      }))

    return NextResponse.json({
      success: true,
      wishlist: formattedWishlist,
      totalItems: formattedWishlist.length
    })

  } catch (error) {
    console.error('خطأ في جلب المحفوظات:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب المحفوظات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 })
    }

    // التحقق من وجود المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, isActive: true }
    })

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'المنتج غير موجود أو غير متاح' }, { status: 404 })
    }

    // التحقق من عدم وجود المنتج في المحفوظات مسبقاً
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json({ error: 'المنتج موجود في المحفوظات بالفعل' }, { status: 400 })
    }

    // إضافة المنتج للمحفوظات
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: productId
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            discountedPrice: true,
            hasDiscount: true,
            image: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المنتج للمحفوظات',
      item: wishlistItem
    })

  } catch (error) {
    console.error('خطأ في إضافة المنتج للمحفوظات:', error)
    return NextResponse.json(
      { error: 'خطأ في إضافة المنتج للمحفوظات' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 })
    }

    // حذف المنتج من المحفوظات
    const deletedItem = await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
        productId: productId
      }
    })

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: 'المنتج غير موجود في المحفوظات' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج من المحفوظات'
    })

  } catch (error) {
    console.error('خطأ في حذف المنتج من المحفوظات:', error)
    return NextResponse.json(
      { error: 'خطأ في حذف المنتج من المحفوظات' },
      { status: 500 }
    )
  }
} 