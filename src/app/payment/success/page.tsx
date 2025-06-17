'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentData {
  status: string;
  orderId: string;
  amount: string;
  currency: string;
  error?: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // الحصول على البيانات من URL
    const params = new URLSearchParams(window.location.search);
    const data: PaymentData = {
      status: params.get('status') || 'unknown',
      orderId: params.get('order_id') || '',
      amount: params.get('amount') || '0',
      currency: params.get('currency') || 'EGP',
      error: params.get('error') || undefined
    };
    setPaymentData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الدفع...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">لم يتم العثور على بيانات الدفع</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = paymentData.status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {isSuccess ? (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">تم الدفع بنجاح</h2>
              <p className="text-gray-600 mb-4">شكراً لك! تم استلام دفعتك بنجاح.</p>
            </>
          ) : (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">فشلت عملية الدفع</h2>
              <p className="text-gray-600 mb-4">{paymentData.error || 'حدث خطأ أثناء معالجة الدفع'}</p>
            </>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500">رقم الطلب:</div>
              <div className="font-medium">{paymentData.orderId}</div>
              
              <div className="text-gray-500">المبلغ:</div>
              <div className="font-medium">{paymentData.amount} {paymentData.currency}</div>
              
              <div className="text-gray-500">الحالة:</div>
              <div className="font-medium">{isSuccess ? 'مكتمل' : 'فشل'}</div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              الذهاب إلى لوحة التحكم
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}