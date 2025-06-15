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
  return `HPP-${timestamp}-${random}`;
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
    
    console.log('=== HPP Currency Conversion ===');
    console.log('Original:', currencyConversion.originalAmount, currencyConversion.originalCurrency);
    console.log('For Kashier:', currencyConversion.kashierAmount, currencyConversion.kashierCurrency);
    if (currencyConversion.exchangeRate) {
      console.log('Exchange Rate:', currencyConversion.exchangeRate);
    }
    console.log('===============================');
    
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

    // إعداد البيانات للـ API call
    const paymentData = {
      merchantId: KASHIER_CONFIG.merchantId,
      orderId: orderId,
      amount: amount.toString(),
      currency: 'EGP',
      hash: '',
      customer: cleanCustomer,
      redirectUrl: encodeURI(`${baseUrl}/payment/success?orderId=${orderId}`),
      failureUrl: encodeURI(`${baseUrl}/payment/failure?orderId=${orderId}`),
      cancelUrl: encodeURI(`${baseUrl}/checkout`),
      webhookUrl: encodeURI(`${baseUrl}/api/kashier/webhook`),
      description: sanitizeString(`منتجات رقمية - طلب رقم ${orderId}`),
      reference: orderId,
      mode: KASHIER_CONFIG.isTestMode ? 'test' : 'live'
    };

    // إنشاء hash حسب مواصفات كاشير
    const hashString = `${paymentData.merchantId}${paymentData.orderId}${paymentData.amount}${paymentData.currency}${KASHIER_CONFIG.secretKey}`;
    paymentData.hash = createHash(hashString);

    // استدعاء Kashier API لإنشاء Hosted Payment Page
    const kashierApiUrl = KASHIER_CONFIG.isTestMode 
      ? 'https://checkout.kashier.io/api/v1/hostedPayment'
      : 'https://checkout.kashier.io/api/v1/hostedPayment';

    const requestBody = {
      mid: paymentData.merchantId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      orderId: paymentData.orderId,
      hash: paymentData.hash,
      redirectUrl: paymentData.redirectUrl,
      failureUrl: paymentData.failureUrl,
      cancelUrl: paymentData.cancelUrl,
      webhookUrl: paymentData.webhookUrl,
      description: paymentData.description,
      reference: paymentData.reference,
      customer: paymentData.customer,
      mode: paymentData.mode,
      allowedMethods: ['card', 'wallet', 'bank_installments'], // دعم جميع طرق الدفع
      shopName: 'AI Agency Store',
      shopUrl: baseUrl
    };

    console.log('=== Kashier HPP API Request ===');
    console.log('URL:', kashierApiUrl);
    console.log('Order ID:', paymentData.orderId);
    console.log('Amount:', paymentData.amount);
    console.log('Customer:', cleanCustomer.email);
    console.log('Mode:', paymentData.mode);
    console.log('==============================');

    // إرسال طلب إلى Kashier API
    const kashierResponse = await fetch(kashierApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KASHIER_CONFIG.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!kashierResponse.ok) {
      const errorText = await kashierResponse.text();
      console.error('Kashier API Error:', errorText);
      
      // Fallback إلى URL method إذا فشل الـ API
      const urlParams = new URLSearchParams();
      urlParams.append('merchantId', paymentData.merchantId);
      urlParams.append('apiKey', KASHIER_CONFIG.apiKey);
      urlParams.append('amount', paymentData.amount);
      urlParams.append('currency', paymentData.currency);
      urlParams.append('orderId', paymentData.orderId);
      urlParams.append('hash', paymentData.hash);
      urlParams.append('success', paymentData.redirectUrl);
      urlParams.append('failure', paymentData.failureUrl);
      urlParams.append('back', paymentData.cancelUrl);
      urlParams.append('webhookUrl', paymentData.webhookUrl);
      urlParams.append('description', paymentData.description);
      urlParams.append('reference', paymentData.reference);
      urlParams.append('mode', paymentData.mode);
      
      // إضافة بيانات العميل
      Object.entries(cleanCustomer).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          urlParams.append(`customer[${key}]`, value.toString().trim());
        }
      });

      const fallbackUrl = `https://checkout.kashier.io/?${urlParams.toString()}`;
      
      return NextResponse.json({
        success: true,
        orderId: orderId,
        paymentUrl: fallbackUrl,
        currencyConversion: currencyConversion,
        method: 'url_fallback',
        debug: {
          apiError: errorText,
          fallbackUsed: true,
          originalAmount: currencyConversion.originalAmount,
          convertedAmount: currencyConversion.kashierAmount
        }
      });
    }

    const kashierResult = await kashierResponse.json();
    
    console.log('=== Kashier HPP Response ===');
    console.log('Success:', kashierResult.success || kashierResult.status);
    console.log('Payment URL:', kashierResult.paymentUrl || kashierResult.redirectUrl);
    console.log('Order ID:', orderId);
    console.log('============================');

    if (kashierResult.success || kashierResult.status === 'success' || kashierResult.paymentUrl) {
      const paymentUrl = kashierResult.paymentUrl || 
                        kashierResult.redirectUrl || 
                        kashierResult.checkout_url ||
                        kashierResult.url;

      return NextResponse.json({
        success: true,
        orderId: orderId,
        paymentUrl: paymentUrl,
        currencyConversion: currencyConversion,
        method: 'api',
        kashierResponse: kashierResult,
        debug: {
          merchantId: paymentData.merchantId,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          mode: paymentData.mode,
          customerEmail: cleanCustomer.email,
          originalAmount: currencyConversion.originalAmount,
          convertedAmount: currencyConversion.kashierAmount,
          exchangeRate: currencyConversion.exchangeRate
        }
      });
    } else {
      throw new Error(kashierResult.message || kashierResult.error || 'Failed to create hosted payment page');
    }

  } catch (error) {
    console.error('خطأ في إنشاء Hosted Payment Page:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إنشاء صفحة الدفع المستضافة',
      paymentUrl: '#',
      orderId: generateOrderId(),
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
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
      apiUrl: 'https://checkout.kashier.io/api/v1/hostedPayment',
      baseUrl: baseUrl
    },
    urls: {
      success: `${baseUrl}/payment/success`,
      failure: `${baseUrl}/payment/failure`,
      cancel: `${baseUrl}/checkout`,
      webhook: `${baseUrl}/api/kashier/webhook`
    },
    features: [
      '✅ Hosted Payment Page API',
      '✅ Multiple Payment Methods (Card, Wallet, Installments)', 
      '✅ Currency Conversion Support',
      '✅ Automatic Fallback to URL Method',
      '✅ Arabic Interface',
      '✅ Secure Hash Verification'
    ],
    advantages: [
      '🚀 أسرع في التحميل',
      '🔒 أكثر أماناً', 
      '💳 دعم جميع طرق الدفع',
      '🌍 واجهة عربية كاملة',
      '📱 متوافق مع الموبايل',
      '⚡ لا يحتاج redirection parameters طويلة'
    ],
    instructions: !KASHIER_CONFIG.merchantId ? 
      'Add Kashier credentials to .env.local file to enable hosted payment pages' : 
      'Configuration complete! Ready for hosted payment pages.',
    note: baseUrl.includes('localhost') ? 
      '⚠️ Using localhost URLs - Kashier may reject these. Consider using ngrok or a real domain.' :
      '✅ Using valid domain URLs'
  });
} 