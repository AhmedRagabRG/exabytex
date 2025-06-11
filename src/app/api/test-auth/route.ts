import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
        },
        { status: 400 }
      )
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'المستخدم غير موجود في قاعدة البيانات' 
        },
        { status: 404 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'كلمة مرور المستخدم غير محددة' 
        },
        { status: 400 }
      )
    }

    // التحقق من صحة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'كلمة المرور غير صحيحة' 
        },
        { status: 401 }
      )
    }

    // نجح التحقق - إرجاع بيانات المستخدم (بدون كلمة المرور)
    return NextResponse.json({
      success: true,
      message: 'تم التحقق من المصادقة بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('خطأ في اختبار المصادقة:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في النظام' 
      },
      { status: 500 }
    )
  }
} 