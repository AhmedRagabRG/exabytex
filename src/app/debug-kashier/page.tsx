'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function DebugKashierPage() {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      const response = await fetch('/api/kashier/create-payment');
      const data = await response.json();
      setConfigStatus(data);
    } catch (error) {
      console.error('Error checking config:', error);
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    setLoading(true);
    try {
      const testData = {
        items: [
          {
            id: 'test-1',
            name: 'منتج تجريبي',
            price: 10,
            quantity: 1
          }
        ],
        customer: {
          firstName: 'أحمد',
          lastName: 'محمد',
          email: 'test@example.com',
          phone: '01234567890'
        },
        totals: {
          total: 10
        }
      };

      const response = await fetch('/api/kashier/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: 'فشل في الاختبار', details: error });
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status.includes('✅')) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status.includes('❌')) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تشخيص إعدادات كاشير</h1>
          <p className="text-gray-600">فحص إعدادات الدفع واستكشاف المشاكل</p>
        </div>

        {/* حالة الإعدادات */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">حالة الإعدادات</h2>
          
          {loading && !configStatus ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="mr-2">جاري فحص الإعدادات...</span>
            </div>
          ) : configStatus ? (
            <div className="space-y-4">
              {Object.entries(configStatus.config || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{key}:</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={value as string} />
                    <span>{String(value)}</span>
                  </div>
                </div>
              ))}
              
              {configStatus.instructions && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">{configStatus.instructions}</p>
                </div>
              )}
              
              {configStatus.sampleEnvFile && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">ملف .env.local المطلوب:</h3>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                    {configStatus.sampleEnvFile}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">فشل في تحميل حالة الإعدادات</div>
          )}
        </div>

        {/* اختبار الدفع */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">اختبار جلسة الدفع</h2>
          
          <button
            onClick={testPayment}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            اختبار إنشاء دفعة (10 ج.م)
          </button>

          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">نتيجة الاختبار:</h3>
              <pre className="text-sm overflow-x-auto bg-gray-800 text-green-400 p-4 rounded">
                {JSON.stringify(testResult, null, 2)}
              </pre>
              
              {testResult.success && testResult.paymentUrl && (
                <div className="mt-4">
                  <a 
                    href={testResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded inline-block hover:bg-green-700"
                  >
                    جرب رابط الدفع
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* إرشادات استكشاف الأخطاء */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">إرشادات استكشاف الأخطاء</h2>
          
          <div className="space-y-4">
            <div className="border-r-4 border-yellow-400 pr-4">
              <h3 className="font-medium text-yellow-800">إذا كانت الصفحة تعمل loading:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                <li>تحقق من صحة بيانات كاشير في .env.local</li>
                <li>تأكد من تفعيل حساب كاشير</li>
                <li>افحص Developer Tools → Console للأخطاء</li>
                <li>تأكد من أن Merchant ID يبدأ بـ MID-</li>
              </ul>
            </div>
            
            <div className="border-r-4 border-blue-400 pr-4">
              <h3 className="font-medium text-blue-800">خطوات التحقق:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-700 mt-2">
                <li>تأكد من وجود ملف .env.local في المجلد الرئيسي</li>
                <li>أعد تشغيل السيرفر بعد تعديل .env.local</li>
                <li>جرب بيانات العميل الافتراضية أعلاه</li>
                <li>تحقق من Network Tab في Developer Tools</li>
              </ol>
            </div>
            
            <div className="border-r-4 border-green-400 pr-4">
              <h3 className="font-medium text-green-800">بيانات اختبار البطاقة:</h3>
              <div className="text-sm text-green-700 mt-2">
                <p><strong>رقم البطاقة:</strong> 4111111111111111</p>
                <p><strong>تاريخ الانتهاء:</strong> 12/25</p>
                <p><strong>CVV:</strong> 123</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="/checkout"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            العودة لصفحة الدفع
          </a>
        </div>
      </div>
    </div>
  );
} 