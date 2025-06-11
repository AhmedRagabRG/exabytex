"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  Save,
  Star,
  BookOpen,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  authorName: string
  publishedAt: string
  status: string
  published: boolean
}

interface FeaturedBlog {
  id: string
  blogPostId: string
  isActive: boolean
  sortOrder: number
  blogPost: BlogPost
}

export function FeaturedBlogsManager() {
  const [featuredBlogs, setFeaturedBlogs] = useState<FeaturedBlog[]>([])
  const [availableBlogs, setAvailableBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    blogPostId: "",
    isActive: true,
    sortOrder: 0
  })

  useEffect(() => {
    fetchFeaturedBlogs()
    fetchAvailableBlogs()
  }, [])

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await fetch('/api/admin/featured-blogs')
      if (response.ok) {
        const data = await response.json()
        setFeaturedBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error)
      toast.error('خطأ في تحميل المقالات المميزة')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?status=PUBLISHED&published=true')
      if (response.ok) {
        const data = await response.json()
        setAvailableBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching available blogs:', error)
    }
  }

  const handleSave = async () => {
    try {
      if (!formData.blogPostId) {
        toast.error('يرجى اختيار مقال')
        return
      }

      // Check if blog is already featured
      const alreadyFeatured = featuredBlogs.some(fb => fb.blogPostId === formData.blogPostId)
      if (alreadyFeatured) {
        toast.error('هذا المقال مميز بالفعل')
        return
      }

      const response = await fetch('/api/admin/featured-blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('تم إضافة المقال المميز بنجاح')
        fetchFeaturedBlogs()
        handleCancel()
      } else {
        toast.error('خطأ في إضافة المقال المميز')
      }
    } catch (error) {
      console.error('Error saving featured blog:', error)
      toast.error('خطأ في إضافة المقال المميز')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذا المقال من المميزة؟')) return

    try {
      const response = await fetch(`/api/admin/featured-blogs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('تم إزالة المقال من المميزة بنجاح')
        fetchFeaturedBlogs()
      } else {
        toast.error('خطأ في إزالة المقال')
      }
    } catch (error) {
      console.error('Error deleting featured blog:', error)
      toast.error('خطأ في إزالة المقال')
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setFormData({
      blogPostId: "",
      isActive: true,
      sortOrder: 0
    })
  }

  const getAvailableBlogsForSelect = () => {
    const featuredBlogIds = featuredBlogs.map(fb => fb.blogPostId)
    return availableBlogs.filter(blog => !featuredBlogIds.includes(blog.id))
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المقالات المميزة</h2>
          <p className="text-gray-600">إدارة المقالات المعروضة في الصفحة الرئيسية (حد أقصى 3 مقالات)</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)} 
          className="flex items-center gap-2"
          disabled={featuredBlogs.length >= 3}
        >
          <Plus className="h-4 w-4" />
          إضافة مقال مميز
        </Button>
      </div>

      {/* Warning if limit reached */}
      {featuredBlogs.length >= 3 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <Star className="h-5 w-5" />
              <p>تم الوصول للحد الأقصى من المقالات المميزة (3 مقالات). يرجى إزالة مقال لإضافة مقال جديد.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              إضافة مقال مميز جديد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="blogPost">اختر المقال</Label>
              <select 
                value={formData.blogPostId} 
                onChange={(e) => setFormData(prev => ({ ...prev, blogPostId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر مقال...</option>
                {getAvailableBlogsForSelect().map((blog) => (
                  <option key={blog.id} value={blog.id}>
                    {blog.title} - بواسطة {blog.authorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">نشط</Label>
              </div>
              <div>
                <Label htmlFor="sortOrder">ترتيب العرض</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Blogs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBlogs.map((featuredBlog) => (
          <Card key={featuredBlog.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {featuredBlog.blogPost.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    بواسطة {featuredBlog.blogPost.authorName}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(featuredBlog.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {featuredBlog.blogPost.excerpt}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(featuredBlog.blogPost.publishedAt).toLocaleDateString('ar-SA')}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  /{featuredBlog.blogPost.slug}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Badge variant={featuredBlog.isActive ? "default" : "secondary"}>
                  {featuredBlog.isActive ? "نشط" : "غير نشط"}
                </Badge>
                <span className="text-xs text-gray-500">ترتيب: {featuredBlog.sortOrder}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {featuredBlogs.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقالات مميزة</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة مقال مميز للصفحة الرئيسية</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مقال مميز
            </Button>
          </CardContent>
        </Card>
      )}

      {getAvailableBlogsForSelect().length === 0 && isAdding && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-800">
              <BookOpen className="h-5 w-5" />
              <p>لا توجد مقالات متاحة للإضافة. تأكد من وجود مقالات منشورة وغير مميزة بالفعل.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 