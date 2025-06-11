import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(type && { type })
    };

    const [contents, totalCount] = await Promise.all([
      prisma.aIContent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          content: true,
          coinsCost: true,
          wordCount: true,
          language: true,
          isBookmarked: true,
          createdAt: true
        }
      }),
      prisma.aIContent.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      contents,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('AI History Error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في جلب تاريخ المحتوى' 
    }, { status: 500 });
  }
} 