import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مخول للوصول' },
        { status: 401 }
      )
    }

    // التحقق من أن المستخدم admin أو manager
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية للوصول لهذه البيانات' },
        { status: 403 }
      )
    }

    const resolvedParams = await params
    const userId = resolvedParams.id

    // جلب تفاصيل المستخدم الكاملة
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        coins: {
          select: {
            balance: true,
            totalEarned: true,
            totalSpent: true
          }
        },
                 orders: {
           select: {
             id: true,
             status: true,
             total: true,
             createdAt: true,
             updatedAt: true,
             items: {
               select: {
                 id: true,
                 price: true,
                 quantity: true,
                 product: {
                   select: {
                     title: true,
                     image: true
                   }
                 }
               }
             }
           },
           orderBy: {
             createdAt: 'desc'
           }
         },
        sessions: {
          select: {
            id: true,
            expires: true,
            sessionToken: true
          },
          orderBy: {
            expires: 'desc'
          },
          take: 10
        },
        accounts: {
          select: {
            id: true,
            provider: true,
            type: true
          }
        },
        _count: {
          select: {
            orders: true,
            sessions: true,
            accounts: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // حساب الإحصائيات
    const stats = {
      totalOrders: user._count.orders,
      completedOrders: user.orders.filter(order => order.status === 'COMPLETED').length,
      pendingOrders: user.orders.filter(order => order.status === 'PENDING').length,
      cancelledOrders: user.orders.filter(order => order.status === 'CANCELLED').length,
      totalSpent: user.orders
        .filter(order => order.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.total, 0),
      activeSessions: user._count.sessions,
      linkedAccounts: user._count.accounts,
      memberSince: user.createdAt,
      lastActivity: user.updatedAt,
      currentCoins: user.coins?.balance || 0
    }

    // تجميع الطلبات حسب الحالة
    const ordersByStatus = user.orders.reduce((acc, order) => {
      const status = order.status
      if (!acc[status]) {
        acc[status] = {
          count: 0,
          total: 0,
          orders: []
        }
      }
      acc[status].count++
      acc[status].total += order.total
      acc[status].orders.push(order)
      return acc
    }, {} as Record<string, any>)

    // تجميع الطلبات حسب الشهر (آخر 12 شهر)
    const monthlyOrders = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM format
      
      const monthOrders = user.orders.filter(order => {
        const orderMonth = order.createdAt.toISOString().slice(0, 7)
        return orderMonth === monthKey
      })
      
      return {
        month: monthKey,
        count: monthOrders.length,
        total: monthOrders.reduce((sum, order) => sum + order.total, 0)
      }
    }).reverse()

    // معلومات الأمان
    const securityInfo = {
      emailVerified: user.emailVerified,
      twoFactorEnabled: false, // يمكن إضافته لاحقاً
      loginMethods: user.accounts.map(account => ({
        provider: account.provider,
        type: account.type
      })),
      recentSessions: user.sessions.slice(0, 5).map(session => ({
        id: session.id,
        expires: session.expires,
        isActive: session.expires > new Date(),
        sessionToken: session.sessionToken
      }))
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        orders: undefined, // نرسل الطلبات في قسم منفصل
        sessions: undefined, // نرسل الجلسات في قسم منفصل
        accounts: undefined, // نرسل الحسابات في قسم منفصل
        _count: undefined
      },
      stats,
      orders: {
        recent: user.orders.slice(0, 10),
        byStatus: ordersByStatus,
        monthly: monthlyOrders
      },
      security: securityInfo
    })

  } catch (error) {
    console.error('خطأ في جلب تفاصيل المستخدم:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
} 