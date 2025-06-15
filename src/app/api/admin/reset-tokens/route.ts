import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - عرض جميع الـ tokens النشطة
export async function GET() {
  // هذا API متاح فقط في بيئة التطوير
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'غير متاح في الإنتاج' },
      { status: 403 }
    )
  }

  try {
    // جلب جميع المستخدمين الذين لديهم reset tokens
    const usersWithTokens = await prisma.user.findMany({
      where: {
        resetToken: {
          not: null
        }
      },
      select: {
        id: true,
        email: true,
        resetToken: true,
        resetTokenExpiry: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // تنسيق البيانات
    const tokens = usersWithTokens.map(user => ({
      id: user.id,
      email: user.email,
      resetToken: user.resetToken,
      resetTokenExpiry: user.resetTokenExpiry,
      createdAt: user.createdAt
    }))

    return NextResponse.json({
      success: true,
      count: tokens.length,
      tokens,
      message: `تم العثور على ${tokens.length} token نشط`
    })

  } catch (error) {
    console.error('Error fetching reset tokens:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب البيانات' },
      { status: 500 }
    )
  }
}

// DELETE - حذف token محدد
export async function DELETE(request: NextRequest) {
  // هذا API متاح فقط في بيئة التطوير
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'غير متاح في الإنتاج' },
      { status: 403 }
    )
  }

  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'التوكن مطلوب' },
        { status: 400 }
      )
    }

    // حذف الـ token
    const updatedUser = await prisma.user.updateMany({
      where: {
        resetToken: token
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    if (updatedUser.count === 0) {
      return NextResponse.json(
        { error: 'التوكن غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف التوكن بنجاح'
    })

  } catch (error) {
    console.error('Error deleting reset token:', error)
    return NextResponse.json(
      { error: 'خطأ في حذف التوكن' },
      { status: 500 }
    )
  }
}

// POST - تنظيف الـ tokens المنتهية الصلاحية
export async function POST() {
  // هذا API متاح فقط في بيئة التطوير
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'غير متاح في الإنتاج' },
      { status: 403 }
    )
  }

  try {
    // حذف جميع الـ tokens المنتهية الصلاحية
    const result = await prisma.user.updateMany({
      where: {
        resetTokenExpiry: {
          lt: new Date()
        }
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `تم حذف ${result.count} token منتهي الصلاحية`
    })

  } catch (error) {
    console.error('Error cleaning expired tokens:', error)
    return NextResponse.json(
      { error: 'خطأ في تنظيف التوكنز' },
      { status: 500 }
    )
  }
} 