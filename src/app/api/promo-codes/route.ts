import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لعرض الكوبونات' }, { status: 403 })
    }

    const promoCodes = await prisma.promoCode.findMany({
      include: {
        createdBy: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(promoCodes)
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لإنشاء كوبونات' }, { status: 403 })
    }

    const { code, description, discountType, discountValue, minimumAmount, maxUses, expiresAt } = await request.json()

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: 'البيانات الأساسية مطلوبة' }, { status: 400 })
    }

    // التحقق من عدم وجود كوبون بنفس الرمز
    const existingPromo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingPromo) {
      return NextResponse.json({ error: 'هذا الرمز مستخدم بالفعل' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        minimumAmount: minimumAmount ? parseFloat(minimumAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdById: user.id
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

    return NextResponse.json(promoCode, { status: 201 })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
} 