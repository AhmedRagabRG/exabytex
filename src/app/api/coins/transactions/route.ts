import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Session } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(type && { type })
    };

    const [transactions, totalCount] = await Promise.all([
      prisma.coinTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          amount: true,
          reason: true,
          description: true,
          balanceBefore: true,
          balanceAfter: true,
          createdAt: true
        }
      }),
      prisma.coinTransaction.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Transactions Error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في جلب المعاملات' 
    }, { status: 500 });
  }
} 