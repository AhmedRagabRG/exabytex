'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Tag, 
  Plus, 
  X, 
  Edit3, 
  Trash2, 
  Package,
  Bot,
  Rocket,
  Zap,
  Star,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  description?: string
  icon: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  description: string
  icon: string
}

const iconOptions = [
  { value: 'Tag', label: 'العام', icon: Tag },
  { value: 'Bot', label: 'الذكاء الاصطناعي', icon: Bot },
  { value: 'Rocket', label: 'التسويق', icon: Rocket },
  { value: 'Zap', label: 'الأتمتة', icon: Zap },
  { value: 'Package', label: 'المنتجات', icon: Package },
  { value: 'Star', label: 'المميز', icon: Star },
  { value: 'Settings', label: 'الخدمات', icon: Settings }
]

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: 'Tag'
  })

  // جلب الفئات
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json()
          setCategories(data)
        } else {
          console.error('Response is not JSON:', await response.text())
          toast.error('خطأ في تحميل الفئات')
        }
      } else {
        console.error('Error fetching categories:', response.status, response.statusText)
        toast.error('فشل في تحميل الفئات')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // تصفية الفئات
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && category.isActive) ||
                         (statusFilter === 'INACTIVE' && !category.isActive)
    return matchesSearch && matchesStatus
  })

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}` 
        : '/api/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCategories()
        resetForm()
        toast.success(editingCategory ? 'تم تحديث الفئة بنجاح!' : 'تم إضافة الفئة بنجاح!')
      } else {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const error = await response.json()
          toast.error(error.error || 'حدث خطأ')
        } else {
          toast.error('حدث خطأ في الخادم')
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('حدث خطأ في الحفظ')
    }
  }

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Tag'
    })
    setShowForm(false)
    setEditingCategory(null)
  }

  // تحرير فئة
  const editCategory = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon
    })
    setEditingCategory(category)
    setShowForm(true)
  }

  // حذف فئة
  const deleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCategories()
        toast.success('تم حذف الفئة بنجاح!')
      } else {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const error = await response.json()
          toast.error(error.error || 'حدث خطأ في الحذف')
        } else {
          toast.error('حدث خطأ في الخادم')
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('حدث خطأ في الحذف')
    }
  }

  // تبديل حالة الفئة
  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        await fetchCategories()
        toast.success(`تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} الفئة بنجاح!`)
      } else {
        toast.error('حدث خطأ في تحديث حالة الفئة')
      }
    } catch (error) {
      console.error('Error toggling category status:', error)
      toast.error('حدث خطأ في تحديث الحالة')
    }
  }

  const getIcon = (iconName: string) => {
    const iconObj = iconOptions.find(opt => opt.value === iconName)
    return iconObj ? iconObj.icon : Tag
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الفئات...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة الفئات</h1>
                <p className="text-gray-600">تنظيم وإدارة فئات المنتجات</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={fetchCategories}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث
              </button>
              <button
                onClick={() => {
                  setEditingCategory(null)
                  setShowForm(true)
                }}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة فئة جديدة
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">إجمالي الفئات</div>
              <div className="text-2xl font-bold text-purple-900">{categories.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">الفئات النشطة</div>
              <div className="text-2xl font-bold text-green-900">
                {categories.filter(c => c.isActive).length}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-sm font-medium">الفئات غير النشطة</div>
              <div className="text-2xl font-bold text-red-900">
                {categories.filter(c => !c.isActive).length}
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ALL">جميع الحالات</option>
                <option value="ACTIVE">نشطة</option>
                <option value="INACTIVE">غير نشطة</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const IconComponent = getIcon(category.icon)
          return (
            <Card key={category.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={category.isActive 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                    }>
                      {category.isActive ? 'نشطة' : 'غير نشطة'}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  أُنشئت في {new Date(category.createdAt).toLocaleDateString('ar-EG')}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الفئة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="أدخل اسم الفئة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="وصف مختصر للفئة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأيقونة
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({...formData, icon: option.value})}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.icon === option.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        title={option.label}
                      >
                        <IconComponent className="h-5 w-5 mx-auto text-gray-700" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {editingCategory ? 'تحديث الفئة' : 'إضافة الفئة'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCategories.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فئات</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'لم نجد أي فئات تطابق معايير البحث' 
                : 'ابدأ بإضافة فئات جديدة لتنظيم منتجاتك'
              }
            </p>
            {(!searchTerm && statusFilter === 'ALL') && (
              <button
                onClick={() => {
                  setEditingCategory(null)
                  setShowForm(true)
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                إضافة فئة جديدة
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement 