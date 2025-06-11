import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  Zap,
  MessageSquare,
  TrendingUp,
  Users,
  Star
} from "lucide-react"

export function Portfolio() {
  const projects = [
    {
      title: "نظام أتمتة المبيعات المتقدم",
      company: "شركة التجارة الذكية",
      description: "تطوير نظام شامل لأتمتة عمليات المبيعات والمتابعة مع العملاء باستخدام الذكاء الاصطناعي",
      results: [
        "زيادة المبيعات بنسبة 350%",
        "توفير 40 ساعة عمل أسبوعياً",
        "تحسين تجربة العملاء بنسبة 95%"
      ],
      tech: ["n8n", "Python", "OpenAI API", "Make"],
      gradient: "from-cyan-500 to-blue-600",
      category: "أتمتة",
      rating: 5
    },
    {
      title: "روبوت محادثة ذكي للخدمات المصرفية",
      company: "البنك الرقمي المتطور",
      description: "تصميم وتطوير روبوت محادثة متطور لخدمة العملاء المصرفية بدعم اللغة العربية والإنجليزية",
      results: [
        "تقليل وقت الاستجابة 90%",
        "حل 85% من الاستفسارات تلقائياً",
        "توفير مليون ريال سنوياً"
      ],
      tech: ["OpenAI GPT-4", "Webhooks", "API Integration", "Node.js"],
      gradient: "from-purple-500 to-pink-600",
      category: "روبوت محادثة",
      rating: 5
    },
    {
      title: "منصة التسويق الرقمي المتكاملة",
      company: "وكالة الإبداع الرقمي",
      description: "إنشاء منصة شاملة لإدارة الحملات التسويقية وتحليل الأداء باستخدام الذكاء الاصطناعي",
      results: [
        "زيادة معدل التحويل 280%",
        "تحسين ROI بنسبة 400%",
        "أتمتة 95% من المهام التسويقية"
      ],
      tech: ["Zapier", "Google Analytics", "Facebook API", "Python"],
      gradient: "from-green-500 to-emerald-600",
      category: "تسويق رقمي",
      rating: 5
    },
    {
      title: "نظام إدارة المخزون الذكي",
      company: "مجموعة التجارة المتكاملة",
      description: "تطوير نظام ذكي لإدارة المخزون والتنبؤ بالطلب باستخدام تحليلات البيانات المتقدمة",
      results: [
        "تقليل تكاليف المخزون 45%",
        "تحسين دقة التنبؤ 92%",
        "زيادة دوران المخزون 60%"
      ],
      tech: ["Python", "Machine Learning", "API Integration", "Database"],
      gradient: "from-orange-500 to-red-600",
      category: "تحليل البيانات",
      rating: 5
    }
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-8 border border-blue-200">
            <Sparkles className="w-4 h-4 ml-2 text-blue-600" />
            معرض أعمالنا المميزة
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-slate-900 mb-2">قصص نجاح حقيقية</span>
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              غيرت مستقبل الأعمال
            </span>
          </h2>

          <p className="text-xl lg:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            اكتشف كيف ساعدنا عملاءنا في تحقيق نتائج استثنائية وتحويل أعمالهم نحو المستقبل الرقمي
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <CardContent className="relative z-10 p-8">
                {/* Category Badge */}
                <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${project.gradient} rounded-full text-white text-xs font-medium mb-4`}>
                  {project.category}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(project.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 mr-2">تقييم العميل</span>
                </div>

                {/* Title & Company */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                  {project.title}
                </h3>
                <p className="text-blue-600 text-sm mb-4 font-medium">
                  {project.company}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">النتائج المحققة:</h4>
                  <ul className="space-y-2">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient}`}></div>
                        <span className="text-sm font-medium">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">التقنيات المستخدمة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                >
                  اطلب مشروع مشابه
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>

              {/* Floating Icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden mb-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                إنجازات تتحدث عن نفسها
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                أرقام حقيقية من مشاريعنا المنجزة تُظهر قوة حلولنا التقنية
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: TrendingUp, number: "500+", label: "مشروع ناجح", color: "from-cyan-400 to-blue-400" },
                { icon: Users, number: "150+", label: "عميل راضٍ", color: "from-green-400 to-emerald-400" },
                { icon: Sparkles, number: "300%", label: "متوسط نمو الأعمال", color: "from-purple-400 to-pink-400" },
                { icon: Zap, number: "95%", label: "معدل نجاح المشاريع", color: "from-yellow-400 to-orange-400" }
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
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-6 border border-blue-200">
            <MessageSquare className="w-4 h-4 ml-2 text-blue-600" />
            هل أنت مستعد لقصة نجاح جديدة؟
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
            لنبدأ مشروعك التالي معاً
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            تواصل معنا اليوم واحصل على استشارة مجانية لمناقشة مشروعك وكيف يمكننا مساعدتك في تحقيق أهدافك
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <MessageSquare className="ml-2 h-5 w-5" />
                ابدأ مشروعك الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/store">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg rounded-full"
              >
                استكشف حلولنا الجاهزة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 