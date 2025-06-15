import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // إنشاء شروط البحث
    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ]
    }

    if (role !== 'all') {
      whereClause.role = role
    }

    // إنشاء شروط الترتيب
    let orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // جلب المستخدمين مع إحصائياتهم
    const users = await prisma.user.findMany({
      where: whereClause,
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
        _count: {
          select: {
            orders: true,
            sessions: true
          }
        },
        orders: {
          select: {
            total: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // حساب إجمالي عدد المستخدمين
    const total = await prisma.user.count({
      where: whereClause
    })

    // معالجة البيانات وإضافة الإحصائيات
    const processedUsers = users.map(user => {
      const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0)
      const completedOrders = user.orders.filter(order => order.status === 'COMPLETED').length
      const lastLoginDate = user.updatedAt // يمكن تحسينه لاحقاً بحفظ آخر تسجيل دخول
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        emailVerified: user.emailVerified,
        lastLogin: lastLoginDate,
        stats: {
          totalOrders: user._count.orders,
          completedOrders,
          totalSpent,
          activeSessions: user._count.sessions
        }
      }
    })

    // إحصائيات عامة
    const totalStats = await prisma.user.aggregate({
      _count: true
    })

    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    })

    return NextResponse.json({
      success: true,
      users: processedUsers,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total
      },
      stats: {
        total: totalStats._count,
        byRole: roleStats.reduce((acc, stat) => {
          acc[stat.role] = stat._count
          return acc
        }, {} as Record<string, number>)
      }
    })

  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
        { error: 'ليس لديك صلاحية لتعديل المستخدمين' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, updates } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // منع المدير من تعديل الأدمن
    if (currentUser.role === 'MANAGER') {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (targetUser?.role === 'ADMIN') {
        return NextResponse.json(
          { error: 'ليس لديك صلاحية لتعديل الأدمن' },
          { status: 403 }
        )
      }

      // منع المدير من إعطاء صلاحيات أدمن
      if (updates.role === 'ADMIN') {
        return NextResponse.json(
          { error: 'ليس لديك صلاحية لإعطاء صلاحيات الأدمن' },
          { status: 403 }
        )
      }
    }

    // تحديث المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'تم تحديث المستخدم بنجاح'
    })

  } catch (error) {
    console.error('خطأ في تحديث المستخدم:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
        { error: 'ليس لديك صلاحية لحذف المستخدمين' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }

    // منع المدير من حذف الأدمن
    if (currentUser.role === 'MANAGER') {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (targetUser?.role === 'ADMIN') {
        return NextResponse.json(
          { error: 'ليس لديك صلاحية لحذف الأدمن' },
          { status: 403 }
        )
      }
    }

    // منع حذف نفسه
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'لا يمكنك حذف حسابك الخاص' },
        { status: 400 }
      )
    }

    // حذف المستخدم (سيتم حذف الجلسات والطلبات تلقائياً إذا كان مضبوط في schema)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    })

  } catch (error) {
    console.error('خطأ في حذف المستخدم:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
} 