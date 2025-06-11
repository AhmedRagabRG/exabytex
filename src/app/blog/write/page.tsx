'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Image as ImageIcon, Tag, Send, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function WriteBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [] as string[]
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // التحقق من تسجيل الدخول
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      setMessage({ type: 'error', text: 'جميع الحقول الأساسية مطلوبة' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: result.status === 'PUBLISHED' 
            ? 'تم نشر المقال بنجاح!' 
            : 'تم إرسال المقال للمراجعة بنجاح!' 
        });
        
        // إعادة تعيين النموذج
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          coverImage: '',
          tags: []
        });

        // إعادة توجيه بعد 2 ثانية
        setTimeout(() => {
          router.push('/blog');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'حدث خطأ أثناء إرسال المقال' });
      }
    } catch (error) {
      console.log(error)
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            كتابة مقال جديد
          </h1>
          <p className="text-gray-300 text-lg">
            شارك أفكارك ومعرفتك مع المجتمع
          </p>
        </div>

        {/* Message */}
        {message && (
          <Card className="mb-6 border-0 bg-white/10 backdrop-blur-md">
            <CardContent className="p-4">
              <div className={`flex items-center gap-2 ${
                message.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {message.type === 'success' ? 
                  <CheckCircle className="h-5 w-5" /> : 
                  <AlertCircle className="h-5 w-5" />
                }
                <span>{message.text}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PenTool className="h-6 w-6 text-blue-400" />
              تفاصيل المقال
            </CardTitle>
            <CardDescription className="text-gray-300">
              املأ البيانات التالية لإنشاء مقالك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* العنوان */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عنوان المقال *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="اكتب عنوان مقالك هنا..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* الملخص */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ملخص المقال *
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="اكتب ملخص قصير عن المقال..."
                  rows={3}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* صورة الغلاف */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ImageIcon className="inline h-4 w-4 ml-1" />
                  رابط صورة الغلاف
                </label>
                <Input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* الكلمات المفتاحية */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag className="inline h-4 w-4 ml-1" />
                  الكلمات المفتاحية
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="أضف كلمة مفتاحية..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    إضافة
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 cursor-pointer hover:bg-red-500/20 hover:text-red-300"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* محتوى المقال */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  محتوى المقال *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="اكتب محتوى مقالك هنا... يمكنك استخدام Markdown للتنسيق"
                  rows={15}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 font-mono"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  يمكنك استخدام Markdown للتنسيق (العناوين، القوائم، الروابط، إلخ...)
                </p>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      نشر المقال
                    </>
                  )}
                </Button>
                
                <Link href="/blog">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    إلغاء
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">💡 نصائح للكتابة:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• اكتب عنوان جذاب ووصفي</li>
            <li>• استخدم ملخص يوضح محتوى المقال بشكل مختصر</li>
            <li>• أضف كلمات مفتاحية ذات صلة لتسهيل البحث</li>
            <li>• استخدم Markdown للتنسيق (# للعناوين، ** للخط العريض، إلخ...)</li>
            <li>• {(session?.user as any)?.role === 'MANAGER' || (session?.user as any)?.role === 'ADMIN' 
              ? 'سيتم نشر مقالك مباشرة لأن لديك صلاحيات إدارية' 
              : 'سيتم إرسال مقالك للمراجعة من قبل المديرين قبل النشر'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 