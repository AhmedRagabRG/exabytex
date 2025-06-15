'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PayPalSuccessContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    const payerId = searchParams.get('PayerID');

    if (orderId) {
      setOrderData({
        orderId,
        paymentId,
        payerId,
        timestamp: new Date().toLocaleString('ar-EG'),
        status: 'مكتمل'
      });

      // في التطبيق الحقيقي، ستحتاج لاستدعاء API للتحقق من حالة الدفع
      setPaymentData({
        method: 'PayPal',
        amount: '99.99',
        currency: 'USD',
        transactionId: `TXN_${Date.now()}`
      });

      // مسح معرف الطلب المعلق
      localStorage.removeItem('pendingOrderId');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع بنجاح!</h1>
          <p className="text-gray-600">تم إنجاز الدفع عبر PayPal بنجاح</p>
        </div>

        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
            <h3 className="font-semibold text-gray-900 mb-3">تفاصيل الدفع</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-medium">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-medium text-blue-600">PayPal</span>
              </div>
              {paymentData && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ:</span>
                    <span className="font-medium text-green-600">
                      ${paymentData.amount} {paymentData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">معرف المعاملة:</span>
                    <span className="font-medium text-xs">{paymentData.transactionId}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">الحالة:</span>
                <span className="font-medium text-green-600">{orderData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">التاريخ:</span>
                <span className="font-medium">{orderData.timestamp}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Mail className="h-5 w-5 text-blue-600 ml-2" />
            <span className="text-blue-800 font-medium">تحقق من بريدك الإلكتروني</span>
          </div>
          <p className="text-blue-700 text-sm">
            سيتم إرسال المنتجات الرقمية وروابط التحميل إلى بريدك الإلكتروني خلال دقائق قليلة
          </p>
        </div>

        <div className="space-y-3">
          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            onClick={() => window.open('mailto:', '_blank')}
          >
            <Mail className="h-4 w-4 ml-2" />
            فتح البريد الإلكتروني
          </button>
          
          <Link 
            href="/store"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للمتجر
          </Link>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">ماذا بعد؟</h4>
          <ul className="text-xs text-green-800 space-y-1 text-right">
            <li>• ستصلك رسالة تأكيد على بريدك الإلكتروني</li>
            <li>• روابط تحميل المنتجات الرقمية</li>
            <li>• تعليمات التفعيل والاستخدام</li>
            <li>• معلومات الدعم الفني</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PayPalSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">جاري التحميل...</h1>
          </div>
        </div>
      </div>
    }>
      <PayPalSuccessContent />
    </Suspense>
  );
} 