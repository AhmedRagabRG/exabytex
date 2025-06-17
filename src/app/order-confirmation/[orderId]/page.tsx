'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    description: string;
    image: string | null;
    downloadUrl: string | null;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmation() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        console.log('Order data:', data); // للتأكد من البيانات
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('حدث خطأ في تحميل تفاصيل الطلب');
      } finally {
        setLoading(false);
      }
    };

    if (params.orderId) {
      fetchOrder();
    }
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-800">لم يتم العثور على الطلب</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              تم تأكيد طلبك بنجاح!
            </h1>
            <p className="text-gray-600">
              شكراً لك على طلبك. يمكنك الآن تحميل منتجاتك من الروابط أدناه.
            </p>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">رقم الطلب:</span> {order.id}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">تاريخ الطلب:</span>{' '}
              {new Date(order.createdAt).toLocaleDateString('ar-EG')}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">إجمالي المبلغ:</span>{' '}
              {order.total.toLocaleString('ar-EG')} ج.م
            </div>
          </div>
        </div>

        {/* Download Links */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              روابط التحميل
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              اضغط على زر التحميل لكل منتج للحصول على الملفات الخاصة بك
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="p-6 flex items-center gap-4">
                {item.product.image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {item.product.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {item.product.description}
                  </p>
                </div>

                {item.product.downloadUrl ? (
                  <a
                    href={item.product.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    تحميل
                  </a>
                ) : (
                  <span className="text-sm text-red-500">
                    لا يوجد رابط تحميل متاح
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}