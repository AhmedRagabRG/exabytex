import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  isTestMode: process.env.PAYPAL_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production'
};

function generateOrderId(): string {
  return `PPL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (PAYPAL_CONFIG.isTestMode) {
    return 'https://test-checkout.example.com';
  }
  
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://exabytex.com';
}

// تحويل العملة إلى USD لـ PayPal (PayPal يدعم عملات متعددة لكن USD هو الأكثر استقراراً)
function convertToUSD(amount: number, currency: string): number {
  // معدلات تحويل مبسطة - في التطبيق الحقيقي استخدم API حقيقي للعملات
  const exchangeRates: { [key: string]: number } = {
    'EGP': 0.032, // 1 EGP = 0.032 USD (تقريبي)
    'SAR': 0.267, // 1 SAR = 0.267 USD
    'AED': 0.272, // 1 AED = 0.272 USD
    'USD': 1.0,
    'EUR': 1.1,
    'GBP': 1.25
  };

  const rate = exchangeRates[currency] || exchangeRates['USD'];
  return Math.round(amount * rate * 100) / 100; // تقريب لأقرب سنت
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // التحقق من إعدادات PayPal
    if (!PAYPAL_CONFIG.clientId) {
      console.error('Missing PayPal configuration');
      return NextResponse.json({
        success: false,
        error: 'إعدادات PayPal غير مكتملة. يرجى إضافة بيانات PayPal في ملف .env.local',
        orderId: generateOrderId()
      });
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'لا توجد عناصر في الطلب' }, { status: 400 });
    }

    if (!orderData.customer.email) {
      return NextResponse.json({ error: 'بيانات العميل غير مكتملة' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const originalAmount = parseFloat(orderData.totals.total.toFixed(2));
    const originalCurrency = 'EGP'; // العملة الأساسية
    
    // تحويل المبلغ إلى USD لـ PayPal
    const usdAmount = convertToUSD(originalAmount, originalCurrency);
    
    console.log('=== PayPal Currency Conversion ===');
    console.log('Original:', originalAmount, originalCurrency);
    console.log('For PayPal:', usdAmount, 'USD');
    console.log('=================================');
    
    const baseUrl = getBaseUrl();

    // إعداد بيانات PayPal order
    const paypalOrderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        amount: {
          currency_code: 'USD',
          value: usdAmount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: usdAmount.toFixed(2)
            }
          }
        },
        items: orderData.items.map((item: any) => ({
          name: item.name.substring(0, 120), // PayPal يحد الأسماء إلى 120 حرف
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: 'USD',
            value: convertToUSD(item.price, originalCurrency).toFixed(2)
          },
          category: 'DIGITAL_GOODS'
        })),
        description: `منتجات رقمية - طلب رقم ${orderId}`,
        custom_id: orderId,
        invoice_id: orderId
      }],
      application_context: {
        brand_name: 'AI Agency Store',
        locale: 'en-US',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: `${baseUrl}/payment/paypal-success?orderId=${orderId}`,
        cancel_url: `${baseUrl}/payment/paypal-cancel?orderId=${orderId}`
      },
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'AI Agency Store',
            locale: 'ar-EG',
            landing_page: 'BILLING',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW'
          }
        }
      }
    };

    console.log('=== PayPal Payment Created ===');
    console.log('Order ID:', orderId);
    console.log('Original Amount:', originalAmount, originalCurrency);
    console.log('PayPal Amount:', usdAmount, 'USD');
    console.log('Customer Email:', orderData.customer.email);
    console.log('Items Count:', orderData.items.length);
    console.log('Mode:', PAYPAL_CONFIG.isTestMode ? 'TEST' : 'LIVE');
    console.log('=============================');

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paypalOrderData: paypalOrderData,
      currencyConversion: {
        originalAmount: originalAmount,
        originalCurrency: originalCurrency,
        paypalAmount: usdAmount,
        paypalCurrency: 'USD',
        isLiveRate: false
      },
      paymentMethod: 'paypal',
      clientId: PAYPAL_CONFIG.clientId,
      isTestMode: PAYPAL_CONFIG.isTestMode
    });

  } catch (error) {
    console.error('خطأ في إنشاء دفع PayPal:', error);
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
    message: 'PayPal Payment API Status',
    status: 'Active',
    config: {
      clientId: PAYPAL_CONFIG.clientId ? 'SET ✅' : 'NOT_SET ❌',
      clientSecret: PAYPAL_CONFIG.clientSecret ? 'SET ✅' : 'NOT_SET ❌',
      isTestMode: PAYPAL_CONFIG.isTestMode,
      baseUrl: baseUrl
    },
    urls: {
      success: `${baseUrl}/payment/paypal-success`,
      cancel: `${baseUrl}/payment/paypal-cancel`,
      webhook: `${baseUrl}/api/paypal/webhook`
    },
    instructions: !PAYPAL_CONFIG.clientId ? 
      'Add PayPal credentials to .env.local file to enable payments' : 
      'Configuration complete! Ready for payments.',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    note: 'Amounts will be converted to USD for PayPal processing',
    troubleshooting: {
      commonIssues: [
        'تأكد من صحة بيانات PayPal في .env.local',
        'تأكد من تفعيل حساب PayPal Business',
        'تحقق من أن Client ID يبدأ بـ A',
        'تأكد من تفعيل Express Checkout في PayPal',
        'استخدم domain حقيقي بدلاً من localhost للإنتاج'
      ]
    }
  });
} 