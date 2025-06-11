'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Search,
  Filter,
  RefreshCw,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'

interface PromoCode {
  id: string
  code: string
  description: string
  discountType: string
  discountValue: number
  minimumAmount?: number
  maxUses?: number
  usedCount: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
  createdBy: {
    name: string
    email: string
  }
}

interface PromoFormData {
  code: string
  description: string
  discountType: string
  discountValue: string
  minimumAmount: string
  maxUses: string
  expiresAt: string
}

const PromoCodeManagement = () => {
  useSession()
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [formData, setFormData] = useState<PromoFormData>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minimumAmount: '',
    maxUses: '',
    expiresAt: ''
  })

  // جلب الكوبونات
  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/promo-codes')
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data)
      } else {
        toast.error('فشل في تحميل أكواد الخصم')
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error)
      toast.error('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  // تصفية الأكواد
  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && promo.isActive) ||
                         (statusFilter === 'INACTIVE' && !promo.isActive) ||
                         (statusFilter === 'EXPIRED' && promo.expiresAt && new Date(promo.expiresAt) < new Date())
    return matchesSearch && matchesStatus
  })

  // نسخ الكود
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('تم نسخ الكود')
  }

  // إنشاء كود عشوائي
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({...prev, code: result}))
  }

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPromo 
        ? `/api/promo-codes/${editingPromo.id}` 
        : '/api/promo-codes'
      
      const method = editingPromo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchPromoCodes()
        resetForm()
        toast.success(editingPromo ? 'تم تحديث الكوبون بنجاح!' : 'تم إنشاء الكوبون بنجاح!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error saving promo code:', error)
      toast.error('حدث خطأ في الحفظ')
    }
  }

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minimumAmount: '',
      maxUses: '',
      expiresAt: ''
    })
    setShowForm(false)
    setEditingPromo(null)
  }

  // تحرير كوبون
  const editPromoCode = (promo: PromoCode) => {
    setFormData({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      minimumAmount: promo.minimumAmount?.toString() || '',
      maxUses: promo.maxUses?.toString() || '',
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : ''
    })
    setEditingPromo(promo)
    setShowForm(true)
  }

  // حذف كوبون
  const deletePromoCode = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return

    try {
      const response = await fetch(`/api/promo-codes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPromoCodes()
        toast.success('تم حذف الكوبون بنجاح!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'حدث خطأ في الحذف')
      }
    } catch (error) {
      console.error('Error deleting promo code:', error)
      toast.error('حدث خطأ في الحذف')
    }
  }

  // تحديد حالة الكود
  const getStatusColor = (promo: PromoCode) => {
    if (!promo.isActive) return 'bg-gray-100 text-gray-800'
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return 'bg-red-100 text-red-800'
    if (promo.maxUses && promo.usedCount >= promo.maxUses) return 'bg-orange-100 text-orange-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (promo: PromoCode) => {
    if (!promo.isActive) return 'غير نشط'
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return 'منتهي الصلاحية'
    if (promo.maxUses && promo.usedCount >= promo.maxUses) return 'استُنفد'
    return 'نشط'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل أكواد الخصم...</p>
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
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة أكواد الخصم</h1>
                <p className="text-gray-600">إنشاء وإدارة أكواد الخصم والعروض الترويجية</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={fetchPromoCodes}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث
              </button>
              <button
                onClick={() => {
                  setEditingPromo(null)
                  setShowForm(true)
                }}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة كود جديد
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">إجمالي الأكواد</div>
              <div className="text-2xl font-bold text-purple-900">{promoCodes.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">الأكواد النشطة</div>
              <div className="text-2xl font-bold text-green-900">
                {promoCodes.filter(p => p.isActive && (!p.expiresAt || new Date(p.expiresAt) > new Date())).length}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">إجمالي الاستخدامات</div>
              <div className="text-2xl font-bold text-blue-900">
                {promoCodes.reduce((sum, p) => sum + p.usedCount, 0)}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-sm font-medium">منتهية الصلاحية</div>
              <div className="text-2xl font-bold text-red-900">
                {promoCodes.filter(p => p.expiresAt && new Date(p.expiresAt) < new Date()).length}
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في أكواد الخصم..."
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
                <option value="ACTIVE">نشط</option>
                <option value="INACTIVE">غير نشط</option>
                <option value="EXPIRED">منتهي الصلاحية</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromoCodes.map((promoCode) => (
          <div key={promoCode.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promoCode)}`}>
                    {getStatusText(promoCode)}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {promoCode.discountType === 'PERCENTAGE' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(promoCode.code)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-center">
                <code className="text-lg font-mono font-bold text-purple-600">{promoCode.code}</code>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mb-2">{promoCode.description}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">قيمة الخصم:</span>
                  <span className="font-medium text-gray-900">
                    {promoCode.discountType === 'PERCENTAGE' 
                      ? `${promoCode.discountValue}%` 
                      : `${promoCode.discountValue} ج.م`}
                  </span>
                </div>

                {promoCode.minimumAmount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الحد الأدنى للطلب:</span>
                    <span className="font-medium text-gray-900">{promoCode.minimumAmount} ج.م</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">الاستخدامات:</span>
                  <span className="font-medium text-gray-900">
                    {promoCode.usedCount} / {promoCode.maxUses || '∞'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">صالح حتى:</span>
                  <span className="font-medium text-gray-900">
                    {promoCode.expiresAt 
                      ? new Date(promoCode.expiresAt).toLocaleDateString('ar-EG')
                      : 'بلا نهاية'
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  أُنشئ في {new Date(promoCode.createdAt).toLocaleDateString('ar-EG')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editPromoCode(promoCode)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePromoCode(promoCode.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPromo ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كود الخصم *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="أدخل الكود أو اضغط توليد"
                    />
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      توليد
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الخصم *
                  </label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                    <option value="FIXED">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الكود *
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="وصف مختصر للكود"
                />
              </div>

              {/* Discount Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قيمة الخصم * ({formData.discountType === 'PERCENTAGE' ? '%' : 'ج.م'})
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    max={formData.discountType === 'PERCENTAGE' ? "100" : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأدنى للطلب (ج.م)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimumAmount}
                    onChange={(e) => setFormData({...formData, minimumAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Usage & Date Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الاستخدامات المسموحة
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="بلا حدود"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ انتهاء الصلاحية
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {editingPromo ? 'تحديث الكود' : 'إضافة الكود'}
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
      {filteredPromoCodes.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أكواد خصم</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'لم نجد أي أكواد تطابق معايير البحث' 
                : 'ابدأ بإنشاء أكواد خصم جديدة لجذب العملاء'
              }
            </p>
            {(!searchTerm && statusFilter === 'ALL') && (
              <button
                onClick={() => {
                  setEditingPromo(null)
                  setShowForm(true)
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                إضافة كود خصم جديد
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PromoCodeManagement 