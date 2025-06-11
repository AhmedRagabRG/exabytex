'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  X,
  AlertTriangle,
  Trash2
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  createdAt: string
}

interface AccountSettingsModalProps {
  user: UserData
  isOpen: boolean
  onClose: () => void
}

export function AccountSettingsModal({ user, isOpen, onClose }: AccountSettingsModalProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    darkMode: false,
    language: 'ar',
    twoFactorAuth: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // هنا يمكن إضافة API call لحفظ الإعدادات
      await new Promise(resolve => setTimeout(resolve, 1000)) // محاكاة API call
      setSuccess('تم حفظ الإعدادات بنجاح!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutAllDevices = async () => {
    try {
      await signOut({ redirect: false })
      // إضافة logic لتسجيل الخروج من جميع الأجهزة
      window.location.href = '/auth/signin'
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }
    
    try {
      // هنا يمكن إضافة API call لحذف الحساب
      alert('سيتم تطبيق هذه الميزة قريباً')
    } catch (error) {
      console.error('خطأ في حذف الحساب:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">إعدادات الحساب</CardTitle>
              <CardDescription>إدارة تفضيلات وإعدادات حسابك</CardDescription>
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
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Notifications Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                إعدادات التنبيهات
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">تنبيهات البريد الإلكتروني</Label>
                    <p className="text-sm text-gray-500">استقبال التنبيهات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="push-notifications">التنبيهات الفورية</Label>
                    <p className="text-sm text-gray-500">استقبال التنبيهات الفورية على المتصفح</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="marketing-emails">رسائل التسويق</Label>
                    <p className="text-sm text-gray-500">استقبال عروض وأخبار المنتجات</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="security-alerts">تنبيهات الأمان</Label>
                    <p className="text-sm text-gray-500">تنبيهات مهمة حول أمان حسابك</p>
                  </div>
                  <Switch
                    id="security-alerts"
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Security Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                إعدادات الأمان
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="two-factor">المصادقة الثنائية</Label>
                    <p className="text-sm text-gray-500">حماية إضافية لحسابك</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogoutAllDevices}
                  className="w-full"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  تسجيل الخروج من جميع الأجهزة
                </Button>
              </div>
            </div>

            <Separator />

            {/* Appearance Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                إعدادات المظهر
              </h3>
              
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">الوضع المظلم</Label>
                    <p className="text-sm text-gray-500">تفعيل المظهر المظلم للموقع</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>اللغة</Label>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant={settings.language === 'ar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSettings(prev => ({ ...prev, language: 'ar' }))}
                    >
                      العربية
                    </Button>
                    <Button
                      variant={settings.language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSettings(prev => ({ ...prev, language: 'en' }))}
                    >
                      English
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">معلومات الحساب</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">ID الحساب:</span>
                  <span className="text-sm text-gray-600">{user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">تاريخ التسجيل:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">نوع الحساب:</span>
                  <span className="text-sm text-gray-600">
                    {user.role === 'ADMIN' ? 'مدير' : 'مستخدم'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-red-600 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                منطقة الخطر
              </h3>
              
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-800">حذف الحساب</h4>
                  <p className="text-sm text-red-600">
                    حذف حسابك نهائياً مع جميع البيانات المرتبطة به. هذا الإجراء لا يمكن التراجع عنه.
                  </p>
                  
                  {showDeleteConfirm && (
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-800 font-medium mb-2">
                        ⚠️ هل أنت متأكد من رغبتك في حذف حسابك؟
                      </p>
                      <p className="text-sm text-red-700">
                        اكتب حذف لتأكيد العملية (ميزة تحت التطوير)
                      </p>
                    </div>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAccount}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {showDeleteConfirm ? 'تأكيد الحذف' : 'حذف الحساب'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 rtl:space-x-reverse pt-4">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                إغلاق
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 