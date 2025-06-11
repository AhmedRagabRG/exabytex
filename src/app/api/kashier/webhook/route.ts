import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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
        // تحديث حالة الطلب إلى "مدفوع"
        // await updateOrderStatus(orderId, 'paid', { transactionId });
        break;
        
      case 'FAILED':
      case 'CANCELLED':
        console.log(`Payment failed for order ${orderId}`);
        // تحديث حالة الطلب إلى "فاشل"
        // await updateOrderStatus(orderId, 'failed');
        break;
        
      case 'PENDING':
        console.log(`Payment pending for order ${orderId}`);
        // تحديث حالة الطلب إلى "معلق"
        // await updateOrderStatus(orderId, 'pending');
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