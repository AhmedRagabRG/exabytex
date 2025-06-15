import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAmountForKashier } from '@/lib/currency';

const KASHIER_CONFIG = {
  merchantId: process.env.KASHIER_MERCHANT_ID || '',
  apiKey: process.env.KASHIER_API_KEY || '',
  secretKey: process.env.KASHIER_SECRET_KEY || '',
  isTestMode: process.env.KASHIER_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
};

function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function sanitizeString(str: string): string {
  return str ? str.trim().replace(/[<>\"'&]/g, '') : '';
}

function formatPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (KASHIER_CONFIG.isTestMode) {
    return 'https://test-payments.example.com';
  }
  
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://exabytex.com';
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // التحقق من إعدادات Kashier
    if (!KASHIER_CONFIG.merchantId || !KASHIER_CONFIG.apiKey || !KASHIER_CONFIG.secretKey) {
      console.error('Missing Kashier configuration');
      return NextResponse.json({
        success: false,
        error: 'إعدادات كاشير غير مكتملة. يرجى إضافة بيانات كاشير في ملف .env.local',
        orderId: generateOrderId()
      });
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'لا توجد عناصر في الطلب' }, { status: 400 });
    }

    if (!orderData.customer.email || !orderData.customer.phone) {
      return NextResponse.json({ error: 'بيانات العميل غير مكتملة' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const originalAmount = parseFloat(orderData.totals.total.toFixed(2));
    
    // تحويل المبلغ للجنيه المصري للكاشير
    const currencyConversion = await getAmountForKashier(originalAmount);
    const amount = currencyConversion.kashierAmount;
    
    console.log('=== Apple Pay Currency Conversion ===');
    console.log('Original:', currencyConversion.originalAmount, currencyConversion.originalCurrency);
    console.log('For Kashier:', currencyConversion.kashierAmount, currencyConversion.kashierCurrency);
    if (currencyConversion.exchangeRate) {
      console.log('Exchange Rate:', currencyConversion.exchangeRate);
    }
    console.log('====================================');
    
    const baseUrl = getBaseUrl();
    
    // إعداد البيانات المنظفة والمنسقة
    const cleanCustomer = {
      first_name: sanitizeString(orderData.customer.firstName),
      last_name: sanitizeString(orderData.customer.lastName),
      email: orderData.customer.email.trim().toLowerCase(),
      phone: formatPhone(orderData.customer.phone),
      street: 'Digital Products',
      city: 'Cairo',
      state: 'Cairo',
      country: 'EG',
      postal_code: '11111'
    };

    // بناء البيانات حسب مواصفات كاشير مع دعم Apple Pay
    const paymentData = {
      merchantId: KASHIER_CONFIG.merchantId,
      apiKey: KASHIER_CONFIG.apiKey,
      amount: amount,
      currency: 'EGP',
      orderId: orderId,
      hash: '',
      success: encodeURI(`${baseUrl}/payment/success?orderId=${orderId}`),
      failure: encodeURI(`${baseUrl}/payment/failure?orderId=${orderId}`),
      back: encodeURI(`${baseUrl}/checkout`),
      webhookUrl: encodeURI(`${baseUrl}/api/kashier/webhook`),
      method: 'WALLET', // استخدام WALLET للمحافظ الرقمية مثل Apple Pay
      wallet_provider: 'apple_pay', // تحديد نوع المحفظة
      reference: orderId,
      description: sanitizeString(`منتجات رقمية - طلب رقم ${orderId} - Apple Pay`),
      display_currency: 'EGP',
      mode: KASHIER_CONFIG.isTestMode ? 'test' : 'live'
    };

    // إنشاء hash حسب مواصفات كاشير
    const hashString = `${paymentData.merchantId}${paymentData.orderId}${paymentData.amount}${paymentData.currency}${KASHIER_CONFIG.secretKey}`;
    paymentData.hash = createHash(hashString);

    // إنشاء توكن Apple Pay مؤقت للمعالجة
    const applePayToken = crypto.randomBytes(32).toString('hex');

    // حفظ بيانات Apple Pay مؤقتاً (في التطبيق الحقيقي يجب حفظها في قاعدة البيانات)
    // هنا يمكن استخدام Redis أو قاعدة البيانات لحفظ البيانات مؤقتاً

    console.log('=== Apple Pay Payment Created ===');
    console.log('Order ID:', paymentData.orderId);
    console.log('Amount:', paymentData.amount);
    console.log('Payment Method:', paymentData.method);
    console.log('Wallet Provider:', paymentData.wallet_provider);
    console.log('Customer Email:', cleanCustomer.email);
    console.log('Mode:', paymentData.mode);
    console.log('================================');

    return NextResponse.json({
      success: true,
      orderId: paymentData.orderId,
      kashierToken: applePayToken,
      amount: paymentData.amount,
      currency: paymentData.currency,
      currencyConversion,
      paymentMethod: 'apple_pay',
      merchantSession: {
        merchantIdentifier: process.env.APPLE_PAY_MERCHANT_ID || 'merchant.com.exabytex.ai-agency',
        displayName: 'AI Agency Store',
        initiative: 'web',
        initiativeContext: baseUrl
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء دفع Apple Pay:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إنشاء طلب الدفع',
      orderId: generateOrderId()
    }, { status: 500 });
  }
}

export async function GET() {
  const baseUrl = getBaseUrl();
  
  return NextResponse.json({
    message: 'Kashier Apple Pay API Status',
    status: 'Active',
    config: {
      merchantId: KASHIER_CONFIG.merchantId ? 'SET ✅' : 'NOT_SET ❌',
      apiKey: KASHIER_CONFIG.apiKey ? 'SET ✅' : 'NOT_SET ❌',
      secretKey: KASHIER_CONFIG.secretKey ? 'SET ✅' : 'NOT_SET ❌',
      applePayMerchantId: process.env.APPLE_PAY_MERCHANT_ID ? 'SET ✅' : 'NOT_SET ❌',
      isTestMode: KASHIER_CONFIG.isTestMode,
      baseUrl: baseUrl
    },
    supportedMethods: ['apple_pay', 'wallet'],
    instructions: [
      'تأكد من إضافة بيانات كاشير في .env.local',
      'أضف APPLE_PAY_MERCHANT_ID في .env.local',
      'تأكد من تفعيل Apple Pay في حساب كاشير',
      'استخدم domain حقيقي مع شهادة SSL للإنتاج'
    ]
  });
} 