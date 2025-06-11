'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search, 
  RefreshCw,
  Filter,
  Grid,
  List,
} from 'lucide-react'
import { toast } from 'sonner'

interface WishlistItem {
  id: string
  createdAt: string
  product: {
    id: string
    title: string
    description: string
    price: number
    discountedPrice: number | null
    hasDiscount: boolean
    image: string | null
    category: string
    isActive: boolean
    createdAt: string
  }
}

interface WishlistTabProps {
  onGoToProducts: () => void
}

export default function WishlistTab({ onGoToProducts }: WishlistTabProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/wishlist')
      const data = await response.json()

      if (data.success) {
        setWishlist(data.wishlist)
      } else {
        toast.error(data.error || 'فشل في تحميل المحفوظات')
      }
    } catch (error) {
      console.error('خطأ في تحميل المحفوظات:', error)
      toast.error('خطأ في تحميل المحفوظات')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setIsRemoving(productId)
      const response = await fetch(`/api/user/wishlist?productId=${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setWishlist(prev => prev.filter(item => item.product.id !== productId))
        toast.success('تم حذف المنتج من المحفوظات')
      } else {
        toast.error(data.error || 'فشل في حذف المنتج')
      }
    } catch (error) {
      console.error('خطأ في حذف المنتج:', error)
      toast.error('خطأ في حذف المنتج')
    } finally {
      setIsRemoving(null)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: 1 })
      })
      const data = await response.json()

      if (response.ok && data.success) {
        window.dispatchEvent(new CustomEvent('cartUpdated'))
        toast.success('تم إضافة المنتج للسلة')
      } else {
        toast.error(data.error || 'فشل في إضافة المنتج للسلة')
      }
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error)
      toast.error('خطأ في إضافة المنتج للسلة')
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const categories = [...new Set(wishlist.map(item => item.product.category))]

  const filteredWishlist = wishlist.filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || item.product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل المحفوظات...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-6 w-6 ml-2 text-red-500" />
                <span className="text-gray-900">المحفوظات</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchWishlist}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="bg-red-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد عناصر محفوظة</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                لم تقم بحفظ أي منتجات بعد. احفظ المنتجات المميزة لمراجعتها لاحقاً ومقارنة الأسعار!
              </p>
              <Button onClick={onGoToProducts} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <Heart className="h-5 w-5 ml-2" />
                استكشف المنتجات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-6 w-6 ml-2 text-red-500" />
              <span className="text-gray-900">المحفوظات ({wishlist.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none border-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchWishlist}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في المحفوظات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="ALL">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-600 text-sm font-medium">إجمالي المحفوظات</div>
              <div className="text-2xl font-bold text-red-900">{wishlist.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">قيمة المحفوظات</div>
              <div className="text-2xl font-bold text-green-900">
                {wishlist.reduce((sum, item) => {
                  const price = item.product.hasDiscount && item.product.discountedPrice 
                    ? item.product.discountedPrice 
                    : item.product.price
                  return sum + price
                }, 0).toLocaleString()} ج.م
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">متوفر</div>
              <div className="text-2xl font-bold text-blue-900">
                {wishlist.filter(item => item.product.isActive).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {filteredWishlist.length === 0 ? (
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-12">
            <div className="text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لم نجد أي منتجات</h3>
              <p className="text-gray-600">جرب تغيير كلمات البحث أو الفئة المحددة</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredWishlist.map((item) => (
            <Card key={item.id} className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {viewMode === 'grid' ? (
                <>
                  <div className="relative">
                    <Image
                      src={item.product.image || '/api/placeholder/300/200'}
                      alt={item.product.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {item.product.hasDiscount && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          خصم {Math.round(((item.product.price - (item.product.discountedPrice || 0)) / item.product.price) * 100)}%
                        </Badge>
                      )}
                      {!item.product.isActive && (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                          غير متوفر
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                        {item.product.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-right">
                        {item.product.hasDiscount && item.product.discountedPrice ? (
                          <div>
                            <span className="text-lg font-bold text-green-600">
                              {item.product.discountedPrice.toLocaleString()} ج.م
                            </span>
                            <span className="text-sm text-gray-500 line-through mr-2">
                              {item.product.price.toLocaleString()} ج.م
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {item.product.price.toLocaleString()} ج.م
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(item.product.id)}
                        disabled={!item.product.isActive}
                        size="sm"
                        aria-label={`إضافة ${item.product.title} للسلة`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                      >
                        <ShoppingCart className="h-4 w-4 ml-1" />
                        أضف للسلة
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => removeFromWishlist(item.product.id)}
                        disabled={isRemoving === item.product.id}
                        size="sm"
                        aria-label={`إزالة ${item.product.title} من المفضلة`}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {isRemoving === item.product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Image
                      src={item.product.image || '/api/placeholder/120/120'}
                      alt={item.product.title}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="text-xs text-gray-600 border-gray-300 mb-1">
                            {item.product.category}
                          </Badge>
                          <h3 className="font-semibold text-lg text-gray-900">{item.product.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          {item.product.hasDiscount && (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              خصم {Math.round(((item.product.price - (item.product.discountedPrice || 0)) / item.product.price) * 100)}%
                            </Badge>
                          )}
                          {!item.product.isActive && (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                              غير متوفر
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{item.product.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          {item.product.hasDiscount && item.product.discountedPrice ? (
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                {item.product.discountedPrice.toLocaleString()} ج.م
                              </span>
                              <span className="text-sm text-gray-500 line-through mr-2">
                                {item.product.price.toLocaleString()} ج.م
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {item.product.price.toLocaleString()} ج.م
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => addToCart(item.product.id)}
                            disabled={!item.product.isActive}
                            size="sm"
                            aria-label={`إضافة ${item.product.title} للسلة`}
                            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                          >
                            <ShoppingCart className="h-4 w-4 ml-1" />
                            أضف للسلة
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => removeFromWishlist(item.product.id)}
                            disabled={isRemoving === item.product.id}
                            size="sm"
                            aria-label={`إزالة ${item.product.title} من المفضلة`}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            {isRemoving === item.product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 