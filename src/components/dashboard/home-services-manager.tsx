"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Monitor,
} from "lucide-react"
import { toast } from "sonner"

interface HomeService {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  icon: string
  gradient: string
  bgGradient: string
  isActive: boolean
  sortOrder: number
}

const iconOptions = [
  { value: "Zap", label: "⚡ برق", gradient: "from-cyan-500 to-blue-600" },
  { value: "MessageSquare", label: "💬 رسالة", gradient: "from-purple-500 to-pink-600" },
  { value: "BarChart3", label: "📊 إحصائيات", gradient: "from-green-500 to-emerald-600" },
  { value: "Monitor", label: "🖥️ شاشة", gradient: "from-orange-500 to-red-600" },
  { value: "Globe", label: "🌐 عالمي", gradient: "from-blue-500 to-indigo-600" },
  { value: "Settings", label: "⚙️ إعدادات", gradient: "from-gray-500 to-slate-600" }
]

export function HomeServicesManager() {
  const [services, setServices] = useState<HomeService[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<HomeService | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    features: [""],
    icon: "Zap",
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    isActive: true,
    sortOrder: 0
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/home-services')
      if (response.ok) {
        const data = await response.json()
        const parsedServices = data.map((service: any) => ({
          ...service,
          features: JSON.parse(service.features)
        }))
        setServices(parsedServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('خطأ في تحميل الخدمات')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const filteredFeatures = formData.features.filter(f => f.trim() !== '')
      if (filteredFeatures.length === 0) {
        toast.error('يجب إضافة ميزة واحدة على الأقل')
        return
      }

      const serviceData = {
        ...formData,
        features: filteredFeatures
      }

      const response = editingService
        ? await fetch(`/api/admin/home-services/${editingService.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
          })
        : await fetch('/api/admin/home-services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
          })

      if (response.ok) {
        toast.success(editingService ? 'تم تحديث الخدمة بنجاح' : 'تم إضافة الخدمة بنجاح')
        fetchServices()
        handleCancel()
      } else {
        toast.error('خطأ في حفظ الخدمة')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('خطأ في حفظ الخدمة')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return

    try {
      const response = await fetch(`/api/admin/home-services/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('تم حذف الخدمة بنجاح')
        fetchServices()
      } else {
        toast.error('خطأ في حذف الخدمة')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('خطأ في حذف الخدمة')
    }
  }

  const handleEdit = (service: HomeService) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      subtitle: service.subtitle,
      description: service.description,
      features: [...service.features, ""],
      icon: service.icon,
      gradient: service.gradient,
      bgGradient: service.bgGradient,
      isActive: service.isActive,
      sortOrder: service.sortOrder
    })
    setIsCreating(true)
  }

  const handleCancel = () => {
    setEditingService(null)
    setIsCreating(false)
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      features: [""],
      icon: "Zap",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/20 to-blue-600/20",
      isActive: true,
      sortOrder: 0
    })
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }))
  }

  const handleIconChange = (iconValue: string) => {
    const selectedIcon = iconOptions.find(opt => opt.value === iconValue)
    if (selectedIcon) {
      setFormData(prev => ({
        ...prev,
        icon: iconValue,
        gradient: selectedIcon.gradient,
        bgGradient: selectedIcon.gradient.replace(/from-(\w+)-(\d+) to-(\w+)-(\d+)/, 'from-$1-$2/20 to-$3-$4/20')
      }))
    }
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
          <h2 className="text-2xl font-bold">إدارة خدمات الصفحة الرئيسية</h2>
          <p className="text-gray-600">إدارة الخدمات المعروضة في الصفحة الرئيسية</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة خدمة جديدة
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">عنوان الخدمة</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: الأتمتة والتكامل"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">العنوان الفرعي</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="مثال: ربط وأتمتة جميع أنظمة العمل"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">وصف الخدمة</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف تفصيلي للخدمة..."
                rows={3}
              />
            </div>

            <div>
              <Label>الرمز والتصميم</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {iconOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.icon === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleIconChange(option.value)}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${option.gradient} rounded-lg mx-auto mb-2`}></div>
                    <p className="text-sm text-center">{option.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>المميزات</Label>
              <div className="space-y-2 mt-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="أدخل ميزة..."
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة ميزة
                </Button>
              </div>
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

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${service.gradient} rounded-lg`}></div>
                  {service.title}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{service.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <div className="space-y-1 mb-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                    {feature}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "نشط" : "غير نشط"}
                </Badge>
                <span className="text-xs text-gray-500">ترتيب: {service.sortOrder}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-8">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h3>
            <p className="text-gray-500 mb-4">ابدأ بإضافة خدمة جديدة للصفحة الرئيسية</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة خدمة جديدة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 