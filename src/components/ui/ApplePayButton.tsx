'use client';

import { useEffect, useState } from 'react';

interface ApplePayButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (details: unknown) => void;
  onError: (error: unknown) => void;
  orderData: {
    items: Array<{ id: string; name: string; price: number; quantity: number }>;
    customer: Record<string, unknown>;
    totals: { subtotal: number; total: number };
  };
  disabled?: boolean;
}

declare global {
  interface Window {
    ApplePaySession?: {
      canMakePayments: () => boolean;
      new: (version: number, paymentRequest: unknown) => {
        onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
        onpaymentauthorized: ((event: { payment: unknown }) => void) | null;
        oncancel: (() => void) | null;
        completeMerchantValidation: (merchantSession: unknown) => void;
        completePayment: (status: number) => void;
        abort: () => void;
        begin: () => void;
      };
      STATUS_SUCCESS: number;
      STATUS_FAILURE: number;
    };
  }
}

export function ApplePayButton({ 
  amount, 
  currency = 'EGP', 
  onSuccess, 
  onError,
  orderData,
  disabled = false 
}: ApplePayButtonProps) {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apple Pay now supports cross-device payments
    // Show button on all devices and browsers
    if (typeof window !== 'undefined') {
      const hasApplePaySession = !!window.ApplePaySession;
      const canMakePayments = hasApplePaySession && window.ApplePaySession.canMakePayments();
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      // Show Apple Pay on all devices - it can work cross-device
      // Even on non-Apple devices, users can scan QR code with their iPhone
      const shouldShowApplePay = true; // Always show, let Apple handle the cross-device flow
      
      console.log('Apple Pay Debug:', {
        hasApplePaySession,
        canMakePayments,
        userAgent: navigator.userAgent,
        isSafari,
        shouldShowApplePay,
        platform: navigator.platform
      });
      
      setIsApplePayAvailable(shouldShowApplePay);
    }
  }, []);

  const handleApplePayClick = async () => {
    // Check if native Apple Pay is available
    if (typeof window !== 'undefined' && window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
      // Native Apple Pay flow
      await handleNativeApplePay();
    } else {
      // Cross-device Apple Pay flow (QR code, etc.)
      await handleCrossDeviceApplePay();
    }
  };

  const handleNativeApplePay = async () => {
    if (typeof window === 'undefined' || !window.ApplePaySession) {
      onError(new Error('Apple Pay غير متاح على هذا المتصفح'));
      return;
    }

    setIsLoading(true);

    try {
      // Create payment through Kashier with Apple Pay method
      const response = await fetch('/api/kashier/create-apple-pay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: 'apple_pay',
          amount: amount,
          currency: currency
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Create Apple Pay payment request
        const paymentRequest = {
          countryCode: 'EG',
          currencyCode: currency,
          supportedNetworks: ['visa', 'masterCard', 'amex'],
          merchantCapabilities: ['supports3DS'],
          total: {
            label: 'AI Agency Store',
            amount: amount.toFixed(2)
          },
          lineItems: orderData.items.map((item: { name: string; price: number; quantity: number }) => ({
            label: item.name,
            amount: (item.price * item.quantity).toFixed(2)
          }))
        };

        const session = new (window.ApplePaySession as unknown as new (...args: unknown[]) => any)(3, paymentRequest);

        session.onvalidatemerchant = async (event: { validationURL: string }) => {
          try {
            // Validate merchant with your backend
            const validationResponse = await fetch('/api/apple-pay/validate-merchant', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                validationURL: event.validationURL,
                kashierOrderId: (result as { orderId: string }).orderId
              }),
            });

            const merchantSession = await validationResponse.json();
            session.completeMerchantValidation(merchantSession);
          } catch (error) {
            session.abort();
            onError(error);
          }
        };

        session.onpaymentauthorized = async (event: { payment: unknown }) => {
          try {
            // Process payment with Kashier
            const paymentResponse = await fetch('/api/kashier/process-apple-pay', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: (result as { orderId: string }).orderId,
                paymentData: event.payment,
                kashierToken: (result as { kashierToken: string }).kashierToken
              }),
            });

            const paymentResult = await paymentResponse.json();

            if ((paymentResult as { success: boolean }).success) {
              if (typeof window !== 'undefined' && window.ApplePaySession) {
                session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
              }
              onSuccess(paymentResult);
            } else {
              if (typeof window !== 'undefined' && window.ApplePaySession) {
                session.completePayment(window.ApplePaySession.STATUS_FAILURE);
              }
              onError(new Error((paymentResult as { error?: string }).error || 'فشل في معالجة الدفع'));
            }
          } catch (error) {
            if (typeof window !== 'undefined' && window.ApplePaySession) {
              session.completePayment(window.ApplePaySession.STATUS_FAILURE);
            }
            onError(error);
          }
        };

        session.oncancel = () => {
          setIsLoading(false);
        };

        session.begin();
      } else {
        throw new Error(result.error || 'فشل في إنشاء طلب الدفع');
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrossDeviceApplePay = async () => {
    setIsLoading(true);

    try {
      // استخدام Kashier Hosted Payment Page مع دعم Apple Pay
      const response = await fetch('/api/kashier/create-hosted-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: 'apple_pay',
          amount: amount,
          currency: currency,
          preferredMethod: 'wallet' // تفضيل المحافظ الرقمية
        }),
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // توجيه للـ Hosted Payment Page مع دعم Apple Pay
        localStorage.setItem('pendingOrderId', result.orderId);
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || 'فشل في إنشاء صفحة الدفع');
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show button with different states based on availability
  const isNativeApplePayAvailable = typeof window !== 'undefined' && 
    window.ApplePaySession && 
    window.ApplePaySession.canMakePayments();
  
  const buttonText = isNativeApplePayAvailable 
    ? 'الدفع بـ Apple Pay' 
    : 'Apple Pay (امسح بالموبايل)';
  
  const buttonIcon = isNativeApplePayAvailable ? '��' : '📱';

  return (
    <div className="space-y-2">
      <button
        onClick={isApplePayAvailable ? handleApplePayClick : undefined}
        disabled={disabled || isLoading || !isApplePayAvailable}
        className={`w-full py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center ${
          !isApplePayAvailable 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800'
        }`}
        style={!isApplePayAvailable ? {
          background: 'linear-gradient(135deg, #000 0%, #333 100%)',
          border: '1px solid #333'
        } : {}}
      >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
          جاري المعالجة...
        </div>
              ) : (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.71 19.5C17.16 20.38 15.58 20.8 14.28 20.8C12.98 20.8 11.4 20.38 9.85 19.5C8.3 18.62 6.75 17.74 5.2 17.74C3.65 17.74 2.1 18.62 0.55 19.5V17.74C2.1 16.86 3.65 16.44 5.2 16.44C6.75 16.44 8.3 16.86 9.85 17.74C11.4 18.62 12.98 19.04 14.28 19.04C15.58 19.04 17.16 18.62 18.71 17.74V19.5Z"
                fill="currentColor"
              />
              <path
                d="M14.28 13.8C12.98 13.8 11.4 13.38 9.85 12.5C8.3 11.62 6.75 10.74 5.2 10.74C3.65 10.74 2.1 11.62 0.55 12.5V10.74C2.1 9.86 3.65 9.44 5.2 9.44C6.75 9.44 8.3 9.86 9.85 10.74C11.4 11.62 12.98 12.04 14.28 12.04C15.58 12.04 17.16 11.62 18.71 10.74V12.5C17.16 13.38 15.58 13.8 14.28 13.8Z"
                fill="currentColor"
              />
              <path
                d="M14.28 6.8C12.98 6.8 11.4 6.38 9.85 5.5C8.3 4.62 6.75 3.74 5.2 3.74C3.65 3.74 2.1 4.62 0.55 5.5V3.74C2.1 2.86 3.65 2.44 5.2 2.44C6.75 2.44 8.3 2.86 9.85 3.74C11.4 4.62 12.98 5.04 14.28 5.04C15.58 5.04 17.16 4.62 18.71 3.74V5.5C17.16 6.38 15.58 6.8 14.28 6.8Z"
                fill="currentColor"
              />
            </svg>
            {buttonText}
          </div>
        )}
      </button>
      
      {isApplePayAvailable && (
        <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
          💡 Apple Pay يتطلب:
          <br />
          • Safari على iPhone/iPad/Mac
          <br />
          • إضافة بطاقة إلى Apple Wallet
          <br />
          • موقع بـ HTTPS (ليس localhost)
        </div>
      )}
    </div>
  );
} 