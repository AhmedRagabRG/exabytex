import { NextResponse } from 'next/server'
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

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                image: true,
                price: true
              }
            }
          }
        },
        promoCode: {
          select: {
            code: true,
            discountType: true,
            discountValue: true
          }
        }
      }
    })

    // تحويل البيانات لتكون متوافقة مع UI
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      total: order.total,
      discount: order.discount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemsCount: order.items.length,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product
      })),
      promoCode: order.promoCode
    }))

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      totalOrders: orders.length
    })

  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب الطلبات' },
      { status: 500 }
    )
  }
} 