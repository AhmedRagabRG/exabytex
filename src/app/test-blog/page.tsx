'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function TestBlogPage() {
  const { data: session } = useSession();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCreateBlog = async () => {
    setLoading(true);
    setResult(null);

    const testData = {
      title: 'مقال تجريبي للاختبار',
      excerpt: 'هذا ملخص مقال تجريبي لاختبار النظام',
      content: 'هذا محتوى المقال التجريبي. يحتوي على نص عادي لاختبار إنشاء المقالات.',
      coverImage: '',
      tags: ['اختبار', 'تجريبي']
    };

    try {
      console.log('إرسال البيانات:', testData);
      
      const response = await fetch('/api/blogs/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data
      });

      console.log('استجابة السيرفر:', data);

    } catch (error: any) {
      console.error('خطأ في الطلب:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">اختبار المدونة</h1>
        
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-4">معلومات الجلسة:</h2>
          {session ? (
            <div>
              <p>الاسم: {session.user?.name}</p>
              <p>البريد: {session.user?.email}</p>
              <p className="text-green-400">✅ مسجل دخول</p>
            </div>
          ) : (
            <p className="text-red-400">❌ غير مسجل دخول</p>
          )}
        </div>

        <button
          onClick={testCreateBlog}
          disabled={loading || !session}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {loading ? 'جاري الاختبار...' : 'اختبار إنشاء مقال'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-800 rounded">
            <h3 className="text-lg font-semibold mb-2">النتيجة:</h3>
            <div className={`mb-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.success ? '✅ نجح!' : '❌ فشل!'}
            </div>
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 