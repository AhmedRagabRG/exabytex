'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Package, Home, FileText, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // كاشير بيبعت parameters مختلفة في الـ return URL
  const orderId = searchParams.get('orderId') || 
                  searchParams.get('order_id') || 
                  searchParams.get('reference') ||
                  searchParams.get('orderNo');

  useEffect(() => {
    // طباعة جميع الـ parameters للـ debugging
    console.log('=== Payment Success URL Parameters ===');
    for (const [key, value] of searchParams.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log('====================================');

    // إطلاق تأثير الاحتفال
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // محاكاة جلب بيانات الطلب
    setTimeout(() => {
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      setOrderData({
        id: orderId || 'ORD-123456789',
        total: 1850,
        currency: 'EGP',
        items: [
          {
            name: 'نظام أتمتة الرد الآلي المتقدم',
            price: 1500,
            quantity: 1,
            image: '/images/ai-chat.jpg'
          },
          {
            name: 'استشارة تقنية لمدة ساعة',
            price: 350,
            quantity: 1,
            image: '/images/consultation.jpg'
          }
        ],
        customer: {
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '01234567890'
        },
        estimatedDelivery: '3-5 أيام عمل',
        paymentMethod: 'بطاقة ائتمانية',
        transactionId: 'TXN-' + Math.random().toString(36).substring(7).toUpperCase()
      });
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تأكيد الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* رسالة النجاح الرئيسية */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 تم الدفع بنجاح!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            شكراً لك! تم استلام دفعتك وقبولها
          </p>
          <p className="text-lg text-green-600 font-medium">
            رقم الطلب: {orderData?.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* تفاصيل الطلب */}
          <div className="lg:col-span-2 space-y-6">
            {/* ملخص الطلب */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 ml-2" />
                تفاصيل الطلب
              </h2>
              
              <div className="space-y-4">
                {orderData?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
                    <Image 
                      src={item?.image || '/api/placeholder/64/64'} 
                      alt={item?.name || 'منتج'}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item?.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600">الكمية: {item?.quantity}</span>
                        <span className="font-semibold text-green-600">
                          {item?.price.toLocaleString('ar-SA')} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">المجموع الكلي</span>
                  <span className="text-2xl font-bold text-green-600">
                    {orderData?.total.toLocaleString('ar-SA')} ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* معلومات الدفع */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات الدفع</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">طريقة الدفع</label>
                  <p className="text-gray-900 font-medium">{orderData?.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم المعاملة</label>
                  <p className="text-gray-900 font-medium">{orderData?.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">التاريخ والوقت</label>
                  <p className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الحالة</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    مدفوع
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* الخطوات التالية */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ماذا بعد؟</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">تأكيد الطلب</h4>
                    <p className="text-sm text-gray-600">سنرسل لك رسالة تأكيد عبر البريد الإلكتروني</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">بدء العمل</h4>
                    <p className="text-sm text-gray-600">سيتواصل معك فريقنا لبدء تنفيذ الخدمة</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">التسليم</h4>
                    <p className="text-sm text-gray-600">
                      تسليم المشروع خلال {orderData?.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* الدعم */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تحتاج مساعدة؟</h3>
              <p className="text-gray-600 text-sm mb-4">
                فريق الدعم متاح لمساعدتك في أي استفسار
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">📧 info@exabytex.com</p>
                <p className="text-gray-700">📞 +20 1555831761</p>
                <p className="text-gray-700">💬 الدردشة المباشرة متاحة 24/7</p>
              </div>
            </div>

            {/* أزرار العمل */}
            <div className="space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
              >
                <FileText className="h-4 w-4 ml-2" />
                طباعة الفاتورة
              </button>
              
              <button
                onClick={() => router.push('/store')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center"
              >
                <Package className="h-4 w-4 ml-2" />
                تصفح المزيد من المنتجات
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
              >
                <Home className="h-4 w-4 ml-2" />
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>

        {/* تقييم الخدمة */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">كيف كانت تجربة الشراء؟</h3>
          <p className="text-gray-600 mb-4">رأيك مهم لنا لتحسين خدماتنا</p>
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تأكيد الدفع...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}