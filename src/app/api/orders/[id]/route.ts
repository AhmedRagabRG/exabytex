import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching order details:', params.id);
    
    const session = await getServerSession(authOptions);
    console.log('Auth session:', session ? 'Found' : 'Not found');
    
    if (!session?.user) {
      console.log('Auth error: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // جلب الطلب مع تفاصيل المنتجات
    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
        userId: session.user.id // التأكد من أن الطلب يخص المستخدم الحالي
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                description: true,
                image: true,
                downloadUrl: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      console.log('Order not found:', params.id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order found:', order.id);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 