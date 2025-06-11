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
      where: {
        userId: user.id
      },
      include: {
        product: true
      }
    })

    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
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
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    // التحقق من وجود المنتج في المفضلة مسبقاً
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    })

    if (existingWishlistItem) {
      // إزالة من المفضلة
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId
          }
        }
      })
      return NextResponse.json({ message: 'تم إزالة المنتج من المفضلة', isWishlisted: false })
    } else {
      // إضافة للمفضلة
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          productId: productId
        }
      })
      return NextResponse.json({ message: 'تم إضافة المنتج للمفضلة', isWishlisted: true })
    }

  } catch (error) {
    console.error('Error managing wishlist:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}