import { Card, CardContent } from "@/components/ui/card"
import { 
  Star, 
  Quote, 
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Zap,
  CheckCircle
} from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "أحمد محمد",
      title: "مدير تقني",
      company: "شركة التقنيات المتقدمة",
      content: "لقد غيرت حلول الذكاء الاصطناعي من هذا الفريق طريقة عملنا تماماً. زادت كفاءتنا بنسبة 300% وقللت من الأخطاء البشرية إلى أدنى حد ممكن.",
      rating: 5,
      image: "/api/placeholder/64/64",
      gradient: "from-blue-500 to-purple-500",
      accent: "blue"
    },
    {
      name: "فاطمة العلي",
      title: "مديرة التسويق",
      company: "مجموعة الإبداع التجاري",
      content: "روبوت المحادثة الذي طوروه لنا أصبح جزءاً لا يتجزأ من خدمة العملاء. يتعامل مع 80% من الاستفسارات تلقائياً ويحول العملاء بكفاءة عالية.",
      rating: 5,
      image: "/api/placeholder/64/64",
      gradient: "from-purple-500 to-pink-500",
      accent: "purple"
    },
    {
      name: "خالد السعودي",
      title: "الرئيس التنفيذي",
      company: "متجر الكتروني رائد",
      content: "بفضل نظام التسويق الرقمي المتقدم، زادت مبيعاتنا بنسبة 250% في ستة أشهر فقط. النتائج فاقت كل توقعاتنا وأصبحنا نعتمد عليه بالكامل.",
      rating: 5,
      image: "/api/placeholder/64/64",
      gradient: "from-green-500 to-teal-500",
      accent: "green"
    },
    {
      name: "مريم الزهراني",
      title: "مديرة العمليات",
      company: "مؤسسة الخدمات المالية",
      content: "أتمتة العمليات التي قاموا بتطويرها وفرت علينا ساعات عمل يومياً وحسنت من دقة البيانات. فريق محترف ونتائج مذهلة.",
      rating: 5,
      image: "/api/placeholder/64/64",
      gradient: "from-orange-500 to-red-500",
      accent: "orange"
    },
    {
      name: "عبدالله المطيري",
      title: "مدير المبيعات",
      company: "شركة التجارة الذكية",
      content: "التحليلات والإحصائيات التي نحصل عليها من نظامهم ساعدتنا في اتخاذ قرارات أكثر ذكاءً وتحقيق أهدافنا بشكل أسرع.",
      rating: 5,
      image: "/api/placeholder/64/64",
      gradient: "from-cyan-500 to-blue-500",
      accent: "cyan"
    },
    {
      name: "نورا القحطاني",
      title: "مديرة الموارد البشرية",
      company: "مجموعة الأعمال المتكاملة",
      content: "الدعم الفني المستمر والتطوير المتواصل للحلول يجعلهم شركاء حقيقيين في نجاحنا. أنصح بهم بشدة لأي شركة تريد التميز.",
      rating: 5,
      image: "/api/placeholder/64/64",
      gradient: "from-pink-500 to-rose-500",
      accent: "pink"
    }
  ]

  const stats = [
    { 
      icon: Users, 
      number: "500+", 
      label: "عميل راضٍ", 
      description: "من الشركات والمؤسسات",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: TrendingUp, 
      number: "300%", 
      label: "زيادة الكفاءة", 
      description: "في متوسط أداء العملاء",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: Award, 
      number: "95%", 
      label: "معدل الرضا", 
      description: "من عملائنا يجددون التعاقد",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Zap, 
      number: "24/7", 
      label: "دعم فني", 
      description: "متاح على مدار الساعة",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold mb-4">
            <Quote className="h-4 w-4 text-blue-600" />
            شهادات عملائنا
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
            قصص نجاح حقيقية
            <span className="block text-3xl lg:text-5xl mt-2">من عملائنا المميزين</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اكتشف كيف ساعدنا عملاءنا في تحقيق نتائج استثنائية وتحويل أعمالهم نحو المستقبل
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}></div>
              
              <CardContent className="relative z-10 p-6">
                {/* Quote Icon */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-10 group-hover:opacity-100 transition-opacity duration-500">
                  <Quote className="h-6 w-6 text-white" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>

                {/* Success Indicator */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
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

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                انضم إلى عملائنا الناجحين
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                مئات الشركات تثق بنا لتحويل أعمالها رقمياً. كن جزءاً من قصص النجاح التالية
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 items-center">
                {[
                  "✓ استشارة مجانية شاملة",
                  "✓ خطة مخصصة لاحتياجاتك",
                  "✓ تنفيذ احترافي سريع",
                  "✓ دعم فني مستمر",
                  "✓ ضمان النتائج",
                  "✓ تدريب شامل للفريق"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 