import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  Award,
  CheckCircle
} from "lucide-react"

export function ClientResults() {
  const testimonials = [
    {
      name: "أحمد محمد السعودي",
      title: "الرئيس التنفيذي",
      company: "شركة التقنيات المتقدمة",
      content: "زادت حلول الأتمتة من كفاءة أعمالنا بنسبة 400% وقللت من الأخطاء إلى الصفر تقريباً. استثمار يستحق كل ريال.",
      rating: 5,
      results: "زيادة الإنتاجية 400%",
      avatar: "أ",
      gradient: "from-blue-500 to-cyan-500",
      category: "أتمتة"
    },
    {
      name: "فاطمة عبدالله المطيري",
      title: "مديرة التسويق الرقمي",
      company: "مجموعة الإبداع التجاري",
      content: "روبوت المحادثة الذي طوروه غير طريقة تعاملنا مع العملاء تماماً. يتعامل مع 90% من الاستفسارات تلقائياً.",
      rating: 5,
      results: "توفير 80% من وقت الدعم",
      avatar: "ف",
      gradient: "from-purple-500 to-pink-500",
      category: "روبوت محادثة"
    },
    {
      name: "خالد أحمد الزهراني",
      title: "مدير المبيعات",
      company: "متجر الكتروني رائد",
      content: "حملات التسويق الذكية زادت مبيعاتنا بنسبة 350% في 6 أشهر فقط. النتائج فاقت كل توقعاتنا بمراحل.",
      rating: 5,
      results: "نمو المبيعات 350%",
      avatar: "خ",
      gradient: "from-green-500 to-emerald-500",
      category: "تسويق رقمي"
    },
    {
      name: "مريم سالم القحطاني",
      title: "مديرة العمليات",
      company: "مؤسسة الخدمات المالية",
      content: "أنظمة التحليل والتقارير الذكية ساعدتنا في اتخاذ قرارات أفضل وتحسين أدائنا المالي بشكل كبير.",
      rating: 5,
      results: "تحسين الأداء المالي 250%",
      avatar: "م",
      gradient: "from-orange-500 to-red-500",
      category: "تحليل البيانات"
    },
    {
      name: "عبدالرحمن محمد العتيبي",
      title: "مدير التقنية",
      company: "شركة الحلول الذكية",
      content: "الدعم الفني المستمر والتطوير المتواصل يجعلهم شركاء حقيقيين في نجاحنا. أنصح بهم بشدة.",
      rating: 5,
      results: "رضا العملاء 98%",
      avatar: "ع",
      gradient: "from-teal-500 to-cyan-500",
      category: "دعم فني"
    },
    {
      name: "نورا سعد الشهري",
      title: "مديرة الموارد البشرية",
      company: "مجموعة الأعمال المتكاملة",
      content: "أتمتة العمليات الإدارية وفرت علينا ساعات عمل يومياً وحسنت من دقة البيانات بشكل ملحوظ.",
      rating: 5,
      results: "توفير 60% من الوقت",
      avatar: "ن",
      gradient: "from-pink-500 to-rose-500",
      category: "إدارة الموارد"
    }
  ]

  const stats = [
    {
      icon: TrendingUp,
      number: "350%",
      label: "متوسط زيادة الإنتاجية",
      description: "للعملاء الذين استخدموا حلولنا",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Users,
      number: "500+",
      label: "مشروع ناجح",
      description: "تم تسليمه بنجاح للعملاء",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: DollarSign,
      number: "95%",
      label: "توفير في التكاليف",
      description: "متوسط ما يوفره عملاؤنا سنوياً",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "دعم متواصل",
      description: "فريق دعم جاهز في أي وقت",
      color: "from-orange-500 to-red-600"
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
            نتائج حقيقية من عملائنا
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white mb-2">عملاؤنا يحققون</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              نتائج استثنائية
            </span>
          </h2>

          <p className="text-xl lg:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            اكتشف كيف غيرت حلولنا التقنية حياة عملائنا وساعدتهم في تحقيق أهدافهم وتجاوز توقعاتهم
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-300 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardContent className="relative z-10 p-6">
                {/* Category Badge */}
                <div className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${testimonial.gradient} rounded-full text-white text-xs font-medium mb-4`}>
                  {testimonial.category}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-300 mb-6 leading-relaxed text-sm italic">
                  &quot;{testimonial.content}&quot;
                </blockquote>

                {/* Results */}
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-semibold text-sm">{testimonial.results}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.title}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>

                {/* Success Indicator */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <CheckCircle className="h-3 w-3" />
                    نجاح مؤكد
                  </div>
                </div>
              </CardContent>

              {/* Floating Sparkles */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </Card>
          ))}
        </div>

        {/* Success Guarantee */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Award className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              ضمان تحقيق النتائج
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              نضمن لك تحقيق نتائج ملموسة خلال الشهر الأول من التطبيق، أو نعيد لك أموالك بالكامل
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: "زيادة الكفاءة", 
                  percentage: "200%+", 
                  description: "حد أدنى مضمون",
                  icon: TrendingUp,
                  color: "from-cyan-400 to-blue-500"
                },
                { 
                  title: "توفير الوقت", 
                  percentage: "50%+", 
                  description: "من الوقت المستهلك",
                  icon: Clock,
                  color: "from-green-400 to-emerald-500"
                },
                { 
                  title: "تحسين الأرباح", 
                  percentage: "150%+", 
                  description: "عائد على الاستثمار",
                  icon: DollarSign,
                  color: "from-purple-400 to-pink-500"
                }
              ].map((guarantee, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${guarantee.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <guarantee.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{guarantee.percentage}</div>
                  <div className="text-lg font-semibold text-gray-300 mb-1">{guarantee.title}</div>
                  <div className="text-sm text-gray-400">{guarantee.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-6 border border-white/20">
            <Users className="w-4 h-4 ml-2 text-yellow-400" />
            انضم إلى عملائنا الناجحين
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            هل أنت مستعد لتكون قصة نجاح جديدة؟
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            احجز استشارتك المجانية اليوم واكتشف كيف يمكننا مساعدتك في تحقيق نفس النتائج المذهلة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
              <Users className="ml-2 h-5 w-5" />
              ابدأ قصة نجاحك الآن
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm"
            >
              شاهد المزيد من النتائج
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 