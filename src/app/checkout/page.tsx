'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, User, Phone, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { useSession } from 'next-auth/react';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentMethod: 'card';
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, isLoading: cartLoading } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'card'
  });

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const totalAmount = subtotal;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'الاسم الأخير مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    else if (!/^(\+201|01)[0-9]{9}$/.test(formData.phone)) newErrors.phone = 'رقم الهاتف غير صحيح';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.product.title,
          price: item.product.price,
          originalPrice: item.product.price,
          quantity: item.quantity,
          image: item.product.image || ''
        })),
        customer: formData,
        totals: {
          subtotal,
          deliveryFee: 0,
          total: totalAmount
        },
        paymentMethod: formData.paymentMethod
      };

      console.log('Sending order data:', orderData);

      const paymentResponse = await fetch('/api/kashier/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await paymentResponse.json();
      console.log('Kashier Response:', result);

      if (result.success && result.paymentUrl && result.paymentUrl !== '#') {
        localStorage.setItem('pendingOrderId', result.orderId);
        window.location.href = result.paymentUrl;
      } else {
        alert('إعدادات كاشير غير مكتملة. تأكد من إضافة بيانات كاشير في متغيرات البيئة.');
        console.error('Kashier settings incomplete:', result);
      }
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="01234567890"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 ml-2" />
                  طريقة الدفع
                </h3>
                <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-blue-600 ml-2" />
                    <span className="font-medium">دفع فوري بالبطاقة</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Visa, Mastercard, فودافون كاش، أورانج موني
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    المنتجات الرقمية تتطلب الدفع الفوري
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">ملاحظات مهمة:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• ستحصل على المنتجات فوراً بعد إتمام الدفع</li>
                  <li>• سيتم إرسال روابط التحميل على بريدك الإلكتروني</li>
                  <li>• خدمة دعم فني 24/7 لمساعدتك</li>
                  <li>• ضمان استرداد لمدة 30 يوم</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 ml-2" />
                    جاري الاتصال بكاشير...
                  </div>
                ) : (
                  `إتمام الدفع - ${totalAmount.toFixed(2)} ج.م`
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">ملخص الطلب</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product.image ? (
                        <Image 
                          src={item.product.image} 
                          alt={item.product.title}
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
                      {item.product.title}
                    </h4>
                    <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {item.product.price.toFixed(2)} ج.م
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        منتج رقمي
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {(item.product.price * item.quantity).toFixed(2)} ج.م
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>رسوم الشحن:</span>
                <span className="text-green-600 font-medium">مجاني (منتجات رقمية)</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span>المجموع الكلي:</span>
                <span className="text-blue-600">{totalAmount.toFixed(2)} ج.م</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">مميزات المنتجات الرقمية:</h4>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• تحميل فوري بعد الدفع</li>
                <li>• دعم فني مدى الحياة</li>
                <li>• تحديثات مجانية</li>
                <li>• ضمان الجودة 100%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}