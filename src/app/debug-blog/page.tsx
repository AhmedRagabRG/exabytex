'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Database, Bug, TestTube } from 'lucide-react';

export default function DebugBlogPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    title: 'مقال تجريبي للاختبار',
    excerpt: 'هذا ملخص مقال تجريبي لاختبار النظام',
    content: 'هذا محتوى المقال التجريبي. يحتوي على نص عادي لاختبار إنشاء المقالات.',
    coverImage: '',
    tags: ['اختبار', 'تجريبي']
  });

  const testCreateBlog = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('إرسال البيانات:', testData);
      
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        data: result,
        response: response
      });

      console.log('استجابة السيرفر:', result);

    } catch (error) {
      console.error('خطأ في الطلب:', error);
      setTestResult({
        success: false,
        error: 'خطأ في الاتصال: ' + (error as any).message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs?status=ALL');
      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        data: result,
        type: 'GET'
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: 'خطأ في جلب المقالات: ' + (error as any).message,
        type: 'GET'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            تشخيص المدونة
          </h1>
          <p className="text-gray-300">فحص وتشخيص مشاكل نظام المدونة</p>
        </div>

        {/* معلومات الجلسة */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              معلومات الجلسة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'loading' ? (
              <p className="text-gray-300">جاري التحميل...</p>
            ) : session ? (
              <div className="space-y-2 text-gray-300">
                <div><strong>الاسم:</strong> {session.user?.name}</div>
                <div><strong>البريد:</strong> {session.user?.email}</div>
                <div><strong>الصورة:</strong> {session.user?.image || 'لا توجد'}</div>
                <Badge className="bg-green-500/20 text-green-300">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  مسجل دخول
                </Badge>
              </div>
            ) : (
              <div className="text-red-300">
                <Badge className="bg-red-500/20 text-red-300">
                  <XCircle className="h-3 w-3 ml-1" />
                  غير مسجل دخول
                </Badge>
                <p className="mt-2">يجب تسجيل الدخول لاختبار إنشاء المقالات</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* بيانات الاختبار */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TestTube className="h-5 w-5" />
              بيانات الاختبار
            </CardTitle>
            <CardDescription className="text-gray-300">
              يمكنك تعديل البيانات لاختبار حالات مختلفة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">العنوان</label>
              <Input
                value={testData.title}
                onChange={(e) => setTestData({...testData, title: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">الملخص</label>
              <Textarea
                value={testData.excerpt}
                onChange={(e) => setTestData({...testData, excerpt: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">المحتوى</label>
              <Textarea
                value={testData.content}
                onChange={(e) => setTestData({...testData, content: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رابط الصورة (اختياري)</label>
              <Input
                value={testData.coverImage}
                onChange={(e) => setTestData({...testData, coverImage: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* أزرار الاختبار */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bug className="h-5 w-5" />
              اختبارات النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={testCreateBlog}
                disabled={loading || !session}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار إنشاء مقال'}
              </Button>
              
              <Button
                onClick={testGetBlogs}
                disabled={loading}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                اختبار جلب المقالات
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* نتائج الاختبار */}
        {testResult && (
          <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <StatusIcon success={testResult.success} />
                نتائج الاختبار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-300">الحالة:</span>
                  <Badge className={`mr-2 ${
                    testResult.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {testResult.status || 'خطأ'}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-300">النوع:</span>
                  <span className="mr-2 text-gray-400">{testResult.type || 'POST'}</span>
                </div>
              </div>

              {testResult.success ? (
                <div>
                  <h4 className="font-medium text-green-300 mb-2">✅ نجح الاختبار!</h4>
                  <div className="bg-green-500/10 p-4 rounded border border-green-500/20">
                    <pre className="text-sm text-green-200 whitespace-pre-wrap overflow-auto max-h-64">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-red-300 mb-2">❌ فشل الاختبار</h4>
                  <div className="bg-red-500/10 p-4 rounded border border-red-500/20">
                    <div className="text-red-200 mb-2">
                      <strong>الخطأ:</strong> {testResult.data?.error || testResult.error || 'خطأ غير معروف'}
                    </div>
                    {testResult.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-red-300">تفاصيل الاستجابة</summary>
                        <pre className="text-xs text-red-200 mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* إرشادات التشخيص */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5" />
              خطوات التشخيص
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">1. تحقق من تسجيل الدخول</h4>
                <p className="text-sm">تأكد من أنك مسجل دخول بشكل صحيح</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">2. تحقق من البيانات المطلوبة</h4>
                <p className="text-sm">العنوان، الملخص، والمحتوى مطلوبة</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">3. راجع console السيرفر</h4>
                <p className="text-sm">ابحث عن رسائل خطأ في terminal</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">4. تحقق من قاعدة البيانات</h4>
                <p className="text-sm">تأكد من أن BlogPost schema صحيح</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 