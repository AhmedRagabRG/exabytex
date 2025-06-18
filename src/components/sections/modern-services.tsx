"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Zap, 
  MessageSquare, 
  BarChart3, 
  ArrowLeft, 
  Sparkles,
  Bot,
  TrendingUp,
  Rocket,
  Brain,
  Settings,
  Globe,
  Database,
  Monitor
} from "lucide-react"

// Icon mapping
const iconMap = {
  Zap,
  MessageSquare,
  BarChart3,
  Monitor,
  Bot,
  TrendingUp,
  Rocket,
  Brain,
  Settings,
  Globe,
  Database
}

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

interface ApiHomeService {
  id: string
  title: string
  subtitle: string
  description: string
  features: string // JSON string
  icon: string
  gradient: string
  bgGradient: string
  isActive: boolean
  sortOrder: number
}

export function ModernServices() {
  const [services, setServices] = useState<HomeService[]>([])
  const [loading, setLoading] = useState(true)

  // Default services (fallback)
  const defaultServices = [
    {
      id: 'default-1',
      title: "الأتمتة والتكامل",
      subtitle: "ربط وأتمتة جميع أنظمة العمل",
      description: "نقوم بأتمتة العمليات التجارية وتكامل الأنظمة المختلفة لتحسين الكفاءة والإنتاجية بشكل جذري",
      features: ["أتمتة المهام المتكررة", "تكامل الأنظمة المختلفة", "تحليل وتحسين العمليات", "مراقبة الأداء المستمر"],
      icon: "Zap",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/20 to-blue-600/20",
      isActive: true,
      sortOrder: 0
    },
    {
      id: 'default-2',
      title: "روبوتات المحادثة الذكية",
      subtitle: "خدمة عملاء ذكية 24/7",
      description: "نصمم روبوتات محادثة متطورة تستخدم الذكاء الاصطناعي لتحسين تجربة العملاء وزيادة المبيعات",
      features: ["ذكاء اصطناعي متقدم", "دعم متعدد اللغات", "تحليل المشاعر", "تكامل مع منصات متعددة"],
      icon: "MessageSquare",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/20 to-pink-600/20",
      isActive: true,
      sortOrder: 1
    },
    {
      id: 'default-3',
      title: "التسويق الرقمي المتقدم",
      subtitle: "استراتيجيات تسويقية متقدمة",
      description: "نستخدم تحليلات البيانات والذكاء الاصطناعي لإنشاء حملات تسويقية فعالة ومستهدفة",
      features: ["تحليل البيانات المتقدم", "استهداف دقيق للجمهور", "أتمتة الحملات", "تحسين معدل التحويل"],
      icon: "BarChart3",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/20 to-emerald-600/20",
      isActive: true,
      sortOrder: 2
    },
    {
      id: 'default-4',
      title: "برمجة وتصميم المواقع",
      subtitle: "مواقع احترافية سريعة وآمنة",
      description: "نطور مواقع ويب حديثة ومتجاوبة باستخدام أحدث التقنيات لضمان أفضل تجربة مستخدم وأداء مثالي",
      features: ["تصميم متجاوب لجميع الأجهزة", "تطوير بأحدث التقنيات", "تحسين محركات البحث SEO", "أمان وحماية متقدمة"],
      icon: "Monitor",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/20 to-red-600/20",
      isActive: true,
      sortOrder: 3
    }
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/home-services')
      if (response.ok) {
        const data: ApiHomeService[] = await response.json()
        if (data.length > 0) {
          const parsedServices = data.map((service: ApiHomeService) => ({
            ...service,
            features: JSON.parse(service.features)
          }))
          setServices(parsedServices.filter((s: HomeService) => s.isActive))
        } else {
          setServices(defaultServices)
        }
      } else {
        setServices(defaultServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices(defaultServices)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="services" className="relative py-20 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mx-auto w-48 mb-8"></div>
              <div className="h-16 bg-gray-200 rounded mx-auto w-96 mb-12"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="relative py-20 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-8 border border-blue-200">
            <Sparkles className="w-4 h-4 ml-2 text-blue-600" />
            خدماتنا المتخصصة
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-slate-900 mb-2">حلول الذكاء الاصطناعي</span>
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              لمستقبل أعمالك
            </span>
          </h2>

          <p className="text-xl lg:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            نقدم حلول تقنية متطورة تعتمد على الذكاء الاصطناعي لتحويل أعمالك وتحقيق نمو استثنائي
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Zap
            
            return (
              <Card key={service.id} className={`group relative overflow-hidden border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 delay-${index * 300}`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <CardContent className="relative z-10 p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-900 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-blue-600 text-sm mb-4 font-medium">
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/contact">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                    >
                      تعرف على المزيد
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>

                {/* Floating Icons */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold mb-4">
            <Rocket className="h-4 w-4 text-blue-600" />
            ابدأ رحلتك معنا
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
            مستعد لتحويل أعمالك؟
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            احصل على استشارة مجانية واكتشف كيف يمكن للذكاء الاصطناعي أن يغير مستقبل شركتك
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold">
                استكشف حلولنا
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-3 text-lg"
              >
                احجز استشارة مجانية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 