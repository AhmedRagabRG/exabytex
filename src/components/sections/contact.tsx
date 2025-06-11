import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  MessageSquare,
  Mail,
  Clock,
  Users,
  CheckCircle,
  Rocket,
  Calendar
} from "lucide-react"

export function Contact() {
  const contactMethods = [
    {
      icon: MessageSquare,
      title: "واتساب",
      description: "للاستفسارات السريعة والدعم الفوري",
      value: "201555831761+",
      action: "إرسال رسالة",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-600/10"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      description: "للمراسلات الرسمية وإرسال المستندات",
      value: "info@exabytex.com",
      action: "إرسال إيميل",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-600/10"
    },
    {
      icon: Calendar,
      title: "احجز موعد",
      description: "لاستشارة شخصية مجانية مع خبرائنا",
      value: "استشارة مجانية 30 دقيقة",
      action: "احجز الآن",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/10 to-red-600/10"
    }
  ]

  const officeInfo = [
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "الأحد - الخميس: 9:00 - 18:00",
      description: "دعم فني 24/7 متوفر دائماً"
    },
    {
      icon: Users,
      title: "فريق الدعم",
      value: "متوفر على مدار الساعة",
      description: "خبراء تقنيون مختصون"
    }
  ]

  const guarantees = [
    {
      icon: CheckCircle,
      title: "رد خلال ساعة",
      description: "نضمن الرد على استفساراتك خلال ساعة واحدة كحد أقصى"
    },
    {
      icon: Rocket,
      title: "استشارة مجانية",
      description: "أول استشارة مجانية تماماً لمناقشة مشروعك"
    },
    {
      icon: Users,
      title: "فريق متخصص",
      description: "خبراء في الذكاء الاصطناعي والأتمتة والتسويق الرقمي"
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
            تواصل معنا اليوم
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white mb-2">هل أنت مستعد</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              لبدء مشروعك؟
            </span>
          </h2>

          <p className="text-xl lg:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            تواصل معنا الآن واحصل على استشارة مجانية لمناقشة مشروعك وكيف يمكننا مساعدتك في تحقيق أهدافك
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl hover:bg-white/20 transition-all duration-500 hover:-translate-y-2">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <CardContent className="relative z-10 p-6 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                  {method.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {method.description}
                </p>

                {/* Value */}
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-cyan-300 font-medium text-sm">{method.value}</p>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-white/30 text-white hover:bg-white/10 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 rounded-full backdrop-blur-sm"
                >
                  {method.action}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </CardContent>

              {/* Floating Icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </Card>
          ))}
        </div>

        {/* Office Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {officeInfo.map((info, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <info.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
              <p className="text-gray-300 font-medium mb-1">{info.value}</p>
              <p className="text-gray-400 text-sm">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              ضماناتنا لك
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              نلتزم بتقديم أفضل خدمة وأسرع استجابة لجميع عملائنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <guarantee.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{guarantee.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Contact Form */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              أرسل رسالة سريعة
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              املأ النموذج وسنتواصل معك خلال ساعة واحدة
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input 
                type="text" 
                placeholder="الاسم الكامل"
                className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني"
                className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <input 
              type="tel" 
              placeholder="رقم الهاتف"
              className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6"
            />
            <textarea 
              placeholder="اكتب رسالتك هنا..."
              rows={4}
              className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6 resize-none"
            ></textarea>
            <Button size="lg" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
              <MessageSquare className="ml-2 h-5 w-5" />
              إرسال الرسالة
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-6 border border-white/20">
            <Rocket className="w-4 h-4 ml-2 text-yellow-400" />
            ابدأ رحلتك التقنية الآن
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            دعنا نحول أفكارك إلى واقع
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            فريقنا جاهز لمساعدتك في بناء مستقبل رقمي مميز لأعمالك
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                <Calendar className="ml-2 h-5 w-5" />
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
                استكشف خدماتنا
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 