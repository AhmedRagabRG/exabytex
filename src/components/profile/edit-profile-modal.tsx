'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Lock, Eye, EyeOff, X } from 'lucide-react'

interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  createdAt: string
}

interface UpdateUserData {
  name: string
  email: string
  phone: string
  currentPassword?: string
  newPassword?: string
}

interface EditProfileModalProps {
  user: UserData
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedUser: UserData) => void
}

export function EditProfileModal({ user, isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // التحقق من البيانات
      if (!formData.name.trim() || !formData.email.trim()) {
        setError('الاسم والبريد الإلكتروني مطلوبان')
        setIsLoading(false)
        return
      }

      // إذا كان يريد تغيير كلمة المرور
      if (changePassword) {
        if (!formData.currentPassword) {
          setError('كلمة المرور الحالية مطلوبة')
          setIsLoading(false)
          return
        }
        
        if (!formData.newPassword) {
          setError('كلمة المرور الجديدة مطلوبة')
          setIsLoading(false)
          return
        }

        if (formData.newPassword !== formData.confirmPassword) {
          setError('كلمة المرور الجديدة وتأكيدها غير متطابقين')
          setIsLoading(false)
          return
        }

        if (formData.newPassword.length < 6) {
          setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
          setIsLoading(false)
          return
        }
      }

      // إرسال البيانات للـ API
      const updateData: UpdateUserData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      }

      if (changePassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ في التحديث')
      }

      setSuccess('تم تحديث البيانات بنجاح!')
      setTimeout(() => {
        onSuccess(data.user)
        onClose()
      }, 1500)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ في التحديث')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">تعديل الملف الشخصي</CardTitle>
              <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">المعلومات الشخصية</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pr-10"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pr-10"
                      placeholder="example@domain.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pr-10"
                      placeholder="مثال: 0501234567"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">تغيير كلمة المرور</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setChangePassword(!changePassword)}
                  >
                    {changePassword ? 'إلغاء' : 'تغيير كلمة المرور'}
                  </Button>
                </div>

                {changePassword && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">كلمة المرور الحالية *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="pr-10 pl-10"
                          placeholder="أدخل كلمة المرور الحالية"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="pr-10 pl-10"
                          placeholder="أدخل كلمة المرور الجديدة"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة *</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pr-10 pl-10"
                          placeholder="أعد إدخال كلمة المرور الجديدة"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 