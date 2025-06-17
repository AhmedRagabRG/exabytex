'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PaymentData {
  status: 'success' | 'failed';
  orderId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // قراءة البيانات من URL parameters
    const status = searchParams.get('status');
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const error = searchParams.get('error');

    if (status) {
      setPaymentData({
        status: status as 'success' | 'failed',
        orderId: orderId || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        currency: currency || undefined,
        error: error || undefined
      });
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل معلومات الدفع...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">خطأ في البيانات</h1>
          <p className="text-gray-600 mb-8">لم يتم العثور على معلومات الدفع</p>
          <Link href="/">
            <Button variant="default">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {paymentData.status === 'success' ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">تم الدفع بنجاح!</h1>
              <div className="space-y-4 mb-8">
                {paymentData.orderId && (
                  <p className="text-gray-600">
                    رقم الطلب: <span className="font-semibold">{paymentData.orderId}</span>
                  </p>
                )}
                {paymentData.amount && paymentData.currency && (
                  <p className="text-gray-600">
                    المبلغ: <span className="font-semibold">{paymentData.amount} {paymentData.currency}</span>
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <Link href="/dashboard" className="block">
                  <Button variant="default" className="w-full">
                    الذهاب للوحة التحكم
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">فشل عملية الدفع</h1>
              {paymentData.error && (
                <p className="text-red-600 mb-4">{paymentData.error}</p>
              )}
              <div className="space-y-4">
                <Link href="/pricing" className="block">
                  <Button variant="default" className="w-full">
                    المحاولة مرة أخرى
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}