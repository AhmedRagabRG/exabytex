'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Order {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  total: number
  discount: number
  createdAt: string
  updatedAt: string
  itemsCount: number
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      title: string
      image: string | null
      price: number
    }
  }>
  promoCode?: {
    code: string
    discountType: string
    discountValue: number
  } | null
}

interface OrdersTabProps {
  onGoToProducts: () => void
}

export default function OrdersTab({ onGoToProducts }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/orders')
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        toast.error(data.error || 'فشل في تحميل الطلبات')
      }
    } catch (error) {
      console.error('خطأ في تحميل الطلبات:', error)
      toast.error('خطأ في تحميل الطلبات')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.product.title.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'مكتمل'
      case 'PROCESSING': return 'قيد التنفيذ'
      case 'PENDING': return 'في الانتظار'
      case 'CANCELLED': return 'ملغى'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'PROCESSING': return <Package className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'CANCELLED': return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل الطلبات...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>طلباتي</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد طلبات بعد</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                لم تقم بأي طلبات حتى الآن. ابدأ باستكشاف منتجاتنا المميزة واختر ما يناسبك!
              </p>
              <Button onClick={onGoToProducts} size="lg">
                <Package className="h-5 w-5 ml-2" />
                تصفح المنتجات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="h-6 w-6 ml-2" />
              <span>طلباتي ({orders.length})</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">جميع الطلبات</option>
                <option value="PENDING">في الانتظار</option>
                <option value="PROCESSING">قيد التنفيذ</option>
                <option value="COMPLETED">مكتملة</option>
                <option value="CANCELLED">ملغاة</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">إجمالي الطلبات</div>
              <div className="text-2xl font-bold text-blue-900">{orders.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">مكتملة</div>
              <div className="text-2xl font-bold text-green-900">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-sm font-medium">قيد التنفيذ</div>
              <div className="text-2xl font-bold text-yellow-900">
                {orders.filter(o => o.status === 'PROCESSING').length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">إجمالي المبلغ</div>
              <div className="text-2xl font-bold text-purple-900">
                {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('ar-SA')} ج.م
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </Badge>
                  <span className="text-sm text-gray-500">#{order.id}</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg">{order.total.toLocaleString('ar-SA')} ج.م</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{order.itemsCount}</span> عنصر
                  </div>
                  {order.discount > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      خصم: {order.discount.toLocaleString('ar-SA')} ج.م
                    </div>
                  )}
                  {order.promoCode && (
                    <Badge variant="secondary" className="text-xs">
                      كود: {order.promoCode.code}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    التفاصيل
                  </Button>
                </div>
              </div>

              {/* Products Preview */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 flex-shrink-0">
                      <Image
                        src={item.product.image || '/api/placeholder/40/40'}
                        alt={item.product.title}
                        className="w-10 h-10 rounded-md object-cover"
                        width={40}
                        height={40}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/40/40'
                        }}
                      />
                      <div className="text-sm">
                        <div className="font-medium truncate max-w-32">
                          {item.product.title}
                        </div>
                        <div className="text-gray-500">
                          {item.quantity}x
                        </div>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-gray-500 flex-shrink-0">
                      +{order.items.length - 3} المزيد
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">تفاصيل الطلب #{selectedOrder.id}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status & Info */}
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1`}>
                  {getStatusIcon(selectedOrder.status)}
                  {getStatusText(selectedOrder.status)}
                </Badge>
                <div className="text-left">
                  <div className="text-sm text-gray-500">تاريخ الطلب</div>
                  <div className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">عناصر الطلب</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Image
                        src={item.product.image || '/api/placeholder/60/60'}
                        alt={item.product.title}
                        className="w-15 h-15 rounded-lg object-cover"
                        width={60}
                        height={60}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/60/60'
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.product.title}</div>
                        <div className="text-sm text-gray-600">
                          الكمية: {item.quantity} | السعر: {item.price.toLocaleString('ar-SA')} ج.م
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">
                          {(item.price * item.quantity).toLocaleString('ar-SA')} ج.م
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">ملخص الطلب</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span>{(selectedOrder.total + selectedOrder.discount).toLocaleString('ar-SA')} ج.م</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>-{selectedOrder.discount.toLocaleString('ar-SA')} ج.م</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>المجموع الكلي</span>
                    <span>{selectedOrder.total.toLocaleString('ar-SA')} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 