'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  PenTool, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  Eye,
  BookOpen,
  TrendingUp,
  Star,
  Edit
} from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export default function BlogPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs?status=PUBLISHED&limit=50');
      const data = await response.json();
      // الـ API الجديد يرجع { success: true, data: { blogs: [...] } }
      const rawBlogs = data.success && data.data ? data.data.blogs : (data.blogs || []);
      
      // معالجة tags - تحويل من string إلى array إذا لزم الأمر
      const processedBlogs = rawBlogs.map((blog: any) => ({
        ...blog,
        tags: Array.isArray(blog.tags) 
          ? blog.tags 
          : (typeof blog.tags === 'string' ? JSON.parse(blog.tags || '[]') : [])
      }));
      
      setBlogs(processedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // استخراج جميع التاجز
  const allTags = Array.from(
    new Set(blogs.flatMap(blog => Array.isArray(blog.tags) ? blog.tags : []))
  ).slice(0, 20); // أول 20 تاج

  // تصفية المقالات
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = !searchTerm || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || (Array.isArray(blog.tags) && blog.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  const featuredBlogs = filteredBlogs.filter(blog => blog.featured).slice(0, 3);
  const regularBlogs = filteredBlogs.filter(blog => !blog.featured);

  // Helper function to check if user can edit a blog
  const canEditBlog = (blog: Blog) => {
    if (!session?.user?.email) return false;
    
    // Admin or Manager can edit any blog
    const userRole = (session.user as any)?.role;
    if (userRole === 'ADMIN' || userRole === 'MANAGER') return true;
    
    // Author can edit their own blog
    return blog.author.email === session.user.email;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="h-12 w-12 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              مدونة Exa ByteX
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            اكتشف أحدث المقالات والنصائح في عالم التكنولوجيا والذكاء الاصطناعي
          </p>
          
          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog/write">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                <PenTool className="h-5 w-5 ml-2" />
                اكتب مقال
              </Button>
            </Link>
          </div>
        </div>

        {/* بحث وفلاتر */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* البحث */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ابحث في المقالات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 text-lg"
                  />
                </div>
              </div>
              
              {/* التاجز */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedTag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                  className={!selectedTag 
                    ? "bg-blue-600 text-white" 
                    : "border-white/20 text-white hover:bg-white/10"
                  }
                >
                  الكل
                </Button>
                {allTags.slice(0, 6).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={selectedTag === tag 
                      ? "bg-blue-600 text-white" 
                      : "border-white/20 text-white hover:bg-white/10"
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* المقالات المميزة */}
        {featuredBlogs.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">المقالات المميزة</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <Card key={blog.id} className="group hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
                  {blog.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image 
                        src={blog.coverImage} 
                        alt={blog.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Star className="h-3 w-3 ml-1" />
                        مميز
                      </Badge>
                      {(Array.isArray(blog.tags) ? blog.tags : []).slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-white/20 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {blog.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {blog.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(blog.publishedAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEditBlog(blog) && (
                          <Link href={`/blog/edit/${blog.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                              <Edit className="h-4 w-4 ml-1" />
                              تعديل
                            </Button>
                          </Link>
                        )}
                        <Link href={`/blog/${blog.slug}`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            <Eye className="h-4 w-4 ml-1" />
                            قراءة
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* جميع المقالات */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">أحدث المقالات</h2>
            </div>
            <div className="text-gray-400">
              {filteredBlogs.length} مقال
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-white/5 border-white/10 animate-pulse">
                  <div className="aspect-video bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-20 bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">لا توجد مقالات</h3>
                <p className="text-gray-300 mb-6">
                  {searchTerm || selectedTag ? 'لم يتم العثور على مقالات تطابق البحث' : 'لا توجد مقالات منشورة حالياً'}
                </p>
                {session && (
                  <Link href="/blog/write">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <PenTool className="h-4 w-4 ml-2" />
                      كن أول من يكتب مقال
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularBlogs.map((blog) => (
                <Card key={blog.id} className="group hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
                  {blog.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image 
                        src={blog.coverImage} 
                        alt={blog.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(Array.isArray(blog.tags) ? blog.tags : []).slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-white/20 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300 line-clamp-3">
                      {blog.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {blog.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(blog.publishedAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {canEditBlog(blog) && (
                          <Link href={`/blog/edit/${blog.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/blog/${blog.slug}`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* عرض المزيد من التاجز */}
        {allTags.length > 6 && (
          <Card className="mt-8 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Tag className="h-5 w-5" />
                جميع الكلمات المفتاحية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTag === tag 
                        ? "bg-blue-600 text-white" 
                        : "border-white/20 text-gray-300 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 