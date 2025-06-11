import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as Session
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لتحديث الكوبونات' }, { status: 403 })
    }

    const { code, description, discountType, discountValue, minimumAmount, maxUses, expiresAt } = await request.json()
    const resolvedParams = await params

    // التحقق من وجود الكوبون
    const existingPromo = await prisma.promoCode.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingPromo) {
      return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 })
    }

    // التحقق من عدم تضارب الرمز مع كوبون آخر
    if (code && code.toUpperCase() !== existingPromo.code) {
      const duplicatePromo = await prisma.promoCode.findUnique({
        where: { code: code.toUpperCase() }
      })

      if (duplicatePromo) {
        return NextResponse.json({ error: 'هذا الرمز مستخدم بالفعل' }, { status: 400 })
      }
    }

    const updatedPromo = await prisma.promoCode.update({
      where: { id: resolvedParams.id },
      data: {
        code: code ? code.toUpperCase() : existingPromo.code,
        description: description || existingPromo.description,
        discountType: discountType || existingPromo.discountType,
        discountValue: discountValue ? parseFloat(discountValue) : existingPromo.discountValue,
        minimumAmount: minimumAmount ? parseFloat(minimumAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        updatedAt: new Date()
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedPromo)
  } catch (error) {
    console.error('Error updating promo code:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as Session
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لحذف الكوبونات' }, { status: 403 })
    }

    const resolvedParams = await params

    // التحقق من وجود الكوبون
    const existingPromo = await prisma.promoCode.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingPromo) {
      return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 })
    }

    // حذف الكوبون نهائياً (أو يمكن تعطيله بدلاً من ذلك)
    await prisma.promoCode.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'تم حذف الكوبون بنجاح' })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
} 