import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // البحث عن رصيد المستخدم أو إنشاء واحد جديد
    let userCoins = await prisma.userCoins.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCoins) {
      userCoins = await prisma.userCoins.create({
        data: {
          userId: session.user.id,
          balance: 100, // كوينز مجانية للمستخدمين الجدد
          totalEarned: 100
        }
      });

      // إضافة معاملة للكوينز المجانية
      await prisma.coinTransaction.create({
        data: {
          userId: session.user.id,
          type: 'BONUS',
          amount: 100,
          reason: 'مكافأة التسجيل',
          description: 'كوينز مجانية للمستخدمين الجدد',
          balanceBefore: 0,
          balanceAfter: 100
        }
      });
    }

    return NextResponse.json({
      success: true,
      balance: userCoins.balance,
      totalEarned: userCoins.totalEarned,
      totalSpent: userCoins.totalSpent
    });

  } catch (error) {
    console.error('Coins Balance Error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في جلب رصيد الكوينز' 
    }, { status: 500 });
  }
} 