'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // إذا كان الطلب مجانياً أو تم الدفع بنجاح، توجيه المستخدم إلى صفحة تأكيد الطلب
    if (orderId) {
      router.replace(`/order-confirmation/${orderId}`);
    } else {
      router.replace('/');
    }
  }, [orderId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحويلك...</p>
      </div>
    </div>
  );
}