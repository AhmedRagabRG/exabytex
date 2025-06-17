'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CreditCard, ArrowRight } from 'lucide-react';
import { SimplePrice } from './PriceDisplay';

interface CurrencyConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate?: number;
  isLiveRate: boolean;
}

export function CurrencyConversionModal({
  isOpen,
  onClose,
  originalAmount,
  originalCurrency,
  convertedAmount,
  convertedCurrency,
  exchangeRate,
  isLiveRate
}: CurrencyConversionModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  // منع scroll في الخلفية عند فتح المودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">إشعار الدفع</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Alert Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              تحويل العملة للدفع
            </h3>
            <p className="text-gray-600 leading-relaxed">
              سيتم تحويل مبلغ طلبك إلى الجنيه المصري للدفع عبر بوابة كاشير
            </p>
          </div>

          {/* Conversion Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">المبلغ الأصلي</p>
                <div className="text-lg font-semibold text-gray-900">
                  <SimplePrice amount={originalAmount} className="text-gray-900" />
                </div>
                <p className="text-xs text-gray-500">{originalCurrency}</p>
              </div>

              <div className="px-3">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">مبلغ الدفع</p>
                <div className="text-lg font-semibold text-green-700">
                  {(convertedAmount || 0).toLocaleString('ar-SA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ج.م
                </div>
                <p className="text-xs text-gray-500">{convertedCurrency}</p>
              </div>
            </div>

            {/* Exchange Rate Details */}
            {showDetails && exchangeRate && (
              <div className="border-t border-gray-200 pt-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">سعر الصرف</p>
                  <p className="text-sm font-medium text-gray-800">
                    1 {originalCurrency} = {exchangeRate.toFixed(2)} ج.م
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${isLiveRate ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-xs text-gray-500">
                      {isLiveRate ? "تم تحويل العملة استنادًا إلى بيانات من موقع exchangerate-api." : 'سعر احتياطي'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Toggle */}
          {exchangeRate && (
            <div className="text-center mb-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showDetails ? 'إخفاء التفاصيل' : 'عرض تفاصيل التحويل'}
              </button>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-900 mb-2">ملاحظات مهمة:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• سيتم خصم المبلغ بالجنيه المصري من حسابك</li>
              <li>• بوابة كاشير تدعم الدفع بالفيزا والماستركارد</li>
              <li>• التحويل يتم بأحدث أسعار الصرف المتاحة</li>
              <li>• ستحصل على إيصال بالمبلغ المدفوع بالجنيه المصري</li>
            </ul>
          </div>

          {/* Don't show again option */}
          <div className="text-center mb-4">
            <label className="flex items-center justify-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    sessionStorage.setItem('hideConversionModal', 'true');
                  } else {
                    sessionStorage.removeItem('hideConversionModal');
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>لا تظهر هذه الرسالة مرة أخرى في هذه الجلسة</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              مراجعة الطلب
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              فهمت، متابعة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 