import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  Zap,
  Brain,
  Rocket,
  Database,
  Globe,
  Code,
  MessageSquare
} from "lucide-react"

export function TechStack() {
  const techCategories = [
    {
      title: "أتمتة سير العمل",
      description: "أدوات متطورة لأتمتة العمليات التجارية",
      tools: [
        { name: "n8n", description: "منصة أتمتة مفتوحة المصدر", gradient: "from-purple-500 to-pink-600" },
        { name: "Make", description: "حلول التكامل المتقدمة", gradient: "from-orange-500 to-red-600" },
        { name: "Zapier", description: "ربط التطبيقات والخدمات", gradient: "from-yellow-500 to-orange-600" },
        { name: "Power Automate", description: "أتمتة مايكروسوفت", gradient: "from-blue-500 to-purple-600" }
      ],
      icon: Zap,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      title: "الذكاء الاصطناعي",
      description: "تقنيات الذكاء الاصطناعي المتطورة",
      tools: [
        { name: "OpenAI GPT-4", description: "أحدث نماذج الذكاء الاصطناعي", gradient: "from-green-500 to-emerald-600" },
        { name: "Claude", description: "مساعد ذكي متقدم", gradient: "from-blue-500 to-cyan-600" },
        { name: "Google AI", description: "حلول جوجل للذكاء الاصطناعي", gradient: "from-red-500 to-pink-600" },
        { name: "Hugging Face", description: "مكتبة نماذج AI", gradient: "from-yellow-500 to-orange-600" }
      ],
      icon: Brain,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "التطوير والبرمجة",
      description: "لغات وأدوات التطوير الحديثة",
      tools: [
        { name: "Python", description: "لغة برمجة متطورة", gradient: "from-blue-500 to-green-600" },
        { name: "Node.js", description: "تطوير الخوادم السريع", gradient: "from-green-500 to-teal-600" },
        { name: "React", description: "واجهات مستخدم تفاعلية", gradient: "from-cyan-500 to-blue-600" },
        { name: "Next.js", description: "إطار عمل ويب متقدم", gradient: "from-gray-600 to-gray-800" }
      ],
      icon: Code,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "قواعد البيانات والتخزين",
      description: "حلول تخزين وإدارة البيانات",
      tools: [
        { name: "PostgreSQL", description: "قاعدة بيانات قوية", gradient: "from-blue-600 to-indigo-600" },
        { name: "MongoDB", description: "قاعدة بيانات مرنة", gradient: "from-green-600 to-teal-600" },
        { name: "Redis", description: "تخزين مؤقت سريع", gradient: "from-red-500 to-orange-600" },
        { name: "Firebase", description: "منصة جوجل السحابية", gradient: "from-yellow-500 to-orange-600" }
      ],
      icon: Database,
      gradient: "from-orange-500 to-red-600"
    }
  ]

  const additionalTools = [
    { name: "Google Apps Script", icon: Globe, gradient: "from-blue-600 to-indigo-600" },
    { name: "API Integration", icon: Rocket, gradient: "from-teal-500 to-cyan-600" },
    { name: "Webhooks", icon: Zap, gradient: "from-pink-500 to-rose-600" },
    { name: "Cloud Services", icon: Database, gradient: "from-violet-500 to-purple-600" },
    { name: "Machine Learning", icon: Brain, gradient: "from-emerald-500 to-green-600" },
    { name: "Analytics", icon: MessageSquare, gradient: "from-indigo-500 to-blue-600" }
  ]

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
            مجموعة التقنيات المتقدمة
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2">التقنيات الرائدة</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              التي نعتمد عليها
            </span>
          </h2>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            نستخدم أحدث التقنيات والأدوات العالمية لضمان تقديم حلول متطورة وموثوقة لعملائنا
          </p>
        </div>

        {/* Tech Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {techCategories.map((category, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <CardContent className="relative z-10 p-6">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{category.description}</p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {category.tools.map((tool, idx) => (
                    <div key={idx} className="group/tool">
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 hover:bg-white/10 transition-all duration-300 border border-white/10">
                        <div className={`w-6 h-6 bg-gradient-to-r ${tool.gradient} rounded-md flex items-center justify-center mb-2 group-hover/tool:scale-110 transition-transform duration-300`}>
                          <span className="text-white font-bold text-xs">{tool.name.charAt(0)}</span>
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-1">{tool.name}</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Floating Icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Tools */}
        <div className="mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-center mb-6 text-white">
            أدوات وتقنيات إضافية
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {additionalTools.map((tool, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className={`w-10 h-10 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-200 font-medium text-sm">{tool.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Tech Stack */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 relative overflow-hidden mb-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-white">
                لماذا نختار هذه التقنيات؟
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                معايير صارمة في اختيار التقنيات لضمان أفضل النتائج
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "أداء عالي",
                  description: "تقنيات محسنة للسرعة والكفاءة",
                  color: "from-yellow-400 to-orange-400"
                },
                {
                  icon: Rocket,
                  title: "قابلية التوسع",
                  description: "حلول تنمو مع نمو أعمالك",
                  color: "from-green-400 to-emerald-400"
                },
                {
                  icon: Brain,
                  title: "أمان متقدم",
                  description: "حماية قصوى لبياناتك ومعلوماتك",
                  color: "from-blue-400 to-cyan-400"
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">{benefit.title}</h4>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-4 border border-white/20">
            <MessageSquare className="w-4 h-4 ml-2 text-yellow-400" />
            هل تريد معرفة المزيد؟
          </div>
          
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
            تعرف على كيفية استخدام هذه التقنيات
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            احجز استشارة فنية مجانية لمناقشة التقنيات المناسبة لمشروعك ومتطلباتك
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <Brain className="ml-2 h-4 w-4" />
                استشارة فنية مجانية
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/store">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 text-white hover:border-blue-400 hover:text-blue-400 hover:bg-white/10 px-6 py-3 rounded-xl"
              >
                تصفح أعمالنا التقنية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 