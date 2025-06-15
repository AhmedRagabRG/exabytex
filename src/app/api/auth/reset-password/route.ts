import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'التوكن وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم بالتوكن
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date() // التوكن لم ينته بعد
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(password, 12)

    // تحديث كلمة المرور وحذف توكن الاستعادة
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم. حاول مرة أخرى.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Reset Password API',
    status: 'Active',
    endpoints: {
      'POST /api/auth/reset-password': 'Reset password using token'
    },
    requiredFields: ['token', 'password'],
    features: [
      '🔐 Password reset',
      '🔒 Password hashing',
      '🧹 Token cleanup',
      '🛡️ Security validation'
    ]
  })
} 