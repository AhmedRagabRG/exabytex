'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DebugProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.slice(0, 5)); // أول 5 منتجات
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const testProduct = async (productId: string) => {
    setLoading(true);
    setTestResult(null);
    setSelectedProductId(productId);

    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        data: result,
        status: response.status,
        url: `/api/products/${productId}`
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: 'فشل في الاتصال بالسيرفر',
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ success }: { success: boolean }) => {
    return success ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تشخيص صفحات المنتجات</h1>
          <p className="text-gray-600">فحص سبب الصفحة البيضاء في صفحات المنتجات</p>
        </div>

        {/* قائمة المنتجات للاختبار */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">المنتجات المتاحة</h2>
          
          {loading && products.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="mr-2">جاري تحميل المنتجات...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900 mb-2 truncate">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => testProduct(product.id)}
                      disabled={loading && selectedProductId === product.id}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {loading && selectedProductId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      اختبار API
                    </button>
                    
                    <Link 
                      href={`/store/${product.id}`}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 text-center"
                    >
                      عرض الصفحة
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* نتائج الاختبار */}
        {testResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <StatusIcon success={testResult.success} />
              <h2 className="text-xl font-semibold">
                نتيجة اختبار API
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`mr-2 px-2 py-1 rounded text-sm ${
                    testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {testResult.status || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">URL:</span>
                  <span className="mr-2 text-sm text-gray-600">{testResult.url}</span>
                </div>
              </div>

              {testResult.success && testResult.data ? (
                <div>
                  <h3 className="font-medium mb-2">بيانات المنتج:</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>العنوان:</strong> {testResult.data.title}</div>
                      <div><strong>السعر:</strong> {testResult.data.price} ر.س</div>
                      <div><strong>الفئة:</strong> {testResult.data.category}</div>
                      <div><strong>نشط:</strong> {testResult.data.isActive ? 'نعم' : 'لا'}</div>
                      <div><strong>شائع:</strong> {testResult.data.isPopular ? 'نعم' : 'لا'}</div>
                      <div><strong>خصم:</strong> {testResult.data.hasDiscount ? 'نعم' : 'لا'}</div>
                    </div>
                    
                    {testResult.data.features && testResult.data.features.length > 0 && (
                      <div className="mt-4">
                        <strong>المميزات:</strong>
                        <ul className="list-disc list-inside mt-1 text-sm">
                          {testResult.data.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium mb-2 text-red-600">خطأ:</h3>
                  <div className="bg-red-50 p-4 rounded">
                    <pre className="text-sm text-red-800 whitespace-pre-wrap">
                      {JSON.stringify(testResult.data || testResult.error, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600">
                  عرض الاستجابة الكاملة
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* إرشادات التشخيص */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">خطوات تشخيص الصفحة البيضاء</h2>
          
          <div className="space-y-6">
            <div className="border-r-4 border-red-400 pr-4">
              <h3 className="font-medium text-red-800 mb-2">1. تحقق من الأخطاء في Console:</h3>
              <ul className="list-disc list-inside text-sm text-red-700">
                <li>افتح Developer Tools (F12)</li>
                <li>اذهب لـ Console tab</li>
                <li>ابحث عن أخطاء JavaScript باللون الأحمر</li>
                <li>تحقق من Network tab للطلبات الفاشلة</li>
              </ul>
            </div>
            
            <div className="border-r-4 border-yellow-400 pr-4">
              <h3 className="font-medium text-yellow-800 mb-2">2. تحقق من استجابة API:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                <li>اختبر API للمنتج باستخدام الأزرار أعلاه</li>
                <li>تأكد من أن البيانات تُرجع بشكل صحيح</li>
                <li>تحقق من أن جميع الحقول المطلوبة موجودة</li>
              </ul>
            </div>
            
            <div className="border-r-4 border-blue-400 pr-4">
              <h3 className="font-medium text-blue-800 mb-2">3. تحقق من المكونات:</h3>
              <ul className="list-disc list-inside text-sm text-blue-700">
                <li>ProductImage component</li>
                <li>AddToCartButton component</li>
                <li>SimpleActionButtons component</li>
                <li>ProductReviewsSection component</li>
              </ul>
            </div>
            
            <div className="border-r-4 border-green-400 pr-4">
              <h3 className="font-medium text-green-800 mb-2">4. الأسباب الشائعة:</h3>
              <ul className="list-disc list-inside text-sm text-green-700">
                <li>خطأ في port number (تم إصلاحه من 3003 إلى 3001)</li>
                <li>مشكلة في تحليل JSON للـ features</li>
                <li>خطأ في استدعاء useSession</li>
                <li>مشكلة في next-auth configuration</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 نصائح سريعة:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• تم إصلاح port number في getProduct function</li>
              <li>• تحقق من أن المنتج موجود في قاعدة البيانات</li>
              <li>• تأكد من أن جميع المكونات الفرعية تعمل</li>
              <li>• راجع console.log في terminal السيرفر</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/store"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 inline-block"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
} 