"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Crown,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  Activity,
  Settings,
  Coins,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { DateDisplay } from '@/components/ui/date-display'

interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  image: string | null
  createdAt: string
  updatedAt: string
  emailVerified: string | null
  lastLogin: string
  stats: {
    totalOrders: number
    completedOrders: number
    totalSpent: number
    activeSessions: number
  }
}

interface UserDetails {
  user: User
  stats: {
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    cancelledOrders: number
    totalSpent: number
    activeSessions: number
    linkedAccounts: number
    memberSince: string
    lastActivity: string
    currentCoins: number
  }
  orders: {
    recent: any[]
    byStatus: Record<string, any>
    monthly: any[]
  }
  security: {
    emailVerified: string | null
    twoFactorEnabled: boolean
    loginMethods: any[]
    recentSessions: any[]
  }
}

interface UsersResponse {
  success: boolean
  users: User[]
  pagination: {
    current: number
    total: number
    count: number
    totalUsers: number
  }
  stats: {
    total: number
    byRole: Record<string, number>
  }
}

const ROLES = [
  { value: 'USER', label: 'مستخدم', color: 'bg-blue-500', icon: User },
  { value: 'MANAGER', label: 'مدير', color: 'bg-purple-500', icon: Shield },
  { value: 'ADMIN', label: 'أدمن', color: 'bg-red-500', icon: Crown }
]

const getRoleInfo = (role: string) => {
  return ROLES.find(r => r.value === role) || ROLES[0]
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null)
  const [stats, setStats] = useState<UsersResponse['stats'] | null>(null)
  
  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Edit form
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    coins: 0
  })

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm,
        role: selectedRole,
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data: UsersResponse = await response.json()

      if (data.success) {
        setUsers(data.users)
        setPagination(data.pagination)
        setStats(data.stats)
      } else {
        toast.error('فشل في تحميل المستخدمين')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('خطأ في تحميل المستخدمين')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    setLoadingDetails(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()

      if (data.success) {
        setUserDetails(data)
      } else {
        toast.error('فشل في تحميل تفاصيل المستخدم')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('خطأ في تحميل تفاصيل المستخدم')
    } finally {
      setLoadingDetails(false)
    }
  }

  const updateUser = async () => {
    if (!selectedUser) return
    
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          updates: editForm
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('تم تحديث المستخدم بنجاح')
        setShowEditModal(false)
        fetchUsers(currentPage)
      } else {
        toast.error(data.error || 'فشل في تحديث المستخدم')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('خطأ في تحديث المستخدم')
    } finally {
      setUpdating(false)
    }
  }

  const deleteUser = async () => {
    if (!selectedUser) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('تم حذف المستخدم بنجاح')
        setShowDeleteDialog(false)
        setSelectedUser(null)
        fetchUsers(currentPage)
      } else {
        toast.error(data.error || 'فشل في حذف المستخدم')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('خطأ في حذف المستخدم')
    } finally {
      setDeleting(false)
    }
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
    fetchUserDetails(user.id)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      coins: 0
    })
    setShowEditModal(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchUsers(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchUsers(page)
  }

  useEffect(() => {
    fetchUsers()
  }, [selectedRole, sortBy, sortOrder])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            إدارة المستخدمين
          </h2>
          <p className="text-gray-600 mt-1">
            إدارة وعرض جميع المستخدمين المسجلين في النظام
          </p>
        </div>
        
        {stats && (
          <div className="flex gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.byRole?.MANAGER || 0}</div>
                <div className="text-sm text-gray-600">المديرين</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.byRole?.USER || 0}</div>
                <div className="text-sm text-gray-600">العملاء</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم، الإيميل، أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10 bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                {ROLES.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">تاريخ التسجيل</SelectItem>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="email">الإيميل</SelectItem>
                <SelectItem value="updatedAt">آخر نشاط</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              بحث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <span>قائمة المستخدمين</span>
            {pagination && (
              <span className="text-sm text-gray-600">
                عرض {pagination.count} من {pagination.totalUsers} مستخدم
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">جاري تحميل المستخدمين...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">المستخدم</TableHead>
                    <TableHead className="text-gray-700">الدور</TableHead>
                    <TableHead className="text-gray-700">الإحصائيات</TableHead>
                    <TableHead className="text-gray-700">تاريخ التسجيل</TableHead>
                    <TableHead className="text-gray-700">آخر نشاط</TableHead>
                    <TableHead className="text-gray-700">العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const roleInfo = getRoleInfo(user.role)
                    return (
                      <TableRow key={user.id} className="border-gray-200">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.image || ''} />
                              <AvatarFallback className="bg-blue-500 text-white">
                                {user.name?.charAt(0) || user.email.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.name || 'بدون اسم'}
                              </div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                              {user.phone && (
                                <div className="text-xs text-gray-500">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${roleInfo.color} text-white`}>
                            <roleInfo.icon className="h-3 w-3 mr-1" />
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-700">
                              <ShoppingBag className="h-3 w-3 inline mr-1" />
                              {user.stats.totalOrders} طلب
                            </div>
                            <div className="text-sm text-gray-700">
                              <DollarSign className="h-3 w-3 inline mr-1" />
                              ${user.stats.totalSpent.toFixed(2)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          <DateDisplay 
                            date={user.createdAt} 
                            format="short"
                            className="text-sm"
                          />
                        </TableCell>
                        <TableCell className="text-gray-700">
                          <DateDisplay 
                            date={user.lastLogin} 
                            format="relative"
                            className="text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(user)}
                              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                              className="bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user)}
                              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.total > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <p className="text-gray-400 text-sm">
                    صفحة {pagination.current} من {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current <= 1}
                      className="bg-white border-gray-300 text-gray-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current >= pagination.total}
                      className="bg-white border-gray-300 text-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              تفاصيل المستخدم
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              عرض جميع المعلومات والإحصائيات الخاصة بالمستخدم
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">جاري تحميل التفاصيل...</p>
            </div>
          ) : userDetails ? (
            <div className="space-y-6">
              {/* User Info */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg">المعلومات الشخصية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userDetails.user.image || ''} />
                      <AvatarFallback className="bg-blue-500 text-white text-lg">
                        {userDetails.user.name?.charAt(0) || userDetails.user.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                        <Label className="text-gray-600">الاسم</Label>
                        <p className="text-gray-900">{userDetails.user.name || 'غير محدد'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">البريد الإلكتروني</Label>
                        <p className="text-gray-900">{userDetails.user.email}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">رقم الهاتف</Label>
                        <p className="text-gray-900">{userDetails.user.phone || 'غير محدد'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">الدور</Label>
                        <div className="mt-1">
                          <Badge className={`${getRoleInfo(userDetails.user.role).color} text-white`}>
                            {getRoleInfo(userDetails.user.role).label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{userDetails.stats.totalOrders}</div>
                    <div className="text-sm text-gray-600">إجمالي الطلبات</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">${userDetails.stats.totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">إجمالي المشتريات</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Coins className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{userDetails.stats.currentCoins}</div>
                    <div className="text-sm text-gray-600">العملات المعدنية</div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{userDetails.stats.activeSessions}</div>
                    <div className="text-sm text-gray-600">الجلسات النشطة</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg">الطلبات الأخيرة</CardTitle>
                </CardHeader>
                <CardContent>
                  {userDetails.orders.recent.length > 0 ? (
                    <div className="space-y-3">
                      {userDetails.orders.recent.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                          <div>
                            <div className="text-gray-900 font-medium">#{order.id.slice(-8)}</div>
                            <div className="text-sm text-gray-600">
                              <DateDisplay date={order.createdAt} format="short" />
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-900 font-medium">${order.total.toFixed(2)}</div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">لا توجد طلبات</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">تعديل المستخدم</DialogTitle>
            <DialogDescription className="text-gray-600">
              تعديل معلومات وصلاحيات المستخدم
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700">الاسم</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            
            <div>
              <Label className="text-gray-700">البريد الإلكتروني</Label>
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900"
                type="email"
              />
            </div>
            
            <div>
              <Label className="text-gray-700">رقم الهاتف</Label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            
            <div>
              <Label className="text-gray-700">الدور</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="bg-white border-gray-300 text-gray-700"
              >
                إلغاء
              </Button>
              <Button
                onClick={updateUser}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updating ? 'جاري التحديث...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              هل أنت متأكد من حذف المستخدم "{selectedUser?.name || selectedUser?.email}"؟
              هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة بالمستخدم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-300 text-gray-700">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteUser}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 