import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Session } from 'next-auth'
import { Prisma } from '@prisma/client'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, currentPassword, newPassword } = body

    // التحقق من صحة البيانات
    if (!name || !email) {
      return NextResponse.json({ error: 'الاسم والبريد الإلكتروني مطلوبان' }, { status: 400 })
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني غير صحيحة' }, { status: 400 })
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // التحقق من عدم وجود بريد إلكتروني مكرر (إذا تم تغييره)
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })
      
      if (emailExists) {
        return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 400 })
      }
    }

    // إعداد البيانات للتحديث
    const updateData: Prisma.UserUpdateInput = {
      name,
      email,
      phone: phone || null
    }

    // إذا كان المستخدم يريد تغيير كلمة المرور
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'كلمة المرور الحالية مطلوبة' }, { status: 400 })
      }

      // التحقق من وجود كلمة مرور مشفرة
      if (!existingUser.password) {
        return NextResponse.json({ error: 'لا يمكن تغيير كلمة المرور لهذا الحساب' }, { status: 400 })
      }

      // التحقق من كلمة المرور الحالية
      const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 })
      }

      // التحقق من قوة كلمة المرور الجديدة
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
      }

      // تشفير كلمة المرور الجديدة
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'تم تحديث البيانات بنجاح',
      user: updatedUser
    })

  } catch (error) {
    console.error('خطأ في تحديث بيانات المستخدم:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
} 