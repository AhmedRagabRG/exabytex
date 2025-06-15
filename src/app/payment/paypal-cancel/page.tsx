'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import Link from 'next/link';

function PayPalCancelContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const token = searchParams.get('token');

    if (orderId) {
      setOrderData({
        orderId,
        token,
        timestamp: new Date().toLocaleString('ar-EG'),
        status: 'ملغي'
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم إلغاء الدفع</h1>
          <p className="text-gray-600">تم إلغاء عملية الدفع عبر PayPal</p>
        </div>

        {orderData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
            <h3 className="font-semibold text-gray-900 mb-3">تفاصيل الطلب</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">رقم الطلب:</span>
                <span className="font-medium">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-medium text-blue-600">PayPal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الحالة:</span>
                <span className="font-medium text-red-600">{orderData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">التاريخ:</span>
                <span className="font-medium">{orderData.timestamp}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">لماذا تم إلغاء الدفع؟</h4>
          <ul className="text-xs text-yellow-800 space-y-1 text-right">
            <li>• قمت بإلغاء العملية من PayPal</li>
            <li>• انتهت مهلة جلسة الدفع</li>
            <li>• حدث خطأ تقني في PayPal</li>
            <li>• رفض البنك المعاملة</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/checkout"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Link>
          
          <Link 
            href="/cart"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للسلة
          </Link>

          <Link 
            href="/store"
            className="w-full bg-gray-50 text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            المتابعة للمتجر
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Mail className="h-4 w-4 text-blue-600 ml-2" />
            <span className="text-blue-800 font-medium text-sm">تحتاج مساعدة؟</span>
          </div>
          <p className="text-blue-700 text-xs">
            إذا كان لديك أي مشاكل في الدفع، يرجى التواصل مع خدمة العملاء
          </p>
          <Link 
            href="/contact"
            className="text-blue-600 hover:text-blue-800 text-xs font-medium underline mt-2 inline-block"
          >
            اتصل بنا
          </Link>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">طرق دفع أخرى:</h4>
          <ul className="text-xs text-green-800 space-y-1 text-right">
            <li>• البطاقة الائتمانية عبر كاشير</li>
            <li>• Apple Pay (للأجهزة المدعومة)</li>
            <li>• التحويل البنكي المباشر</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PayPalCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">جاري التحميل...</h1>
          </div>
        </div>
      </div>
    }>
      <PayPalCancelContent />
    </Suspense>
  );
} 