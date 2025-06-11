import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, 
  MessageSquare, 
  BarChart3, 
  ArrowLeft, 
  Sparkles,
  Bot,
  TrendingUp,
  Rocket,
  Globe
} from "lucide-react"

export function Services() {
  const services = [
    {
      icon: Zap,
      title: "الأتمتة والتكامل",
      description: "نقوم بأتمتة العمليات التجارية وتكامل الأنظمة لتحسين الكفاءة والإنتاجية بشكل جذري",
      features: ["أتمتة المهام المتكررة", "تكامل الأنظمة المختلفة", "تحليل وتحسين العمليات", "مراقبة الأداء المستمر"],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      accent: "blue"
    },
    {
      icon: MessageSquare,
      title: "روبوتات المحادثة الذكية",
      description: "نصمم روبوتات محادثة متطورة تستخدم الذكاء الاصطناعي لتحسين تجربة العملاء وزيادة المبيعات",
      features: ["ذكاء اصطناعي متقدم", "دعم متعدد اللغات", "تحليل المشاعر", "تكامل مع منصات متعددة"],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      accent: "purple"
    },
    {
      icon: BarChart3,
      title: "التسويق الرقمي المتقدم",
      description: "نستخدم تحليلات البيانات والذكاء الاصطناعي لإنشاء حملات تسويقية فعالة ومستهدفة",
      features: ["تحليل البيانات المتقدم", "استهداف دقيق للجمهور", "أتمتة الحملات", "تحسين معدل التحويل"],
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      accent: "green"
    }
  ]

  return (
    <section id="services" className="relative py-20 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            خدماتنا المتخصصة
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            حلول الذكاء الاصطناعي
            <span className="block text-3xl lg:text-5xl mt-2">لمستقبل أعمالك</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نقدم حلول تقنية متطورة تعتمد على الذكاء الاصطناعي لتحويل أعمالك وتحقيق نمو استثنائي
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/70 backdrop-blur-sm">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

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
              </div>

              {/* Floating Icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                لماذا نحن الخيار الأفضل؟
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                أرقام تتحدث عن تميزنا وخبرتنا في مجال الذكاء الاصطناعي
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Bot, number: "500+", label: "مشروع ناجح", color: "from-blue-400 to-cyan-400" },
                { icon: TrendingUp, number: "95%", label: "معدل الرضا", color: "from-green-400 to-emerald-400" },
                { icon: Globe, number: "50+", label: "عميل سعيد", color: "from-purple-400 to-pink-400" },
                { icon: Rocket, number: "24/7", label: "دعم فني", color: "from-yellow-400 to-orange-400" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
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