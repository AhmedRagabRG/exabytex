'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar, 
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  coverImage?: string;
  tags: string[];
  status: string;
  published: boolean;
  publishedAt: Date;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

interface EditBlogPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [blogId, setBlogId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [] as string[]
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        const resolvedParams = await params;
        setBlogId(resolvedParams.id);
        
        if (status === 'loading') return;
        
        if (!session) {
          router.push('/auth/signin');
          return;
        }

        // Fetch the blog post
        const response = await fetch(`/api/blogs/${resolvedParams.id}/edit`, {
          method: 'GET'
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'فشل في تحميل المقال');
          return;
        }

        const postData = await response.json();
        setPost(postData);
        setFormData({
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage || '',
          tags: postData.tags
        });
      } catch (error) {
        console.error('Error loading blog post:', error);
        setError('حدث خطأ في تحميل المقال');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [params, session, status, router]);

  const canEditPost = () => {
    if (!session?.user?.email || !post) return false;
    
    // Admin or Manager can edit any blog
    const userRole = (session.user as any)?.role;
    if (userRole === 'ADMIN' || userRole === 'MANAGER') return true;
    
    // Author can edit their own blog
    return post.author.email === session.user.email;
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      setError('العنوان والملخص والمحتوى مطلوبة');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/blogs/${blogId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        router.push(`/blog/${updatedPost.slug}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في حفظ التغييرات');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError('حدث خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">خطأ في التحميل</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/blog">
              <Button>العودة إلى المدونة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canEditPost()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">غير مصرح</h2>
            <p className="text-gray-600 mb-4">ليس لديك صلاحية لتعديل هذا المقال</p>
            <Link href="/blog">
              <Button>العودة إلى المدونة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href={`/blog/${post?.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة إلى المقال
          </Link>

          <div className="flex items-center gap-3">
            <Link href={`/blog/${post?.slug}`}>
              <Button variant="outline">
                <Eye className="h-4 w-4 ml-1" />
                معاينة
              </Button>
            </Link>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 ml-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 ml-1" />
              )}
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تعديل المقال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان المقال
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="اكتب عنوان المقال..."
                    className="text-lg"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    ملخص المقال
                  </label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="اكتب ملخص المقال..."
                    rows={3}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                    رابط صورة الغلاف (اختياري)
                  </label>
                  <Input
                    id="coverImage"
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.coverImage && (
                    <div className="mt-3">
                      <Image
                        src={formData.coverImage}
                        alt="معاينة الصورة"
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    العلامات (منفصلة بفواصل)
                  </label>
                  <Input
                    id="tags"
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="تقنية, برمجة, ذكاء اصطناعي"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    محتوى المقال
                  </label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="اكتب محتوى المقال بتنسيق HTML..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات المقال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {post?.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {post?.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{post?.author.name}</p>
                    <p className="text-sm text-gray-500">المؤلف</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>تاريخ الإنشاء: {post && new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>آخر تحديث: {post && new Date(post.updatedAt).toLocaleDateString('ar-EG')}</span>
                </div>

                <Badge className={`w-fit ${
                  post?.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                  post?.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                  post?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {post?.status === 'PUBLISHED' && 'منشور'}
                  {post?.status === 'APPROVED' && 'مقبول'}
                  {post?.status === 'PENDING' && 'في الانتظار'}
                  {post?.status === 'REJECTED' && 'مرفوض'}
                </Badge>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">إجراءات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 ml-1" />
                  )}
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
                
                <Link href={`/blog/${post?.slug}`} className="block">
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 ml-1" />
                    معاينة المقال
                  </Button>
                </Link>
                
                <Link href="/blog" className="block">
                  <Button variant="ghost" className="w-full">
                    العودة إلى المدونة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 