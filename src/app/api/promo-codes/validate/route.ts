import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'رمز الكوبون مطلوب' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { 
        code: code.toUpperCase(),
        isActive: true
      }
    })

    if (!promoCode) {
      return NextResponse.json({ error: 'رمز الكوبون غير صحيح' }, { status: 404 })
    }

    // التحقق من انتهاء الصلاحية
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return NextResponse.json({ error: 'انتهت صلاحية هذا الكوبون' }, { status: 400 })
    }

    // التحقق من الحد الأدنى للمبلغ
    if (promoCode.minimumAmount && cartTotal < promoCode.minimumAmount) {
      return NextResponse.json({ 
        error: `الحد الأدنى للشراء هو ${promoCode.minimumAmount} ر.س` 
      }, { status: 400 })
    }

    // التحقق من عدد مرات الاستخدام
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json({ error: 'تم استنفاد هذا الكوبون' }, { status: 400 })
    }

    // حساب الخصم
    let discountAmount = 0
    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = (cartTotal * promoCode.discountValue) / 100
    } else if (promoCode.discountType === 'FIXED') {
      discountAmount = promoCode.discountValue
    }

    // التأكد من عدم تجاوز الخصم المبلغ الكلي
    discountAmount = Math.min(discountAmount, cartTotal)

    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue
      },
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalTotal: parseFloat((cartTotal - discountAmount).toFixed(2))
    })

  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
} 