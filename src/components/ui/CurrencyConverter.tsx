'use client';

import { ArrowRight, Info } from 'lucide-react';

interface CurrencyConverterProps {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate?: number;
  isLiveRate?: boolean;
  className?: string;
}

export function CurrencyConverter({
  originalAmount,
  originalCurrency,
  convertedAmount,
  convertedCurrency,
  exchangeRate,
  isLiveRate = false,
  className = ''
}: CurrencyConverterProps) {
  if (originalCurrency === convertedCurrency) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-2">
        <Info className="h-4 w-4 text-blue-600 ml-2" />
        <span className="text-sm font-medium text-blue-900">معلومات تحويل العملة</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <span className="font-medium text-gray-900">
            {originalAmount} {originalCurrency}
          </span>
          <ArrowRight className="h-4 w-4 text-blue-600 mx-2" />
          <span className="font-bold text-blue-600">
            {convertedAmount} {convertedCurrency}
          </span>
        </div>
      </div>
      
      {exchangeRate && (
        <div className="mt-2 text-xs text-gray-600">
          سعر الصرف: 1 {originalCurrency} = {exchangeRate} {convertedCurrency}
        </div>
      )}
      
      <div className="mt-2 text-xs text-blue-700">
        ✅ سيتم الدفع بالجنيه المصري حسب متطلبات بوابة الدفع
        {isLiveRate && (
          <div className="mt-1 text-green-700">
            🌐 سعر صرف محدث من API
          </div>
        )}
        {!isLiveRate && (
          <div className="mt-1 text-orange-700">
            ⚠️ سعر صرف احتياطي (API غير متاح)
          </div>
        )}
      </div>
    </div>
  );
} 