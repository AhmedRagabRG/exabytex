import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendProductPurchaseEmail } from '@/lib/email';

const prisma = new PrismaClient();

// إنشاء معرف فريد للطلب
function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`;
}

export async function POST(req: Request) {
  try {
    console.log('Creating order: Starting...');
    
    const session = await getServerSession(authOptions);
    console.log('Auth session:', session ? 'Found' : 'Not found');
    
    if (!session?.user?.email) {
      console.log('Auth error: No session or user email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    console.log('📝 User from database:', user);

    if (!user) {
      console.log('Error: User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    console.log('Received order data:', body);

    // التحقق من أن الطلب مجاني
    if (!body.isFree || body.totals.total !== 0) {
      console.log('Invalid free order request');
      return NextResponse.json({ error: 'Invalid free order request' }, { status: 400 });
    }

    // التحقق من وجود المنتجات وجمع معلوماتها
    const products = [];
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id }
      });
      
      if (!product) {
        console.log(`Product not found: ${item.id}`);
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 404 });
      }
      
      products.push(product);
    }

    // إنشاء الطلب في قاعدة البيانات
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'COMPLETED', // الطلبات المجانية تكون مكتملة مباشرة
        total: 0,
        isFree: true,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: 0 // السعر 0 للمنتجات المجانية
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // تحديث عداد استخدام كود الخصم إذا تم استخدامه
    if (body.promoCode) {
      await prisma.promoCode.update({
        where: { code: body.promoCode.code },
        data: {
          usedCount: {
            increment: 1
          }
        }
      });
      console.log(`Updated promo code usage count for: ${body.promoCode.code}`);
    }

    console.log('Free order created successfully:', order.id);

    // إرسال بريد إلكتروني لكل منتج في الطلب
    try {
      for (const orderItem of order.items) {
        const product = orderItem.product;
        if (product.downloadUrl) {
          await sendProductPurchaseEmail({
            email: user.email,
            productName: product.title,
            orderId: order.id,
            downloadUrl: product.downloadUrl || '',
            customSubject: product.emailSubject || undefined,
            customContent: product.emailContent || undefined
          });
          console.log(`Email sent for product: ${product.title}`);
        }
      }
    } catch (emailError) {
      console.error('Error sending order emails:', emailError);
      // نستمر في العملية حتى لو فشل إرسال البريد الإلكتروني
    }

    // حذف المنتجات من السلة بعد إتمام الطلب بنجاح
    try {
      await prisma.cartItem.deleteMany({
        where: {
          userId: user.id,
          productId: {
            in: body.items.map((item: any) => item.id)
          }
        }
      });
      console.log('Cart items removed successfully');

      // حذف الكوبون المطبق من localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appliedPromo');
      }
    } catch (cartError) {
      console.error('Error clearing cart items:', cartError);
      // نستمر في العملية حتى لو فشل حذف عناصر السلة
    }

    return NextResponse.json({ 
      success: true,
      orderId: order.id,
      order: order
    });
  } catch (error) {
    console.error('Error creating free order:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Orders API',
    endpoints: {
      'POST /api/orders/create': 'Create new order',
      'GET /api/orders/[id]': 'Get order by ID',
      'GET /api/orders': 'List all orders'
    }
  });
} 