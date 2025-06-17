import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendProductPurchaseEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { productId } = body

    // جلب المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        price: true,
        downloadUrl: true,
        emailSubject: true,
        emailContent: true,
      },
    })

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    // إنشاء الطلب
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: product.price,
        status: 'PENDING',
        isFree: product.price === 0,
        items: {
          create: {
            productId: product.id,
            price: product.price,
            quantity: 1,
          },
        },
      },
    })

    // إذا كان المنتج مجاني
    if (product.price === 0) {
      // تحديث حالة الطلب
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' },
      })

      // إرسال البريد الإلكتروني
      await sendProductPurchaseEmail({
        email: session.user.email!,
        productName: product.title,
        orderId: order.id,
        downloadUrl: product.downloadUrl || '',
        customSubject: product.emailSubject,
        customContent: product.emailContent,
      })

      // حذف المنتج من السلة بعد إتمام الطلب المجاني بنجاح
      try {
        await prisma.cartItem.deleteMany({
          where: {
            userId: session.user.id,
            productId: product.id
          }
        });
        console.log('Cart item removed successfully');
      } catch (cartError) {
        console.error('Error clearing cart item:', cartError);
        // نستمر في العملية حتى لو فشل حذف عنصر السلة
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        isFree: true,
        redirectUrl: `/payment/success?status=success&order_id=${order.id}&amount=0&currency=EGP&is_free=true`,
      })
    }

    // إذا كان المنتج مدفوع، إنشاء جلسة دفع
    const paymentSession = await prisma.paymentSession.create({
      data: {
        orderId: order.id,
        amount: product.price,
        currency: 'EGP',
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentSessionId: paymentSession.id,
      amount: product.price,
      currency: 'EGP',
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 