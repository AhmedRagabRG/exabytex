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
  // للإنتاج أو التطوير، استخدم domain حقيقي دائماً لكاشير
  // لأن كاشير يرفض localhost URLs
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // إذا كان localhost أو مفقود، استخدم domain الإنتاج لكاشير
  return 'https://exabytex.com';
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
  // استخدام نفس format الـ OrderID اللي شغال في المثال
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `test${timestamp}${random}`;
}

function sanitizeString(str: string): string {
  return str.replace(/[<>\"'&]/g, '').trim().substring(0, 100);
}

function formatPhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').substring(0, 15);
}

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      console.log('=== Kashier Payment Request Started ===');
      console.log('Request method:', request.method);
      console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    }
    
    const orderData: OrderData = await request.json();
    
    if (isDev) {
      console.log('Order data received:', { 
        itemsCount: orderData.items?.length, 
        customerEmail: orderData.customer?.email,
        total: orderData.totals?.total 
      });
    }
    
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
    
    if (isDev) {
      console.log('=== HPP Currency Conversion ===');
      console.log('Original:', currencyConversion.originalAmount, currencyConversion.originalCurrency);
      console.log('For Kashier:', currencyConversion.kashierAmount, currencyConversion.kashierCurrency);
      if (currencyConversion.exchangeRate) {
        console.log('Exchange Rate:', currencyConversion.exchangeRate);
      }
      console.log('===============================');
    }
    
    const baseUrl = getBaseUrl();
    
    // التأكد من أن الـ URLs صحيحة وليست localhost
    if (isDev) {
      console.log('=== URL Validation ===');
      console.log('Base URL:', baseUrl);
      console.log('Is valid for Kashier:', !baseUrl.includes('localhost') && baseUrl.startsWith('https://'));
      console.log('======================');
    }
    
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

    // إعداد البيانات للـ API call
    // كاشير يتطلب المبلغ بدون decimal places للـ EGP
    const formattedAmount = Math.round(amount * 100) / 100; // تنسيق المبلغ
    const paymentData = {
      merchantId: KASHIER_CONFIG.merchantId,
      orderId: orderId,
      amount: formattedAmount.toFixed(2), // تأكد من format صحيح
      currency: 'EGP',
      hash: '',
      customer: cleanCustomer,
      redirectUrl: `${baseUrl}/payment/success`,
      failureUrl: `${baseUrl}/payment/failure`, 
      cancelUrl: `${baseUrl}/`,
      webhookUrl: `${baseUrl}/api/kashier/webhook`,
      description: sanitizeString(`منتجات رقمية - طلب رقم ${orderId}`),
      reference: orderId,
      mode: KASHIER_CONFIG.isTestMode ? 'test' : 'live'
    };

    // إنشاء hash حسب مواصفات كاشير الصحيحة
    // الترتيب المطلوب: merchantId + orderId + amount + currency + secretKey
    const hashString = `${paymentData.merchantId}${paymentData.orderId}${paymentData.amount}${paymentData.currency}${KASHIER_CONFIG.secretKey}`;
    paymentData.hash = createHash(hashString);
    
    if (isDev) {
      console.log('=== Hash Calculation Debug ===');
      console.log('Hash String:', hashString);
      console.log('Generated Hash:', paymentData.hash);
      console.log('Components:', {
        merchantId: paymentData.merchantId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        secretKey: KASHIER_CONFIG.secretKey ? 'SET' : 'MISSING'
      });
      console.log('==============================');
    }

    // استخدام الـ parameters الصحيحة حسب الـ URL الشغال
    const urlParams = new URLSearchParams();
    urlParams.append('merchantId', paymentData.merchantId);
    urlParams.append('mode', paymentData.mode);
    urlParams.append('orderId', paymentData.orderId);
    urlParams.append('amount', paymentData.amount);
    urlParams.append('currency', paymentData.currency);
    urlParams.append('hash', paymentData.hash);
    urlParams.append('allowedMethods', ''); // فارغ يعني جميع الطرق
    urlParams.append('merchantRedirect', paymentData.redirectUrl);
    urlParams.append('failureRedirect', 'merchantRedirect'); // استخدام نفس القيمة الشغالة
    urlParams.append('redirectMethod', 'get');
    
    // إضافة brandColor بدون encoding إضافي (URLSearchParams يعمل encoding تلقائي)
    urlParams.append('brandColor', '#9b5f5f'); // بدون % encoding
    urlParams.append('display', 'en');
    
    // حذف description و reference لأنها مش موجودة في الـ URL الشغال

    const kashierPaymentUrl = `https://payments.kashier.io/?${urlParams.toString()}`;
    
    if (isDev) {
      console.log('=== Kashier URL Payment Created ===');
      console.log('Payment URL:', kashierPaymentUrl);
      console.log('Order ID:', paymentData.orderId);
      console.log('Amount:', paymentData.amount);
      console.log('Success URL:', paymentData.redirectUrl);
      console.log('Failure URL:', paymentData.failureUrl);
      console.log('Customer Email:', cleanCustomer.email);
      console.log('Mode:', paymentData.mode);
      console.log('===================================');
    }

    const response = NextResponse.json({
      success: true,
      orderId: orderId,
      paymentUrl: kashierPaymentUrl,
      currencyConversion: currencyConversion,
      method: 'url_based',
      debug: {
        merchantId: paymentData.merchantId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        mode: paymentData.mode,
        customerEmail: cleanCustomer.email,
        originalAmount: currencyConversion.originalAmount,
        convertedAmount: currencyConversion.kashierAmount,
        exchangeRate: currencyConversion.exchangeRate,
        urls: {
          success: paymentData.redirectUrl,
          failure: paymentData.failureUrl,
          cancel: paymentData.cancelUrl,
          webhook: paymentData.webhookUrl
        }
      }
    });
    
    // إضافة CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;

  } catch (error) {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      console.error('=== Kashier Payment Error ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('============================');
    } else {
      // في الإنتاج، اطبع خطأ مبسط فقط
      console.error('Kashier payment error:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // التحقق من نوع الخطأ
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json({
        success: false,
        error: 'بيانات الطلب غير صحيحة - تحقق من تنسيق البيانات',
        paymentUrl: '#',
        orderId: generateOrderId(),
        errorDetails: 'Invalid JSON format'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إنشاء صفحة الدفع المستضافة',
      paymentUrl: '#',
      orderId: generateOrderId(),
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  const baseUrl = getBaseUrl();
  
  return NextResponse.json({
    message: 'Kashier Hosted Payment Page API Status',
    status: 'Active',
    config: {
      merchantId: KASHIER_CONFIG.merchantId ? 'SET ✅' : 'NOT_SET ❌',
      apiKey: KASHIER_CONFIG.apiKey ? 'SET ✅' : 'NOT_SET ❌',
      secretKey: KASHIER_CONFIG.secretKey ? 'SET ✅' : 'NOT_SET ❌',
      isTestMode: KASHIER_CONFIG.isTestMode,
      paymentsUrl: 'https://payments.kashier.io',
      baseUrl: baseUrl
    },
    urls: {
      success: `${baseUrl}/payment/success`,
      failure: `${baseUrl}/payment/failure`,
      cancel: `${baseUrl}/checkout`,
      webhook: `${baseUrl}/api/kashier/webhook`
    },
    features: [
      '✅ URL-Based Payment Integration',
      '✅ Multiple Payment Methods (Card, Wallet, Installments)', 
      '✅ Currency Conversion Support',
      '✅ Direct Kashier Checkout',
      '✅ Arabic Interface',
      '✅ Secure Hash Verification'
    ],
    advantages: [
      '🚀 طريقة رسمية معتمدة من كاشير',
      '🔒 أكثر أماناً واستقراراً', 
      '💳 دعم جميع طرق الدفع',
      '🌍 واجهة عربية كاملة',
      '📱 متوافق مع الموبايل',
      '⚡ لا يحتاج API calls معقدة'
    ],
    instructions: !KASHIER_CONFIG.merchantId ? 
      'Add Kashier credentials to .env.local file to enable hosted payment pages' : 
      'Configuration complete! Ready for hosted payment pages.',
    note: baseUrl.includes('localhost') ? 
      '⚠️ Using localhost URLs - Kashier may reject these. Consider using ngrok or a real domain.' :
      '✅ Using valid domain URLs'
  });
} 