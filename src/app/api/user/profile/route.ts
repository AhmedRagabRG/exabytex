import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth';

// GET - جلب بيانات البروفايل
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'غير مخول للوصول' },
        { status: 401 }
      )
    }

    // Find the user with additional stats
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
        wishlistItems: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Calculate user statistics
    const totalOrders = user.orders.length
    const totalSpent = user.orders
      .filter(order => order.status === 'COMPLETED')
      .reduce((sum, order) => sum + order.total, 0)
    const savedProducts = user.wishlistItems.length
    const loyaltyPoints = Math.floor(totalSpent * 0.1) // 10% of spent amount as points

    const userWithStats = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      image: user.image,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      totalOrders,
      totalSpent,
      savedProducts,
      loyaltyPoints,
    }

    return NextResponse.json({
      success: true,
      user: userWithStats,
    })
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    )
  }
}

// PUT - تحديث بيانات البروفايل
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'غير مخول للوصول' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone } = body

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        phone: phone || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('خطأ في تحديث بيانات المستخدم:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    )
  }
} 