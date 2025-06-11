import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAmountForKashier } from '@/lib/currency';

const KASHIER_CONFIG = {
  merchantId: process.env.KASHIER_MERCHANT_ID || '',
  apiKey: process.env.KASHIER_API_KEY || '',
  secretKey: process.env.KASHIER_SECRET_KEY || '',
  isTestMode: process.env.KASHIER_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
};

// إنشاء URLs صحيحة لكاشير
function getBaseUrl(): string {
  // إذا كان هناك BASE_URL محدد، استخدمه
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // للاختبار، استخدم URLs وهمية صحيحة
  if (KASHIER_CONFIG.isTestMode) {
    return 'https://example.com';
  }
  
  // للإنتاج، يجب أن يكون domain حقيقي
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';
}

interface OrderData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  totals: {
    total: number;
  };
}

function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`;
}

// تنظيف وتنسيق البيانات لكاشير
function sanitizeString(str: string): string {
  return str.replace(/[^\w\s-_.@]/g, '').trim();
}

function formatPhone(phone: string): string {
  // تنسيق رقم الهاتف المصري
  let cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.startsWith('201')) {
    cleanPhone = '+' + cleanPhone;
  } else if (cleanPhone.startsWith('01')) {
    cleanPhone = '+2' + cleanPhone;
  }
  return cleanPhone;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();
    
    // التحقق من إعدادات Kashier
    if (!KASHIER_CONFIG.merchantId || !KASHIER_CONFIG.apiKey || !KASHIER_CONFIG.secretKey) {
      console.error('Missing Kashier configuration');
      return NextResponse.json({
        success: false,
        error: 'إعدادات كاشير غير مكتملة. يرجى إضافة بيانات كاشير في ملف .env.local',
        paymentUrl: '#',
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
    
    console.log('=== Currency Conversion ===');
    console.log('Original:', currencyConversion.originalAmount, currencyConversion.originalCurrency);
    console.log('For Kashier:', currencyConversion.kashierAmount, currencyConversion.kashierCurrency);
    if (currencyConversion.exchangeRate) {
      console.log('Exchange Rate:', currencyConversion.exchangeRate);
    }
    console.log('===========================');
    
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

    // بناء البيانات حسب مواصفات كاشير مع URLs صحيحة
    const paymentData = {
      merchantId: KASHIER_CONFIG.merchantId,
      apiKey: KASHIER_CONFIG.apiKey,
      amount: amount,
      currency: 'EGP',
      orderId: orderId,
      hash: '',
      success: `${baseUrl}/payment/success?orderId=${orderId}`,
      failure: `${baseUrl}/payment/failure?orderId=${orderId}`,
      back: `${baseUrl}/checkout`,
      webhookUrl: `${baseUrl}/api/kashier/webhook`,
      method: 'CARD',
      reference: orderId,
      description: sanitizeString(`منتجات رقمية - طلب رقم ${orderId}`),
      display_currency: 'EGP',
      mode: KASHIER_CONFIG.isTestMode ? 'test' : 'live'
    };

    // إنشاء hash حسب مواصفات كاشير
    const hashString = `${paymentData.merchantId}${paymentData.orderId}${paymentData.amount}${paymentData.currency}${KASHIER_CONFIG.secretKey}`;
    paymentData.hash = createHash(hashString);

    // بناء form data مع جميع البيانات المطلوبة
    const formData = new FormData();
    
    // البيانات الأساسية
    formData.append('merchantId', paymentData.merchantId);
    formData.append('apiKey', paymentData.apiKey);
    formData.append('amount', paymentData.amount.toString());
    formData.append('currency', paymentData.currency);
    formData.append('orderId', paymentData.orderId);
    formData.append('hash', paymentData.hash);
    formData.append('success', paymentData.success);
    formData.append('failure', paymentData.failure);
    formData.append('back', paymentData.back);
    formData.append('webhookUrl', paymentData.webhookUrl);
    formData.append('method', paymentData.method);
    formData.append('reference', paymentData.reference);
    formData.append('description', paymentData.description);
    formData.append('display_currency', paymentData.display_currency);
    formData.append('mode', paymentData.mode);
    
    // بيانات العميل
    Object.entries(cleanCustomer).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        formData.append(`customer[${key}]`, value.toString().trim());
      }
    });

    // إضافة بيانات إضافية مطلوبة لكاشير
    formData.append('payment_type', 'card');
    formData.append('shop_name', 'AI Agency Store');
    formData.append('shop_logo', '');
    formData.append('shop_url', baseUrl);

    // تحويل FormData إلى URLSearchParams للـ GET request
    const urlParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      urlParams.append(key, value.toString());
    }

    // استخدام URL الصحيح لكاشير
    const kashierPaymentUrl = `https://checkout.kashier.io/?${urlParams.toString()}`;

    console.log('=== Kashier Payment Created ===');
    console.log('Order ID:', paymentData.orderId);
    console.log('Amount:', paymentData.amount);
    console.log('Base URL:', baseUrl);
    console.log('Success URL:', paymentData.success);
    console.log('Failure URL:', paymentData.failure);
    console.log('Customer Email:', cleanCustomer.email);
    console.log('Customer Phone:', cleanCustomer.phone);
    console.log('Mode:', paymentData.mode);
    console.log('URL Length:', kashierPaymentUrl.length);
    console.log('==============================');

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentUrl: kashierPaymentUrl,
      currencyConversion: currencyConversion,
      debug: {
        merchantId: paymentData.merchantId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        mode: paymentData.mode,
        baseUrl: baseUrl,
        successUrl: paymentData.success,
        failureUrl: paymentData.failure,
        customerData: cleanCustomer,
        hashGenerated: !!paymentData.hash,
        urlLength: kashierPaymentUrl.length,
        originalAmount: currencyConversion.originalAmount,
        convertedAmount: currencyConversion.kashierAmount,
        exchangeRate: currencyConversion.exchangeRate
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء الدفع:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إنشاء جلسة الدفع',
      paymentUrl: '#',
      orderId: generateOrderId(),
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  const baseUrl = getBaseUrl();
  
  return NextResponse.json({
    message: 'Kashier Payment API Status',
    status: 'Active',
    config: {
      merchantId: KASHIER_CONFIG.merchantId ? 'SET ✅' : 'NOT_SET ❌',
      apiKey: KASHIER_CONFIG.apiKey ? 'SET ✅' : 'NOT_SET ❌',
      secretKey: KASHIER_CONFIG.secretKey ? 'SET ✅' : 'NOT_SET ❌',
      isTestMode: KASHIER_CONFIG.isTestMode,
      checkoutUrl: 'https://checkout.kashier.io',
      baseUrl: baseUrl
    },
    urls: {
      success: `${baseUrl}/payment/success`,
      failure: `${baseUrl}/payment/failure`,
      back: `${baseUrl}/checkout`,
      webhook: `${baseUrl}/api/kashier/webhook`
    },
    instructions: !KASHIER_CONFIG.merchantId ? 
      'Add Kashier credentials to .env.local file to enable payments' : 
      'Configuration complete! Ready for payments.',
    note: baseUrl.includes('localhost') ? 
      '⚠️ Using localhost URLs - Kashier may reject these. Consider using ngrok or a real domain.' :
      '✅ Using valid domain URLs',
    troubleshooting: {
      commonIssues: [
        'تأكد من صحة بيانات كاشير في .env.local',
        'تأكد من تفعيل حساب كاشير',
        'تحقق من أن Merchant ID يبدأ بـ MID-',
        'تأكد من تفعيل Card Payments في كاشير',
        'استخدم domain حقيقي بدلاً من localhost للإنتاج'
      ]
    }
  });
}
