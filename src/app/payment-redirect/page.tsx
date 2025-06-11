'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CreditCard, Shield, ArrowLeft } from 'lucide-react';

function PaymentRedirectContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const data = {
      merchantId: searchParams.get('merchantId'),
      apiKey: searchParams.get('apiKey'),
      amount: searchParams.get('amount'),
      currency: searchParams.get('currency'),
      orderId: searchParams.get('orderId'),
      hash: searchParams.get('hash'),
      success: searchParams.get('success'),
      failure: searchParams.get('failure'),
      back: searchParams.get('back'),
      customerEmail: searchParams.get('customer[email]'),
      customerPhone: searchParams.get('customer[phone]'),
      customerFirstName: searchParams.get('customer[first_name]'),
      customerLastName: searchParams.get('customer[last_name]'),
      testMode: searchParams.get('test_mode')
    };

    setPaymentData(data);

    const redirectTimer = setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        window.location.href = data.success || '/payment/success';
      } else {
        window.location.href = data.failure || '/payment/failure';
      }
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [searchParams]);

  const handleBackToCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">كاشير للدفع الآمن</h1>
          <p className="text-gray-600">جاري تحويلك لبوابة الدفع الآمنة</p>
        </div>

        <div className="mb-6">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <div className="space-y-2">
            <div className="text-lg font-semibold text-gray-900">
              جاري المعالجة...
            </div>
            <div className="text-sm text-gray-600">
              يرجى عدم إغلاق هذه الصفحة
            </div>
          </div>
        </div>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
            <h3 className="font-semibold text-gray-900 mb-3">تفاصيل الدفع</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-medium">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ:</span>
                <span className="font-medium text-blue-600">
                  {paymentData.amount} {paymentData.currency === 'EGP' ? 'ج.م' : paymentData.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العميل:</span>
                <span className="font-medium">
                  {paymentData.customerFirstName} {paymentData.customerLastName}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-5 w-5 text-green-600 ml-2" />
            <span className="text-green-800 font-medium">دفع آمن ومشفر</span>
          </div>
          <p className="text-green-700 text-sm">
            جميع المعاملات محمية بأعلى معايير الأمان PCI DSS
          </p>
        </div>

        <button
          onClick={handleBackToCheckout}
          className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة لصفحة الدفع
        </button>

        <div className="mt-6 text-xs text-gray-500">
          في حالة عدم التحويل التلقائي، يرجى النقر على زر العودة
        </div>
      </div>
    </div>
  );
} 

export default function PaymentRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">كاشير للدفع الآمن</h1>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
        </div>
      </div>
    }>
      <PaymentRedirectContent />
    </Suspense>
  );
}