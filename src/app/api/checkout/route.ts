import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مسموح' }, { status: 401 });
    }

    const body = await request.json();
    const { items, total, paymentMethod = 'CASH_ON_DELIVERY' } = body;

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userCoins: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // فصل منتجات الكوينز عن المنتجات العادية
    const coinProducts = [];
    const regularProducts = [];
    let totalCoinsToAdd = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) continue;

      // التحقق من نوع المنتج
      const metadata = product.metadata ? JSON.parse(product.metadata) : {};
      const isCoinProduct = product.category === 'كوينز' || metadata.type === 'coins';

      if (isCoinProduct) {
        const coinAmount = metadata.coinAmount || parseInt(product.title?.match(/\d+/)?.[0] || '0');
        totalCoinsToAdd += coinAmount * item.quantity;
        coinProducts.push({
          ...item,
          product,
          coinAmount: coinAmount * item.quantity
        });
      } else {
        regularProducts.push({ ...item, product });
      }
    }

    // إنشاء الطلب
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: total,
        status: 'PENDING',
        paymentMethod: paymentMethod,
        shippingAddress: JSON.stringify({
          type: coinProducts.length > 0 ? 'digital' : 'physical',
          note: coinProducts.length > 0 ? `سيتم إضافة ${totalCoinsToAdd} كوين للحساب` : ''
        }),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
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

    // إذا كان الطلب يحتوي على كوينز وتم الدفع (في التطبيق الحقيقي سيكون بعد تأكيد الدفع)
    if (totalCoinsToAdd > 0) {
      // التأكد من وجود حساب كوينز للمستخدم
      let userCoinsAccount = user.userCoins;
      if (!userCoinsAccount) {
        userCoinsAccount = await prisma.userCoins.create({
          data: {
            userId: user.id,
            balance: 0,
            totalEarned: 0,
            totalSpent: 0
          }
        });
      }

      // إضافة الكوينز للحساب
      await prisma.userCoins.update({
        where: { userId: user.id },
        data: {
          balance: { increment: totalCoinsToAdd },
          totalEarned: { increment: totalCoinsToAdd }
        }
      });

      // تسجيل معاملة الكوينز
      await prisma.coinTransaction.create({
        data: {
          userId: user.id,
          type: 'PURCHASE',
          amount: totalCoinsToAdd,
          reason: `شراء كوينز - طلب رقم ${order.id}`,
          balanceAfter: userCoinsAccount.balance + totalCoinsToAdd,
          orderId: order.id
        }
      });

      // تحديث حالة الطلب للكوينز
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'COMPLETED', // الكوينز فورية
          metadata: JSON.stringify({
            coinsAdded: totalCoinsToAdd,
            autoCompleted: true
          })
        }
      });
    }

    // مسح السلة بعد إنشاء الطلب
    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: totalCoinsToAdd > 0 
        ? `تم إنشاء الطلب بنجاح! تم إضافة ${totalCoinsToAdd} كوين لحسابك`
        : 'تم إنشاء الطلب بنجاح',
      coinsAdded: totalCoinsToAdd
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الطلب' },
      { status: 500 }
    );
  }
} 