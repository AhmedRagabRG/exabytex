import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  MessageSquare,
  Search,
  Settings,
  Rocket,
  CheckCircle,
  Users
} from "lucide-react"

export function ProcessSteps() {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "استشارة مجانية",
      description: "نبدأ بجلسة استشارية مجانية لفهم احتياجاتك وتحديات أعمالك الحالية",
      details: [
        "تحليل الوضع الحالي لأعمالك",
        "تحديد نقاط الضعف والقوة",
        "وضع أهداف واضحة ومحددة"
      ],
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/10 to-blue-600/10"
    },
    {
      number: "02",
      icon: Search,
      title: "دراسة وتحليل",
      description: "نقوم بدراسة شاملة لأعمالك ونحلل البيانات لوضع استراتيجية مناسبة",
      details: [
        "تحليل السوق والمنافسين",
        "دراسة سلوك العملاء",
        "تحديد الفرص والحلول المناسبة"
      ],
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-600/10"
    },
    {
      number: "03",
      icon: Settings,
      title: "تطوير وتنفيذ",
      description: "نطور الحلول المخصصة ونقوم بتنفيذها وفقاً لأعلى معايير الجودة",
      details: [
        "تطوير الحلول المخصصة",
        "اختبار شامل للأنظمة",
        "تدريب فريق العمل"
      ],
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-600/10"
    },
    {
      number: "04",
      icon: Rocket,
      title: "إطلاق ومتابعة",
      description: "نطلق الحلول ونقدم الدعم الفني المستمر لضمان أفضل النتائج",
      details: [
        "إطلاق تدريجي للحلول",
        "مراقبة الأداء المستمر",
        "تحسينات وتطويرات دورية"
      ],
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/10 to-red-600/10"
    }
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-8 border border-white/20">
            <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
            منهجية العمل المتقدمة
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white mb-2">كيف نحول</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              أفكارك إلى واقع
            </span>
          </h2>

          <p className="text-xl lg:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            نتبع منهجية علمية ومدروسة لضمان نجاح مشروعك وتحقيق أفضل النتائج في أقل وقت ممكن
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting Line (for desktop) */}
              {index < steps.length - 1 && index % 2 === 0 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-white/30 to-transparent transform -translate-y-1/2 z-10"></div>
              )}
              
              <Card className="group relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <CardContent className="relative z-10 p-8">
                  {/* Step Number */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-white/20 group-hover:text-white/30 transition-colors">
                      {step.number}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* Floating Icons */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Success Guarantee Section */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              ضمان النجاح 100%
            </h3>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              نحن واثقون من جودة خدماتنا لدرجة أننا نضمن لك النجاح أو نعيد لك أموالك بالكامل
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { number: "30", label: "يوم ضمان استرداد", icon: CheckCircle },
                { number: "24/7", label: "دعم فني متواصل", icon: Users },
                { number: "∞", label: "تحديثات مجانية", icon: Rocket }
              ].map((guarantee, index) => (
                <div key={index} className="group">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <guarantee.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{guarantee.number}</div>
                  <div className="text-gray-300 text-sm">{guarantee.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-6 border border-white/20">
            <MessageSquare className="w-4 h-4 ml-2 text-yellow-400" />
            ابدأ رحلتك التقنية اليوم
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            مستعد لبدء مشروعك؟
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            احجز استشارتك المجانية الآن ودعنا نناقش كيف يمكننا مساعدتك في تحقيق أهدافك
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
              <MessageSquare className="ml-2 h-5 w-5" />
              احجز استشارة مجانية
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            </Link>
            <Link href="/store">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm"
            >
              شاهد أعمالنا السابقة
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 