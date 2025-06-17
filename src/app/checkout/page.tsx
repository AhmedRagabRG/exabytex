'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, User, Phone, Loader2, ShoppingBag, Gift } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';

import { PriceDisplay, SimplePrice } from '@/components/ui/PriceDisplay'
import { CurrencyConverter } from '@/components/ui/CurrencyConverter'
import { CountrySelector, COUNTRIES, type Country } from '@/components/ui/CountrySelector'
import { CurrencyConversionModal } from '@/components/ui/CurrencyConversionModal'
import { EgpPaymentModal } from '@/components/ui/EgpPaymentModal'
import { PayPalButton } from '@/components/ui/PayPalButton'
import { ApplePayButton } from '@/components/ui/ApplePayButton'

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountry: Country;
  paymentMethod: 'card' | 'paypal' | 'apple_pay';
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, isLoading: cartLoading } = useCart();
  const { appliedPromo, setAppliedPromo } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currencyConversion, setCurrencyConversion] = useState<{
    originalAmount: number;
    originalCurrency: string;
    kashierAmount: number;
    kashierCurrency: string;
    exchangeRate?: number;
    isLiveRate: boolean;
  } | null>(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showEgpModal, setShowEgpModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountry: COUNTRIES[0], // مصر كافتراضي
    paymentMethod: 'card'
  });

  // حساب السعر الصحيح للمنتج (مع أو بدون خصم)
  const getProductPrice = (item: any) => {
    return (item.hasDiscount && item.discountedPrice) 
      ? item.discountedPrice 
      : item.price;
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (getProductPrice(item) * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = appliedPromo?.discountAmount || 0;
  const totalAmount = appliedPromo ? appliedPromo.finalTotal : subtotal;

  // إخفاء طرق الدفع للمنتجات المجانية
  const showPaymentMethods = totalAmount > 0;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && !cartLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [items, router, status, cartLoading]);

  // جلب معلومات تحويل العملة عند تحميل الصفحة
  useEffect(() => {
    const fetchCurrencyInfo = async () => {
      try {
        // جلب إعدادات العملة من API
        const settingsResponse = await fetch('/api/settings/currency');
        if (!settingsResponse.ok) return;
        
        const settingsData = await settingsResponse.json();
        const currency = settingsData.settings.defaultCurrency;
        
        // إذا العملة مش جنيه مصري، جلب معلومات التحويل
        if (currency !== 'EGP' && totalAmount > 0) {
          const conversionResponse = await fetch('/api/kashier/currency-conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount })
          });
          
          if (conversionResponse.ok) {
            const conversionData = await conversionResponse.json();
            setCurrencyConversion(conversionData);
            // عرض المودال إذا كانت هناك حاجة لتحويل العملة
            if (conversionData.originalCurrency !== 'EGP') {
              const hideModal = sessionStorage.getItem('hideConversionModal');
              if (!hideModal) {
                setShowConversionModal(true);
              }
            }
          }
        } else if (currency === 'EGP' && totalAmount > 0) {
          // إذا العملة جنيه مصري، عرض مودال التأكيد
          setShowEgpModal(true);
        }
      } catch (error) {
        console.error('Error fetching currency info:', error);
      }
    };

    if (totalAmount > 0) {
      fetchCurrencyInfo();
    }
  }, [totalAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentMethodChange = (method: CheckoutFormData['paymentMethod']) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الأخير مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    else if (!/^[0-9]{7,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) newErrors.phone = 'رقم الهاتف غير صحيح (7-15 رقم)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form validation when form data changes
  useEffect(() => {
    const isValid = formData.firstName.trim() !== '' &&
                   formData.lastName.trim() !== '' &&
                   formData.email.trim() !== '' &&
                   /\S+@\S+\.\S+/.test(formData.email) &&
                   formData.phone.trim() !== '' &&
                   /^[0-9]{7,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''));
                   
    if (process.env.NODE_ENV === 'development') {
      console.log('Form validation:', {
        firstName: formData.firstName.trim() !== '',
        lastName: formData.lastName.trim() !== '', 
        email: /\S+@\S+\.\S+/.test(formData.email),
        phone: /^[0-9]{7,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, '')),
        cleanPhone: formData.phone.replace(/[\s\-\(\)]/g, ''),
        isValid
      });
    }
                   
    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !validateForm()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Form validation failed');
      }
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.productId,
          name: item.name,
          price: getProductPrice(item),
          originalPrice: item.price,
          quantity: item.quantity,
          image: item.image || ''
        })),
        customer: {
          ...formData,
          phone: `${formData.phoneCountry.phoneCode}${formData.phone}`,
          country: formData.phoneCountry.nameAr,
          countryCode: formData.phoneCountry.code
        },
        totals: {
          subtotal,
          discount: discountAmount,
          total: totalAmount
        },
        paymentMethod: formData.paymentMethod,
        promoCode: appliedPromo?.promoCode || null
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Sending order data:', orderData);
      }

      // إذا كان المنتج مجانياً، إنشاء طلب مجاني مباشرة
      if (!showPaymentMethods) {
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, isFree: true })
        });

        const result = await response.json();
        
        if (response.ok) {
          window.location.href = `/order-confirmation/${result.orderId}`;
          // مسح الكوبون المطبق
          setAppliedPromo(null);
          localStorage.removeItem('appliedPromo');
          return;
        } else {
          throw new Error(result.error || 'Failed to create free order');
        }
      }

      // Handle different payment methods for paid orders
      if (formData.paymentMethod === 'card') {
        // Kashier Legacy Payment UI
        const paymentResponse = await fetch('/api/kashier/create-hosted-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        const result = await paymentResponse.json();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Kashier Legacy UI Response:', result);
        }
        
        if (result.success && result.paymentUrl && result.paymentUrl !== '#') {
          // حفظ معلومات التحويل إذا كانت موجودة
          if (result.currencyConversion && result.currencyConversion.originalCurrency !== 'EGP') {
            setCurrencyConversion(result.currencyConversion);
            // عرض معلومات التحويل قبل التوجه للدفع
            setTimeout(() => {
              localStorage.setItem('pendingOrderId', result.orderId);
              // مسح الكوبون المطبق
              setAppliedPromo(null);
              localStorage.removeItem('appliedPromo');
              window.location.href = result.paymentUrl;
            }, 3000);
          } else {
            localStorage.setItem('pendingOrderId', result.orderId);
            // مسح الكوبون المطبق
            setAppliedPromo(null);
            localStorage.removeItem('appliedPromo');
            window.location.href = result.paymentUrl;
          }
        } else {
          alert(`خطأ في إنشاء صفحة الدفع: ${result.error || 'حدث خطأ غير معروف'}`);
          console.error('Kashier Legacy UI Error:', result);
        }
      } else {
        // For PayPal and Apple Pay, we'll handle them in the payment buttons
        alert('يرجى استخدام زر الدفع المناسب أسفل النموذج');
      }
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PayPal payment success
  const handlePayPalSuccess = (details: unknown) => {
    console.log('PayPal payment successful:', details);
    const paymentDetails = details as { id: string };
    localStorage.setItem('pendingOrderId', paymentDetails.id);
    window.location.href = `/payment/success?orderId=${paymentDetails.id}&method=paypal`;
  };

  // Handle PayPal payment error
  const handlePayPalError = (error: unknown) => {
    console.error('PayPal payment error:', error);
    alert('حدث خطأ في دفع PayPal. يرجى المحاولة مرة أخرى.');
  };

  // Handle Apple Pay success
  const handleApplePaySuccess = (details: unknown) => {
    console.log('Apple Pay payment successful:', details);
    const paymentDetails = details as { orderId: string };
    localStorage.setItem('pendingOrderId', paymentDetails.orderId);
    window.location.href = `/payment/success?orderId=${paymentDetails.orderId}&method=apple_pay`;
  };

  // Handle Apple Pay error
  const handleApplePayError = (error: unknown) => {
    console.error('Apple Pay payment error:', error);
    const errorObj = error as { message?: string };
    alert(`حدث خطأ في دفع Apple Pay: ${errorObj.message || 'خطأ غير معروف'}`);
  };

  if (status === 'loading' || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">جاري تحميل بيانات السلة...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-4">يرجى إضافة منتجات للسلة أولاً</p>
          <button
            onClick={() => router.push('/store')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
          <p className="text-gray-600 mt-2">راجع طلبك وأدخل بياناتك للحصول على المنتجات الرقمية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form 
              onSubmit={handleSubmit} 
              onKeyDown={(e) => {
                // منع الـ Enter submission إذا كان الـ form غير صحيح
                if (e.key === 'Enter' && !isFormValid) {
                  e.preventDefault();
                  if (process.env.NODE_ENV === 'development') {
                    console.log('Enter blocked - form not valid');
                  }
                }
              }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 ml-2" />
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل الاسم الأول"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أدخل الاسم الأخير"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 ml-2" />
                  معلومات الاتصال
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      سيتم إرسال المنتجات الرقمية على هذا البريد الإلكتروني
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف
                    </label>
                    <div className="flex gap-2">
                      <div className="w-40">
                        <CountrySelector
                          selectedCountry={formData.phoneCountry}
                          onCountryChange={(country) => setFormData(prev => ({ ...prev, phoneCountry: country }))}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123456789"
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      مثال: {formData.phoneCountry.phoneCode} 123456789
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              {showPaymentMethods ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 ml-2" />
                    طريقة الدفع
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Kashier Card Payment */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'card' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => handlePaymentMethodChange('card')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="ml-3 text-blue-600"
                        />
                        <CreditCard className="h-5 w-5 text-blue-600 ml-2" />
                        <span className="font-medium">البطاقة الائتمانية (واجهة كاشير التقليدية)</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1 mr-10">
                        Visa, Mastercard - واجهة دفع تقليدية مألوفة ومجربة
                      </p>
                    </div>

                    {/* PayPal Payment */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'paypal' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => handlePaymentMethodChange('paypal')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                          className="ml-3 text-blue-600"
                        />
                        <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="#003087">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.098-.24c-.543-1.24-1.51-2.053-2.8-2.35a8.006 8.006 0 0 0-1.92-.22H9.232c-.524 0-.967.38-1.05.9L7.076 8.96c-.083.52.263.96.787.96h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.15.053-.294.077-.437z"/>
                        </svg>
                        <span className="font-medium">PayPal</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mr-10">
                        ادفع بأمان عبر PayPal
                      </p>
                    </div>

                    {/* Apple Pay Payment */}
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.paymentMethod === 'apple_pay' 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                      onClick={() => handlePaymentMethodChange('apple_pay')}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="apple_pay"
                          checked={formData.paymentMethod === 'apple_pay'}
                          onChange={handleInputChange}
                          className="ml-3 text-gray-600"
                        />
                        <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5C17.16 20.38 15.58 20.8 14.28 20.8C12.98 20.8 11.4 20.38 9.85 19.5C8.3 18.62 6.75 17.74 5.2 17.74C3.65 17.74 2.1 18.62 0.55 19.5V17.74C2.1 16.86 3.65 16.44 5.2 16.44C6.75 16.44 8.3 16.86 9.85 17.74C11.4 18.62 12.98 19.04 14.28 19.04C15.58 19.04 17.16 18.62 18.71 17.74V19.5Z"/>
                        </svg>
                        <span className="font-medium">Apple Pay (كاشير)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mr-10">
                        دفع سريع وآمن عبر Apple Pay
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                    <Gift className="h-5 w-5 ml-2" />
                    منتج مجاني
                  </h4>
                  <p className="text-sm text-green-800">
                    هذا المنتج مجاني! أكمل الطلب للحصول عليه.
                  </p>
                </div>
              )}

              {/* Submit Button Section */}
              {showPaymentMethods ? (
                <>
                  {/* Payment Buttons Based on Selected Method */}
                  {formData.paymentMethod === 'card' && (
                    <button
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className={`w-full py-3 px-4 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        isFormValid 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 ml-2" />
                          {currencyConversion ? 'جاري التحويل لكاشير...' : 'جاري الاتصال بكاشير...'}
                        </div>
                      ) : !isFormValid ? (
                        <div className="flex items-center justify-center">
                          يرجى ملء جميع البيانات المطلوبة
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          إتمام الدفع بالبطاقة - <SimplePrice amount={totalAmount} className="text-white" />
                        </div>
                      )}
                    </button>
                  )}

                  {formData.paymentMethod === 'paypal' && isFormValid && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 text-center">
                        اضغط على زر PayPal للمتابعة
                      </p>
                      <PayPalButton
                        amount={totalAmount}
                        currency="USD"
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        disabled={isLoading || !isFormValid}
                      />
                    </div>
                  )}

                  {formData.paymentMethod === 'apple_pay' && isFormValid && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 text-center">
                        اضغط على زر Apple Pay للمتابعة
                      </p>
                      <ApplePayButton
                        amount={totalAmount}
                        currency="EGP"
                        onSuccess={handleApplePaySuccess}
                        onError={handleApplePayError}
                        orderData={{
                          items: items.map(item => ({
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                          })),
                          customer: {
                            ...formData,
                            phone: `${formData.phoneCountry.phoneCode}${formData.phone}`,
                            country: formData.phoneCountry.nameAr,
                            countryCode: formData.phoneCountry.code
                          },
                          totals: {
                            subtotal,
                            total: totalAmount
                          }
                        }}
                        disabled={isLoading || !isFormValid}
                      />
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full py-3 px-4 rounded-lg font-semibold focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    isFormValid 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 ml-2" />
                      جاري المعالجة...
                    </div>
                  ) : !isFormValid ? (
                    <div className="flex items-center justify-center">
                      يرجى ملء جميع البيانات المطلوبة
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      الحصول على المنتج المجاني
                    </div>
                  )}
                </button>
              )}
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ملخص الطلب</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    <div className="flex items-center gap-2">
                      <SimplePrice amount={getProductPrice(item)} className="text-gray-900" />
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        منتج رقمي
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    <SimplePrice amount={getProductPrice(item) * item.quantity} className="text-gray-900" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm dir-rtl">
                <span>المجموع الفرعي:</span>
                <SimplePrice amount={subtotal} className="text-gray-900" />
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm dir-rtl">
                  <span>خصم الكوبون:</span>
                  <span className="text-green-600 font-medium">
                    -<SimplePrice amount={discountAmount} className="text-green-600" />
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm dir-rtl">
                <span>رسوم الشحن:</span>
                <span className="text-green-600 font-medium">مجاني (منتجات رقمية)</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 dir-rtl">
                <span>المجموع الكلي:</span>
                <PriceDisplay amount={totalAmount} size="md" className="text-blue-600" />
              </div>
            </div>

            {/* معلومات تحويل العملة */}
            {currencyConversion && currencyConversion.originalCurrency !== 'EGP' && (
              <div className="mt-6">
                <CurrencyConverter
                  originalAmount={currencyConversion.originalAmount}
                  originalCurrency={currencyConversion.originalCurrency}
                  convertedAmount={currencyConversion.kashierAmount}
                  convertedCurrency={currencyConversion.kashierCurrency}
                  exchangeRate={currencyConversion.exchangeRate}
                  isLiveRate={currencyConversion.isLiveRate}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Currency Conversion Modal */}
      {currencyConversion && (
        <CurrencyConversionModal
          isOpen={showConversionModal}
          onClose={() => setShowConversionModal(false)}
          originalAmount={currencyConversion.originalAmount}
          originalCurrency={currencyConversion.originalCurrency}
          convertedAmount={currencyConversion.kashierAmount}
          convertedCurrency={currencyConversion.kashierCurrency}
          exchangeRate={currencyConversion.exchangeRate}
          isLiveRate={currencyConversion.isLiveRate}
        />
      )}

      {/* EGP Payment Modal */}
      <EgpPaymentModal
        isOpen={showEgpModal}
        onClose={() => setShowEgpModal(false)}
        amount={totalAmount}
      />
    </div>
  );
}