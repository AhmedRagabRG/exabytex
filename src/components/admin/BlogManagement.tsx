'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  Calendar,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  EyeOff,
  Edit,
  Save
} from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  coverImage?: string;
  tags: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  published: boolean;
  isVisible?: boolean;
  publishedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function BlogManagement() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Blog | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    coverImage: ''
  });

  // Helper function to check if user can edit a blog
  const canEditBlog = (blog: Blog) => {
    if (!session?.user?.email) return false;
    
    // Admin or Manager can edit any blog
    const userRole = (session.user as any)?.role;
    if (userRole === 'ADMIN' || userRole === 'MANAGER') return true;
    
    // Author can edit their own blog
    return blog.author.email === session.user.email;
  };

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      console.log('🔄 Starting to fetch blogs with filter:', filter);
      const url = `/api/blogs?status=${filter}&limit=50`;
      console.log('📡 Fetching URL:', url);
      
      const response = await fetch(url, {
        credentials: 'include' // مهم للـ session
      });
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        setBlogs([]);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Fetched blogs data:', data);
      console.log('📊 Data type:', typeof data);
      console.log('📋 Data structure:', data);
      
      // الـ API الجديد يرجع { success: true, data: { blogs: [...], pagination: {...} } }
      if (data.success && data.data && Array.isArray(data.data.blogs)) {
        console.log('✅ Setting blogs from data.data.blogs:', data.data.blogs.length, 'items');
        // معالجة tags - تحويل من string إلى array إذا لزم الأمر
        const processedBlogs = data.data.blogs.map((blog: any) => ({
          ...blog,
          tags: Array.isArray(blog.tags) 
            ? blog.tags 
            : (typeof blog.tags === 'string' ? JSON.parse(blog.tags || '[]') : [])
        }));
        setBlogs(processedBlogs);
      } else if (data && Array.isArray(data.blogs)) {
        console.log('✅ Setting blogs from data.blogs:', data.blogs.length, 'items');
        const processedBlogs = data.blogs.map((blog: any) => ({
          ...blog,
          tags: Array.isArray(blog.tags) 
            ? blog.tags 
            : (typeof blog.tags === 'string' ? JSON.parse(blog.tags || '[]') : [])
        }));
        setBlogs(processedBlogs);
      } else if (Array.isArray(data)) {
        console.log('✅ Setting blogs from data:', data.length, 'items');
        const processedBlogs = data.map((blog: any) => ({
          ...blog,
          tags: Array.isArray(blog.tags) 
            ? blog.tags 
            : (typeof blog.tags === 'string' ? JSON.parse(blog.tags || '[]') : [])
        }));
        setBlogs(processedBlogs);
      } else {
        console.error('❌ Unexpected data format:', data);
        setBlogs([]);
      }
    } catch (error) {
      console.error('💥 Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
      console.log('🏁 Fetch blogs completed');
    }
  };

  const handleAction = async (blogId: string, action: 'approve' | 'reject') => {
    setActionLoading(blogId);
    try {
      const response = await fetch(`/api/blogs/manage/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          rejectionReason: action === 'reject' ? rejectionReason : undefined
        }),
      });

      if (response.ok) {
        // تحديث القائمة
        fetchBlogs();
        setSelectedBlog(null);
        setRejectionReason('');
        
        // إشعار نجاح
        const message = action === 'approve' ? 'تم قبول المقال بنجاح!' : 'تم رفض المقال';
        showNotification(message, 'success');
      } else {
        const error = await response.json();
        showNotification(error.error || 'حدث خطأ', 'error');
      }
    } catch (error) {
      console.log(error)
      showNotification('خطأ في الاتصال بالسيرفر', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (blogId: string) => {
    setActionLoading(blogId);
    try {
      const response = await fetch(`/api/blogs/manage/${blogId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // تحديث القائمة
        fetchBlogs();
        setDeleteConfirm(null);
        
        // إشعار نجاح
        showNotification('تم حذف المقال بنجاح!', 'success');
      } else {
        const error = await response.json();
        showNotification(error.error || 'حدث خطأ في الحذف', 'error');
      }
    } catch (error) {
      console.log(error)
      showNotification('خطأ في الاتصال بالسيرفر', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleVisibility = async (blogId: string, currentVisibility: boolean) => {
    setActionLoading(blogId);
    try {
      const response = await fetch(`/api/blogs/${blogId}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: !currentVisibility
        }),
      });

      if (response.ok) {
        // تحديث القائمة
        fetchBlogs();
        
        // إشعار نجاح
        const message = !currentVisibility ? 'تم إظهار المقال في الموقع!' : 'تم إخفاء المقال من الموقع!';
        showNotification(message, 'success');
      } else {
        const error = await response.json();
        showNotification(error.error || 'حدث خطأ في تغيير إعدادات العرض', 'error');
      }
    } catch (error) {
      console.log(error)
      showNotification('خطأ في الاتصال بالسيرفر', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setEditFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      tags: blog.tags,
      coverImage: blog.coverImage || ''
    });
  };

  const handleEditSave = async () => {
    if (!editingBlog) return;
    
    setActionLoading(editingBlog.id);
    try {
      const response = await fetch(`/api/blogs/${editingBlog.id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        // تحديث القائمة
        fetchBlogs();
        setEditingBlog(null);
        setEditFormData({
          title: '',
          content: '',
          excerpt: '',
          tags: [],
          coverImage: ''
        });
        
        showNotification('تم تحديث المقال بنجاح!', 'success');
      } else {
        const error = await response.json();
        showNotification(error.error || 'حدث خطأ في التحديث', 'error');
      }
    } catch (error) {
      console.log(error)
      showNotification('خطأ في الاتصال بالسيرفر', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditCancel = () => {
    setEditingBlog(null);
    setEditFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: [],
      coverImage: ''
    });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const div = document.createElement('div');
    div.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'APPROVED':
      case 'PUBLISHED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = blogs.reduce((acc, blog) => {
    acc[blog.status] = (acc[blog.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة المقالات</h1>
                <p className="text-gray-600">مراجعة وإدارة مقالات المدونة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">جميع المقالات</option>
                <option value="PENDING">في الانتظار</option>
                <option value="APPROVED">مقبولة</option>
                <option value="REJECTED">مرفوضة</option>
                <option value="PUBLISHED">منشورة</option>
              </select>
            </div>
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-sm font-medium">في الانتظار</div>
              <div className="text-2xl font-bold text-yellow-900">{statusCounts.PENDING || 0}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">مقبولة</div>
              <div className="text-2xl font-bold text-green-900">{statusCounts.APPROVED || 0}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">منشورة</div>
              <div className="text-2xl font-bold text-blue-900">{statusCounts.PUBLISHED || 0}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-sm font-medium">مرفوضة</div>
              <div className="text-2xl font-bold text-red-900">{statusCounts.REJECTED || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* المقالات */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المقالات...</p>
            </div>
          </div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقالات</h3>
            <p className="text-gray-500">لا توجد مقالات تطابق معايير البحث الحالية</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* صورة المقال */}
                  {blog.coverImage && (
                    <div className="flex-shrink-0">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={128}
                        height={96}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* محتوى المقال */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={`${getStatusColor(blog.status)} flex items-center gap-1`}>
                          {getStatusIcon(blog.status)}
                          {blog.status === 'PENDING' && 'في الانتظار'}
                          {blog.status === 'APPROVED' && 'مقبول'}
                          {blog.status === 'REJECTED' && 'مرفوض'}
                          {blog.status === 'PUBLISHED' && 'منشور'}
                        </Badge>
                        
                        {/* مؤشر حالة الرؤية للمقالات المنشورة */}
                        {blog.status === 'PUBLISHED' && (
                          <Badge 
                            className={`flex items-center gap-1 ${
                              blog.isVisible 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {blog.isVisible ? (
                              <>
                                <Eye className="h-3 w-3" />
                                مرئي
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                مخفي
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{blog.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(blog.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      {blog.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span>العلامات:</span>
                          <div className="flex gap-1">
                            {blog.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* سبب الرفض */}
                    {blog.status === 'REJECTED' && blog.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-red-800 text-sm">
                          <strong>سبب الرفض:</strong> {blog.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* أزرار الإجراءات */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBlog(blog)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          معاينة
                        </Button>

                        {/* زر التعديل */}
                        {canEditBlog(blog) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(blog)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 ml-1" />
                            تعديل
                          </Button>
                        )}

                        {/* زر التحكم في الرؤية - فقط للمقالات المنشورة */}
                        {blog.status === 'PUBLISHED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleVisibility(blog.id, blog.isVisible ?? true)}
                            disabled={actionLoading === blog.id}
                            className={`${
                              blog.isVisible 
                                ? 'border-orange-300 text-orange-600 hover:bg-orange-50' 
                                : 'border-green-300 text-green-600 hover:bg-green-50'
                            }`}
                            title={blog.isVisible ? 'إخفاء من الموقع' : 'إظهار في الموقع'}
                          >
                            {actionLoading === blog.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <>
                                {blog.isVisible ? (
                                  <EyeOff className="h-4 w-4 ml-1" />
                                ) : (
                                  <Eye className="h-4 w-4 ml-1" />
                                )}
                                {blog.isVisible ? 'إخفاء' : 'إظهار'}
                              </>
                            )}
                          </Button>
                        )}

                        {blog.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAction(blog.id, 'approve')}
                              disabled={actionLoading === blog.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {actionLoading === blog.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 ml-1" />
                                  قبول
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBlog(blog);
                                // يمكن إضافة modal للرفض هنا
                              }}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 ml-1" />
                              رفض
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(blog)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal المعاينة */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">معاينة المقال</h2>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
                
                {selectedBlog.coverImage && (
                  <Image
                    src={selectedBlog.coverImage}
                    alt={selectedBlog.title}
                    width={800}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>بواسطة: {selectedBlog.author.name}</span>
                  <span>في: {new Date(selectedBlog.createdAt).toLocaleDateString('ar-EG')}</span>
                  <Badge className={getStatusColor(selectedBlog.status)}>
                    {selectedBlog.status}
                  </Badge>
                </div>

                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg text-gray-600 mb-4">{selectedBlog.excerpt}</p>
                  <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                </div>
              </div>

              {selectedBlog.status === 'PENDING' && (
                <div className="border-t pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        سبب الرفض (اختياري)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="اكتب سبب الرفض إذا كنت تريد رفض المقال..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => handleAction(selectedBlog.id, 'approve')}
                      disabled={actionLoading === selectedBlog.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === selectedBlog.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      قبول المقال
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleAction(selectedBlog.id, 'reject')}
                      disabled={actionLoading === selectedBlog.id || !rejectionReason.trim()}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      {actionLoading === selectedBlog.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      رفض المقال
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal تأكيد الحذف */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف مقال "${deleteConfirm.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  disabled={actionLoading === deleteConfirm.id}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {actionLoading === deleteConfirm.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  حذف
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal التعديل */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">تعديل المقال</h2>
                <button
                  onClick={handleEditCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* العنوان */}
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان المقال
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اكتب عنوان المقال..."
                  />
                </div>

                {/* الملخص */}
                <div>
                  <label htmlFor="edit-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    ملخص المقال
                  </label>
                  <textarea
                    id="edit-excerpt"
                    value={editFormData.excerpt}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="اكتب ملخص المقال..."
                  />
                </div>

                {/* صورة الغلاف */}
                <div>
                  <label htmlFor="edit-cover" className="block text-sm font-medium text-gray-700 mb-2">
                    رابط صورة الغلاف (اختياري)
                  </label>
                  <input
                    id="edit-cover"
                    type="url"
                    value={editFormData.coverImage}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* العلامات */}
                <div>
                  <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">
                    العلامات (منفصلة بفواصل)
                  </label>
                  <input
                    id="edit-tags"
                    type="text"
                    value={editFormData.tags.join(', ')}
                    onChange={(e) => setEditFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="تقنية, برمجة, ذكاء اصطناعي"
                  />
                </div>

                {/* المحتوى */}
                <div>
                  <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                    محتوى المقال
                  </label>
                  <textarea
                    id="edit-content"
                    value={editFormData.content}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={12}
                    placeholder="اكتب محتوى المقال بتنسيق HTML..."
                  />
                </div>

                {/* معلومات المقال */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">معلومات المقال</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>الكاتب: {editingBlog.author.name}</p>
                    <p>تاريخ الإنشاء: {new Date(editingBlog.createdAt).toLocaleDateString('ar-EG')}</p>
                    <p>الحالة: {editingBlog.status}</p>
                    {editingBlog.publishedAt && (
                      <p>تاريخ النشر: {new Date(editingBlog.publishedAt).toLocaleDateString('ar-EG')}</p>
                    )}
                  </div>
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleEditSave}
                    disabled={actionLoading === editingBlog.id || !editFormData.title.trim() || !editFormData.content.trim() || !editFormData.excerpt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {actionLoading === editingBlog.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    حفظ التغييرات
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleEditCancel}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 