'use client';

import { useEffect } from 'react';
import { X, CheckCircle, CreditCard } from 'lucide-react';

interface EgpPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function EgpPaymentModal({
  isOpen,
  onClose,
  amount
}: EgpPaymentModalProps) {
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
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">جاهز للدفع</h2>
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
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              الدفع بالجنيه المصري
            </h3>
            <p className="text-gray-600 leading-relaxed">
              ممتاز! طلبك بالجنيه المصري ولا يحتاج تحويل عملة
            </p>
          </div>

          {/* Payment Amount */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-green-700 mb-1">مبلغ الدفع</p>
              <div className="text-2xl font-bold text-green-800">
                {amount.toLocaleString('ar-SA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ج.م
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-900 mb-2">معلومات الدفع:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• دفع آمن عبر بوابة كاشير</li>
              <li>• يدعم الفيزا والماستركارد</li>
              <li>• بدون رسوم تحويل عملة</li>
              <li>• إيصال فوري بعد الدفع</li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            فهمت، متابعة للدفع
          </button>
        </div>
      </div>
    </div>
  );
} 