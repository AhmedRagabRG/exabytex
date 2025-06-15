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
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (KASHIER_CONFIG.isTestMode) {
    return 'https://test-payments.example.com';
  }
  
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://exabytex.com';
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
  return `LEG-${timestamp}-${random}`;
}

function sanitizeString(str: string): string {
  return str.replace(/[<>\"'&]/g, '').trim().substring(0, 100);
}

function formatPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').substring(0, 15);
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
    
    console.log('=== Legacy Payment Currency Conversion ===');
    console.log('Original:', currencyConversion.originalAmount, currencyConversion.originalCurrency);
    console.log('For Kashier:', currencyConversion.kashierAmount, currencyConversion.kashierCurrency);
    if (currencyConversion.exchangeRate) {
      console.log('Exchange Rate:', currencyConversion.exchangeRate);
    }
    console.log('==========================================');
    
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

    // بناء البيانات حسب مواصفات كاشير Legacy Payment UI
    const paymentData = {
      merchantId: KASHIER_CONFIG.merchantId,
      apiKey: KASHIER_CONFIG.apiKey,
      amount: amount.toString(),
      currency: 'EGP',
      orderId: orderId,
      hash: '',
      success: encodeURI(`${baseUrl}/payment/success?orderId=${orderId}`),
      failure: encodeURI(`${baseUrl}/payment/failure?orderId=${orderId}`),
      back: encodeURI(`${baseUrl}/checkout`),
      webhookUrl: encodeURI(`${baseUrl}/api/kashier/webhook`),
      method: 'CARD',
      reference: orderId,
      description: sanitizeString(`منتجات رقمية - طلب رقم ${orderId}`),
      display_currency: 'EGP',
      mode: KASHIER_CONFIG.isTestMode ? 'test' : 'live'
    };

    // إنشاء hash حسب مواصفات كاشير
    const hashString = `${paymentData.merchantId}${paymentData.orderId}${paymentData.amount}${paymentData.currency}${KASHIER_CONFIG.secretKey}`;
    paymentData.hash = createHash(hashString);

    // تحويل البيانات إلى URLSearchParams للـ Legacy UI
    const urlParams = new URLSearchParams();
    urlParams.append('merchantId', paymentData.merchantId);
    urlParams.append('apiKey', paymentData.apiKey);
    urlParams.append('amount', paymentData.amount);
    urlParams.append('currency', paymentData.currency);
    urlParams.append('orderId', paymentData.orderId);
    urlParams.append('hash', paymentData.hash);
    urlParams.append('success', paymentData.success);
    urlParams.append('failure', paymentData.failure);
    urlParams.append('back', paymentData.back);
    urlParams.append('webhookUrl', paymentData.webhookUrl);
    urlParams.append('method', paymentData.method);
    urlParams.append('reference', paymentData.reference);
    urlParams.append('description', paymentData.description);
    urlParams.append('display_currency', paymentData.display_currency);
    urlParams.append('mode', paymentData.mode);
    
    // إضافة بيانات العميل
    Object.entries(cleanCustomer).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        urlParams.append(`customer[${key}]`, value.toString().trim());
      }
    });

    // إضافة بيانات إضافية مطلوبة لكاشير Legacy UI
    urlParams.append('payment_type', 'card');
    urlParams.append('shop_name', 'AI Agency Store');
    urlParams.append('shop_logo', '');
    urlParams.append('shop_url', baseUrl);
    
    // إضافة معاملات واجهة المستخدم
    urlParams.append('lang', 'ar'); // اللغة العربية
    urlParams.append('theme', 'light'); // المظهر الفاتح
    urlParams.append('ui_mode', 'embedded'); // الواجهة المدمجة

    // استخدام URL الصحيح لكاشير Legacy Payment
    const kashierPaymentUrl = `https://checkout.kashier.io/?${urlParams.toString()}`;

    console.log('=== Kashier Legacy Payment Created ===');
    console.log('Order ID:', paymentData.orderId);
    console.log('Amount:', paymentData.amount);
    console.log('Base URL:', baseUrl);
    console.log('Success URL:', paymentData.success);
    console.log('Failure URL:', paymentData.failure);
    console.log('Customer Email:', cleanCustomer.email);
    console.log('Customer Phone:', cleanCustomer.phone);
    console.log('Mode:', paymentData.mode);
    console.log('UI Mode: Legacy');
    console.log('URL Length:', kashierPaymentUrl.length);
    console.log('=====================================');

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentUrl: kashierPaymentUrl,
      currencyConversion: currencyConversion,
      method: 'legacy_ui',
      debug: {
        merchantId: paymentData.merchantId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        mode: paymentData.mode,
        uiMode: 'legacy',
        customerEmail: cleanCustomer.email,
        originalAmount: currencyConversion.originalAmount,
        convertedAmount: currencyConversion.kashierAmount,
        exchangeRate: currencyConversion.exchangeRate
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء Legacy Payment:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إنشاء صفحة الدفع التقليدية',
      paymentUrl: '#',
      orderId: generateOrderId(),
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  const baseUrl = getBaseUrl();
  
  return NextResponse.json({
    message: 'Kashier Legacy Payment UI API Status',
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
    features: [
      '🎨 Legacy Payment UI',
      '🌍 واجهة عربية تقليدية', 
      '💳 دعم جميع البطاقات الائتمانية',
      '🔒 آمان وتشفير كامل',
      '📱 متوافق مع الموبايل',
      '⚡ تحميل سريع'
    ],
    advantages: [
      '🖥️ واجهة مستخدم مألوفة',
      '🎯 تركيز على الدفع فقط', 
      '📋 عرض تفاصيل واضحة',
      '🔧 تخصيص محدود لكن مستقر',
      '⏰ اختبار مجرب عبر السنين',
      '🌐 دعم متعدد اللغات'
    ],
    instructions: !KASHIER_CONFIG.merchantId ? 
      'Add Kashier credentials to .env.local file to enable legacy payment UI' : 
      'Configuration complete! Ready for legacy payment interface.',
    note: baseUrl.includes('localhost') ? 
      '⚠️ Using localhost URLs - Kashier may reject these. Consider using ngrok or a real domain.' :
      '✅ Using valid domain URLs',
    uiFeatures: {
      theme: 'light/dark support',
      language: 'Arabic/English',
      layout: 'responsive design',
      branding: 'merchant logo support',
      customization: 'limited but stable'
    }
  });
} 