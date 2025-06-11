import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, reason = 'إضافة كوينز اختبارية' } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'مقدار غير صحيح' }, { status: 400 });
    }

    // البحث عن رصيد المستخدم أو إنشاء واحد جديد
    let userCoins = await prisma.userCoins.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCoins) {
      userCoins = await prisma.userCoins.create({
        data: {
          userId: session.user.id,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0
        }
      });
    }

    // إضافة الكوينز
    const result = await prisma.$transaction(async (tx) => {
      const updatedCoins = await tx.userCoins.update({
        where: { userId: session.user.id },
        data: {
          balance: { increment: amount },
          totalEarned: { increment: amount }
        }
      });

      // إنشاء معاملة
      await tx.coinTransaction.create({
        data: {
          userId: session.user.id,
          type: 'BONUS',
          amount: amount,
          reason: reason,
          description: 'كوينز اختبارية - سيتم تفعيل نظام الدفع قريباً',
          balanceBefore: updatedCoins.balance - amount,
          balanceAfter: updatedCoins.balance
        }
      });

      return updatedCoins;
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الكوينز بنجاح',
      newBalance: result.balance
    });

  } catch (error) {
    console.error('Add Coins Error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في إضافة الكوينز' 
    }, { status: 500 });
  }
} 