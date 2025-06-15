'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (details: unknown) => void;
  onError: (error: unknown) => void;
  disabled?: boolean;
}

export function PayPalButton({ 
  amount, 
  currency = 'USD', 
  onSuccess, 
  onError,
  disabled = false 
}: PayPalButtonProps) {
  
  const initialOptions = {
    'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: currency,
    intent: 'capture',
    locale: 'ar_EG', // Arabic Egypt locale
    'enable-funding': 'paypal',
    'disable-funding': 'credit,card'
  };

  const createOrder = (data: unknown, actions: { order: { create: (arg0: { purchase_units: { amount: { value: string; currency_code: string; }; description: string; }[]; }) => unknown; }; }) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amount.toFixed(2),
          currency_code: currency
        },
        description: 'منتجات رقمية من AI Agency'
      }]
    });
  };

  const onApprove = (data: unknown, actions: { order: { capture: () => { then: (arg0: (details: unknown) => void) => unknown; }; }; }) => {
    return actions.order.capture().then((details: unknown) => {
      onSuccess(details);
    });
  };

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm text-center">
          PayPal غير مفعل. يرجى إضافة معرف PayPal في إعدادات النظام.
        </p>
      </div>
    );
  }

  return (
    <div className="paypal-container">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 45
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={disabled}
          fundingSource={undefined}
        />
      </PayPalScriptProvider>
    </div>
  );
} 