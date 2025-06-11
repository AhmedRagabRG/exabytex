import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'يجب تسجيل الدخول أولاً' 
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'المستخدم غير موجود' 
      }, { status: 404 })
    }

    const body = await request.json()
    const { name, phone, image } = body
    
    // التحقق من البيانات الأساسية
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'الاسم مطلوب' 
      }, { status: 400 })
    }

    if (name.length > 100) {
      return NextResponse.json({ 
        success: false, 
        error: 'الاسم طويل جداً' 
      }, { status: 400 })
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        phone: phone || null,
        image: image || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user: updatedUser
    })

  } catch (error) {
    console.error('خطأ في تحديث الملف الشخصي:', error)
    return NextResponse.json({
      success: false,
      error: 'خطأ في تحديث الملف الشخصي'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 