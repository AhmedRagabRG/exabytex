import { NextRequest, NextResponse } from 'next/server';

// إنشاء معرف فريد للطلب
function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد عناصر في الطلب' },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();
    
    const order = {
      id: orderId,
      status: orderData.paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'pending',
      items: orderData.items,
      customer: orderData.customer,
      totals: orderData.totals,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3-5 أيام عمل'
    };

    console.log('Order created:', order);

    return NextResponse.json({
      success: true,
      orderId: orderId,
      order: {
        id: order.id,
        status: order.status,
        total: order.totals.total,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الطلب' },
      { status: 500 }
    );
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