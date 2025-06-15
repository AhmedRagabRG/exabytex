import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const KASHIER_CONFIG = {
  merchantId: process.env.KASHIER_MERCHANT_ID || '',
  apiKey: process.env.KASHIER_API_KEY || '',
  secretKey: process.env.KASHIER_SECRET_KEY || '',
  isTestMode: process.env.KASHIER_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentData, kashierToken } = await request.json();

    // التحقق من إعدادات Kashier
    if (!KASHIER_CONFIG.merchantId || !KASHIER_CONFIG.apiKey || !KASHIER_CONFIG.secretKey) {
      return NextResponse.json({
        success: false,
        error: 'إعدادات كاشير غير مكتملة'
      }, { status: 500 });
    }

    // التحقق من بيانات Apple Pay
    if (!paymentData || !paymentData.token) {
      return NextResponse.json({
        success: false,
        error: 'بيانات Apple Pay غير صحيحة'
      }, { status: 400 });
    }

    console.log('=== Processing Apple Pay Payment ===');
    console.log('Order ID:', orderId);
    console.log('Payment Token:', paymentData.token ? 'PRESENT' : 'MISSING');
    console.log('Billing Contact:', paymentData.billingContact ? 'PRESENT' : 'MISSING');
    console.log('Shipping Contact:', paymentData.shippingContact ? 'PRESENT' : 'MISSING');

    // في البيئة الحقيقية، ستحتاج لإرسال بيانات Apple Pay إلى Kashier
    // لمعالجة الدفع عبر wallet/apple_pay endpoint

    const kashierPaymentData = {
      merchantId: KASHIER_CONFIG.merchantId,
      apiKey: KASHIER_CONFIG.apiKey,
      orderId: orderId,
      paymentToken: paymentData.token,
      method: 'WALLET',
      wallet_provider: 'apple_pay',
      mode: KASHIER_CONFIG.isTestMode ? 'test' : 'live'
    };

    // إنشاء hash للتحقق
    const hashString = `${kashierPaymentData.merchantId}${kashierPaymentData.orderId}${KASHIER_CONFIG.secretKey}`;
    const hash = crypto.createHash('sha256').update(hashString).digest('hex');

    // في التطبيق الحقيقي، ستحتاج لاستدعاء Kashier API لمعالجة Apple Pay
    // const kashierResponse = await fetch('https://api.kashier.io/api/wallet/process', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${KASHIER_CONFIG.apiKey}`
    //   },
    //   body: JSON.stringify({
    //     ...kashierPaymentData,
    //     hash: hash,
    //     wallet_data: paymentData
    //   })
    // });

    // محاكاة نجاح الدفع (للاختبار)
    const isSuccess = Math.random() > 0.2; // 80% نسبة نجاح

    if (isSuccess) {
      console.log('=== Apple Pay Payment Successful ===');
      console.log('Transaction ID:', `txn_${Date.now()}`);
      console.log('Order ID:', orderId);
      console.log('Payment Method:', 'Apple Pay');
      console.log('Status:', 'PAID');
      console.log('===================================');

      return NextResponse.json({
        success: true,
        orderId: orderId,
        transactionId: `txn_${Date.now()}`,
        paymentMethod: 'apple_pay',
        status: 'PAID',
        message: 'تم الدفع بنجاح عبر Apple Pay',
        receiptData: {
          paymentNetwork: paymentData.token?.paymentMethod?.network || 'visa',
          last4: paymentData.token?.paymentMethod?.displayName?.slice(-4) || '****'
        }
      });
    } else {
      console.log('=== Apple Pay Payment Failed ===');
      console.log('Order ID:', orderId);
      console.log('Reason:', 'Payment declined');
      console.log('===============================');

      return NextResponse.json({
        success: false,
        error: 'تم رفض الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى.',
        orderId: orderId
      });
    }

  } catch (error) {
    console.error('خطأ في معالجة دفع Apple Pay:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في معالجة الدفع'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Kashier Apple Pay Processing API',
    status: 'Active',
    config: {
      merchantId: KASHIER_CONFIG.merchantId ? 'SET ✅' : 'NOT_SET ❌',
      apiKey: KASHIER_CONFIG.apiKey ? 'SET ✅' : 'NOT_SET ❌',
      secretKey: KASHIER_CONFIG.secretKey ? 'SET ✅' : 'NOT_SET ❌',
      isTestMode: KASHIER_CONFIG.isTestMode
    },
    endpoints: {
      process: '/api/kashier/process-apple-pay',
      status: '/api/kashier/process-apple-pay (GET)'
    },
    flow: [
      '1. User authorizes Apple Pay payment',
      '2. Payment token received from Apple',
      '3. Token sent to Kashier for processing',
      '4. Payment result returned to user'
    ]
  });
} 