"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Zap,
  BarChart3,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Bot,
  Brain,
  Rocket
} from 'lucide-react'

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [services, setServices] = useState<HomeService[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        
        if (response.ok) {
          const data = await response.json()
          
          const parsedServices = data
            .map((service: any) => ({
              ...service,
              features: JSON.parse(service.features)
            }))
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
          
          setServices(parsedServices)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        // Fallback to default services if API fails
        setServices([
          {
            id: 'default-automation',
            title: 'الأتمتة والتكامل',
            subtitle: 'ربط وأتمتة جميع أنظمة العمل',
            description: 'نقوم بأتمتة العمليات التجارية',
            features: ['أتمتة المهام المتكررة'],
            icon: 'Zap',
            gradient: 'from-cyan-500 to-blue-600',
            bgGradient: 'from-cyan-500/20 to-blue-600/20',
            isActive: true,
            sortOrder: 0
          },
          {
            id: 'default-chatbot',
            title: 'روبوتات المحادثة',
            subtitle: 'خدمة عملاء ذكية 24/7',
            description: 'روبوتات محادثة متطورة',
            features: ['ذكاء اصطناعي متقدم'],
            icon: 'Bot',
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-500/20 to-pink-600/20',
            isActive: true,
            sortOrder: 1
          },
          {
            id: 'default-marketing',
            title: 'التسويق الرقمي',
            subtitle: 'حملات مدعومة بالذكاء الاصطناعي',
            description: 'استراتيجيات تسويق متقدمة',
            features: ['تحليل البيانات'],
            icon: 'BarChart3',
            gradient: 'from-green-500 to-emerald-600',
            bgGradient: 'from-green-500/20 to-emerald-600/20',
            isActive: true,
            sortOrder: 2
          }
        ])
      } finally {
        setServicesLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        console.error('API Error:', data)
        alert(data.error || 'حدث خطأ أثناء إرسال الرسالة')
      }
    } catch (error) {
      console.error('API Error:', error)
      alert('خطأ في الاتصال بالخادم')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "اتصل بنا",
      value: "201555831761+",
      description: "متاح على مدار الساعة",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Mail,
      title: "راسلنا",
      value: "info@exabytex.com",
      description: "نرد خلال ساعة واحدة",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
  ]

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 min-h-[80vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">تم إرسال رسالتك بنجاح!</h1>
          <p className="text-xl text-gray-300 mb-8">سنتواصل معك في أقرب وقت ممكن</p>
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              العودة للرئيسية
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold mb-6">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            تواصل معنا
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            دعنا نحول 
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              أحلامك لحقيقة
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            فريقنا من خبراء الذكاء الاصطناعي جاهز لمساعدتك في تحويل أعمالك نحو المستقبل
          </p>

          {/* Floating Elements */}
          <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center animate-bounce">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="absolute top-40 left-10 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="relative z-10">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white mb-4">
                  ابدأ مشروعك معنا
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  أخبرنا عن رؤيتك وسنحولها إلى واقع رقمي متطور
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        الاسم الكامل
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        البريد الإلكتروني
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        رقم الهاتف
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                        placeholder="+201555831761"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        نوع الخدمة
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-blue-400 focus:outline-none"
                        disabled={servicesLoading}
                      >
                        <option value="" className="text-gray-900">
                          {servicesLoading ? 'جاري تحميل الخدمات...' : 'اختر الخدمة'}
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={service.title} className="text-gray-900">
                            {service.title}
                          </option>
                        ))}
                        <option value="consultation" className="text-gray-900">استشارة عامة</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      تفاصيل المشروع
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="أخبرنا عن مشروعك، أهدافك، والتحديات التي تواجهها..."
                      rows={5}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        أرسل رسالتك الآن
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </div>
          </Card>

          {/* Contact Info & Services */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${contact.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <CardContent className="relative z-10 p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <contact.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{contact.title}</h3>
                    <p className="text-blue-300 font-medium text-sm mb-1">{contact.value}</p>
                    <p className="text-gray-400 text-xs">{contact.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Services */}
            <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-blue-400" />
                    خدماتنا السريعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {servicesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                          <div className="w-10 h-10 rounded-lg bg-gray-300 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-5 h-5 text-white">
                              {service.icon === 'Zap' && <Zap className="w-5 h-5" />}
                              {service.icon === 'MessageSquare' && <MessageSquare className="w-5 h-5" />}
                              {service.icon === 'BarChart3' && <BarChart3 className="w-5 h-5" />}
                              {service.icon === 'Bot' && <Bot className="w-5 h-5" />}
                              {service.icon === 'Rocket' && <Rocket className="w-5 h-5" />}
                              {service.icon === 'Brain' && <Brain className="w-5 h-5" />}
                              {/* Default icon if not found */}
                              {!['Zap', 'MessageSquare', 'BarChart3', 'Bot', 'Rocket', 'Brain'].includes(service.icon) && <Sparkles className="w-5 h-5" />}
                            </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{service.title}</h4>
                            <p className="text-gray-400 text-sm">{service.subtitle}</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
} 