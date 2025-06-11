'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Edit,
  Save,
  X,
  Shield,
  Award,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'

interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  image: string | null
  role: string
  createdAt: string
  updatedAt: string
}

interface ProfileTabProps {
  user: UserData
  onProfileUpdate: (updatedUser: UserData) => void
}

export default function ProfileTab({ user, onProfileUpdate }: ProfileTabProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    image: user.image || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (data.success) {
        onProfileUpdate(data.user)
        setIsEditingProfile(false)
        toast.success('تم تحديث البيانات بنجاح')
      } else {
        toast.error(data.error || 'فشل في تحديث البيانات')
      }
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error)
      toast.error('خطأ في تحديث البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقتان')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsChangingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        toast.success('تم تغيير كلمة المرور بنجاح')
      } else {
        toast.error(data.error || 'فشل في تغيير كلمة المرور')
      }
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error)
      toast.error('خطأ في تغيير كلمة المرور')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelProfile = () => {
    setProfileData({
      name: user.name || '',
      phone: user.phone || '',
      image: user.image || ''
    })
    setIsEditingProfile(false)
  }

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsChangingPassword(false)
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'مدير النظام'
      case 'MANAGER': return 'مدير'
      case 'USER': return 'مستخدم'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-200'
      case 'MANAGER': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'USER': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="h-4 w-4" />
      case 'MANAGER': return <Award className="h-4 w-4" />
      case 'USER': return <User className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6 space-x-reverse">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {user.name || 'بدون اسم'}
                </h2>
                <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                  {getRoleIcon(user.role)}
                  {getRoleText(user.role)}
                </Badge>
              </div>
              <p className="text-blue-100 mb-1">{user.email}</p>
              <p className="text-sm text-blue-200">
                عضو منذ {new Date(user.createdAt).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">المعلومات الشخصية</CardTitle>
                <p className="text-sm text-gray-600">إدارة بيانات حسابك الشخصية</p>
              </div>
            </div>
            {!isEditingProfile && (
              <Button 
                onClick={() => setIsEditingProfile(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
                <Button
                  onClick={handleCancelProfile}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">الاسم</label>
                  <p className="text-gray-900">{user.name || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">الهاتف</label>
                  <p className="text-gray-900">{user.phone || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">نوع الحساب</label>
                  <p className="text-gray-900">{getRoleText(user.role)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">تغيير كلمة المرور</CardTitle>
                <p className="text-sm text-gray-600">تحديث كلمة مرور حسابك</p>
              </div>
            </div>
            {!isChangingPassword && (
              <Button 
                onClick={() => setIsChangingPassword(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Lock className="h-4 w-4 ml-2" />
                تغيير كلمة المرور
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أدخل كلمة المرور الحالية"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أكد كلمة المرور الجديدة"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                </Button>
                <Button
                  onClick={handleCancelPassword}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">كلمة المرور محمية</h3>
              <p className="text-gray-600 mb-4">
                لتغيير كلمة المرور، ستحتاج إلى إدخال كلمة المرور الحالية
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 