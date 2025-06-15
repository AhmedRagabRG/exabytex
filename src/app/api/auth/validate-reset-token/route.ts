import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'التوكن مطلوب' },
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
      return NextResponse.json({
        valid: false,
        error: 'رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية'
      })
    }

    return NextResponse.json({
      valid: true,
      message: 'التوكن صحيح'
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Validate Reset Token API',
    status: 'Active',
    endpoints: {
      'POST /api/auth/validate-reset-token': 'Validate password reset token'
    },
    requiredFields: ['token'],
    features: [
      '🔍 Token validation',
      '⏰ Expiry checking',
      '🛡️ Security verification'
    ]
  })
} 