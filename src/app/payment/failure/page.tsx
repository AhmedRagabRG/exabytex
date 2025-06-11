'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, CreditCard, Phone, Mail, ArrowLeft, Home } from 'lucide-react';
import { Suspense } from 'react';

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  searchParams.get('orderId');
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'insufficient_funds':
        return 'رصيد غير كافي في البطاقة';
      case 'card_declined':
        return 'تم رفض البطاقة من البنك';
      case 'expired_card':
        return 'البطاقة منتهية الصلاحية';
      case 'invalid_card':
        return 'بيانات البطاقة غير صحيحة';
      case 'network_error':
        return 'خطأ في الاتصال بالشبكة';
      case 'timeout':
        return 'انتهت مهلة الدفع';
      case 'cancelled':
        return 'تم إلغاء العملية من قبل المستخدم';
      default:
        return 'فشل في إتمام عملية الدفع';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">فشل في الدفع</h1>
          <p className="text-xl text-gray-600 mb-2">عذراً، لم نتمكن من إتمام عملية الدفع</p>
          <p className="text-lg text-red-600 font-medium">{getErrorMessage()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ماذا تريد أن تفعل؟</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </button>
            
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
            >
              <CreditCard className="h-4 w-4 ml-2" />
              طريقة دفع أخرى
            </button>
            
            <button
              onClick={() => router.push('/cart')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للسلة
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

        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">تحتاج مساعدة؟</h3>
          <p className="text-gray-600 text-sm mb-4">فريق الدعم متاح لمساعدتك في حل مشكلة الدفع</p>
          <div className="space-y-3">
            <a href="tel:+201234567890" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
              <Phone className="h-4 w-4 ml-2" />
              +20 1234567890
            </a>
            <a href="mailto:support@aiagency.com" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
              <Mail className="h-4 w-4 ml-2" />
              support@aiagency.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}