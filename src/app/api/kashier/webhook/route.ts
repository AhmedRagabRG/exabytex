import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendProductPurchaseEmail } from '@/lib/email';

// إعدادات Kashier
const KASHIER_CONFIG = {
  secretKey: process.env.KASHIER_SECRET_KEY || '',
};

interface KashierWebhookData {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  status: string;
  transactionId?: string;
  hash?: string;
  signature?: string;
  [key: string]: any;
}

// التحقق من صحة التوقيع
function verifySignature(data: KashierWebhookData, receivedSignature: string): boolean {
  const signatureString = `${data.merchantId}${data.orderId}${data.amount}${data.currency}${KASHIER_CONFIG.secretKey}`;
  const expectedSignature = crypto.createHmac('sha256', KASHIER_CONFIG.secretKey)
    .update(signatureString)
    .digest('hex');
  
  return expectedSignature === receivedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json() as KashierWebhookData;
    console.log('Kashier webhook received:', webhookData);

    const orderId = webhookData.orderId || webhookData.order_id;
    const status = webhookData.status;
    const transactionId = webhookData.transactionId || webhookData.transaction_id;

    // التحقق من صحة التوقيع
    const signature = webhookData.hash || webhookData.signature || '';
    if (!verifySignature(webhookData, signature)) {
      console.error('Invalid signature in webhook');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        console.log(`Payment successful for order ${orderId}, transaction: ${transactionId}`);
        
        try {
          // جلب معلومات الطلب
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
              items: {
                include: {
                  product: true
                }
              },
              user: true
            }
          });

          if (!order || !order.user) {
            throw new Error('Order or user not found');
          }

          // تحديث حالة الطلب إلى "مكتمل"
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'COMPLETED',
            }
          });

          // إرسال بريد إلكتروني لكل منتج
          for (const item of order.items) {
            if (item.product.downloadUrl) {
              await sendProductPurchaseEmail({
                email: order.user.email,
                productName: item.product.title,
                orderId: order.id,
                downloadUrl: item.product.downloadUrl || '',
                customSubject: item.product.emailSubject || undefined,
                customContent: item.product.emailContent || undefined
              });
            }
          }

          // حذف المنتجات من السلة
          await prisma.cartItem.deleteMany({
            where: {
              userId: order.user.id,
              productId: {
                in: order.items.map(item => item.productId)
              }
            }
          });

          console.log(`Order ${orderId} processed successfully`);
        } catch (error) {
          console.error('Error processing successful payment:', error);
        }
        break;
        
      case 'FAILED':
      case 'CANCELLED':
        console.log(`Payment failed for order ${orderId}`);
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' }
        });
        break;
        
      case 'PENDING':
        console.log(`Payment pending for order ${orderId}`);
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PENDING' }
        });
        break;
        
      default:
        console.log(`Unknown payment status: ${status} for order ${orderId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      orderId: orderId,
      status: status
    });

  } catch (error) {
    console.error('خطأ في معالجة webhook:', error);
    return NextResponse.json(
      { error: 'خطأ في معالجة webhook' },
      { status: 500 }
    );
  }
}

// للتعامل مع GET requests (للاختبار)
export async function GET() {
  return NextResponse.json({
    message: 'Kashier Webhook Endpoint',
    timestamp: new Date().toISOString()
  });
} 