'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, Clock, MapPin, Phone, Mail, Home, FileText } from 'lucide-react';

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Resolve params first
    params.then((resolvedParams) => {
      setOrderId(resolvedParams.orderId);
      
      // محاكاة جلب بيانات الطلب
      setTimeout(() => {
        setOrderData({
          id: resolvedParams.orderId,
        status: 'confirmed',
        total: 1850,
        currency: 'EGP',
        paymentMethod: 'cash_on_delivery',
        items: [
          {
            name: 'نظام أتمتة الرد الآلي المتقدم',
            price: 1500,
            quantity: 1,
            image: '/images/ai-chat.jpg'
          },
          {
            name: 'استشارة تقنية لمدة ساعة',
            price: 350,
            quantity: 1,
            image: '/images/consultation.jpg'
          }
        ],
        customer: {
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '01234567890',
          address: 'شارع النصر، المعادي، القاهرة',
          governorate: 'القاهرة'
        },
        totals: {
          subtotal: 1800,
          deliveryFee: 50,
          total: 1850
        },
        estimatedDelivery: '1-2 أيام عمل',
        orderDate: new Date().toISOString(),
        trackingNumber: 'TRK-' + Math.random().toString(36).substring(7).toUpperCase()
              });
        setIsLoading(false);
      }, 1000);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* رسالة التأكيد الرئيسية */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ✅ تم تأكيد طلبك!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            شكراً لك! تم استلام طلبك وسيتم تجهيزه قريباً
          </p>
          <p className="text-lg text-green-600 font-medium">
            رقم الطلب: {orderData?.id || orderId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* تفاصيل الطلب */}
          <div className="lg:col-span-2 space-y-6">
            {/* ملخص الطلب */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 ml-2" />
                تفاصيل الطلب
              </h2>
              
              <div className="space-y-4">
                {orderData?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/64/64';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-600">الكمية: {item.quantity}</span>
                        <span className="font-semibold text-green-600">
                          {item.price.toLocaleString('ar-SA')} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{orderData?.totals.subtotal.toLocaleString('ar-SA')} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم التوصيل</span>
                  <span className="font-medium">{orderData?.totals.deliveryFee.toLocaleString('ar-SA')} ج.م</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>المجموع الكلي</span>
                  <span className="text-green-600">{orderData?.total.toLocaleString('ar-SA')} ج.م</span>
                </div>
              </div>
            </div>

            {/* معلومات التوصيل */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 ml-2" />
                معلومات التوصيل
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">اسم العميل</label>
                  <p className="text-gray-900 font-medium">{orderData?.customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
                  <p className="text-gray-900 font-medium">{orderData?.customer.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-600">عنوان التوصيل</label>
                  <p className="text-gray-900 font-medium">{orderData?.customer.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">المحافظة</label>
                  <p className="text-gray-900 font-medium">{orderData?.customer.governorate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم التتبع</label>
                  <p className="text-gray-900 font-medium">{orderData?.trackingNumber}</p>
                </div>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">طريقة الدفع</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Package className="h-5 w-5 text-blue-600 ml-2" />
                  <span className="font-medium text-blue-900">الدفع عند الاستلام</span>
                </div>
                <p className="text-blue-700 text-sm">
                  ستدفع المبلغ نقداً لممثل التوصيل عند استلام طلبك
                </p>
                <p className="text-blue-700 text-sm font-medium mt-2">
                  المبلغ المطلوب: {orderData?.total.toLocaleString('ar-SA')} ج.م
                </p>
              </div>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* حالة الطلب */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة الطلب</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">تم تأكيد الطلب</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(orderData?.orderDate).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">التجهيز</h4>
                    <p className="text-sm text-gray-600">سيتم تجهيز طلبك خلال 24 ساعة</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">الشحن</h4>
                    <p className="text-sm text-gray-500">خلال {orderData?.estimatedDelivery}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">التسليم</h4>
                    <p className="text-sm text-gray-500">سيتم إشعارك عند الوصول</p>
                  </div>
                </div>
              </div>
            </div>

            {/* الوقت المتوقع */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-blue-600 ml-2" />
                <h3 className="font-semibold text-blue-900">وقت التسليم المتوقع</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900 mb-2">
                {orderData?.estimatedDelivery}
              </p>
              <p className="text-blue-700 text-sm">
                سنتواصل معك قبل التوصيل لتأكيد الموعد
              </p>
            </div>

            {/* معلومات مهمة */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">معلومات مهمة</h3>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• تأكد من توفر المبلغ نقداً عند التوصيل</li>
                <li>• احتفظ برقم الطلب للمتابعة</li>
                <li>• سيتم التواصل معك لتأكيد الموعد</li>
                <li>• يمكنك إلغاء الطلب خلال ساعتين</li>
              </ul>
            </div>

            {/* أزرار العمل */}
            <div className="space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
              >
                <FileText className="h-4 w-4 ml-2" />
                طباعة تفاصيل الطلب
              </button>
              
              <button
                onClick={() => router.push('/store')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center"
              >
                <Package className="h-4 w-4 ml-2" />
                تصفح المزيد من المنتجات
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
        </div>

        {/* معلومات الاتصال */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أسئلة حول طلبك؟</h3>
          <p className="text-gray-600 mb-6">فريق خدمة العملاء متاح لمساعدتك</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a 
              href="tel:+201234567890"
              className="flex items-center justify-center bg-green-50 text-green-600 py-3 px-6 rounded-lg hover:bg-green-100"
            >
              <Phone className="h-4 w-4 ml-2" />
              اتصل بنا
            </a>
            
            <a 
              href="mailto:support@aiagency.com"
              className="flex items-center justify-center bg-blue-50 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-100"
            >
              <Mail className="h-4 w-4 ml-2" />
              راسلنا
            </a>
            
            <button className="flex items-center justify-center bg-purple-50 text-purple-600 py-3 px-6 rounded-lg hover:bg-purple-100">
              <MapPin className="h-4 w-4 ml-2" />
              تتبع الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}