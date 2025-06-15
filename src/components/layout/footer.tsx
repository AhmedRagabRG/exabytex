import Link from "next/link"
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Brain,
  Zap,
  Bot,
  Rocket,
  Globe,
  BarChart3,
  Star,
  ArrowRight,
  Heart,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const quickLinks = [
    { name: "الرئيسية", href: "/", icon: Globe, gradient: "from-blue-500 to-cyan-500" },
    { name: "الخدمات", href: "#services", icon: Zap, gradient: "from-purple-500 to-pink-500" },
    { name: "المتجر", href: "/store", icon: Rocket, gradient: "from-green-500 to-emerald-500" },
    { name: "المدونة", href: "/blog", icon: Brain, gradient: "from-orange-500 to-red-500" },
    { name: "اتصل بنا", href: "/contact", icon: Bot, gradient: "from-indigo-500 to-purple-500" },
  ]

  const services = [
    { name: "الأتمتة والتكامل", icon: Zap, gradient: "from-blue-500 to-cyan-500" },
    { name: "روبوتات المحادثة", icon: Bot, gradient: "from-purple-500 to-pink-500" },
    { name: "التسويق الرقمي", icon: BarChart3, gradient: "from-green-500 to-emerald-500" },
  ]



  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/exabytex", gradient: "from-blue-600 to-blue-500" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/exabytex.ai/", gradient: "from-pink-500 to-purple-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/exabytex", gradient: "from-blue-700 to-blue-600" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Top Section */}
      <div className="relative">
        {/* Newsletter Section */}
        {/* <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold mb-4">
                <Sparkles className="h-4 w-4 text-blue-400" />
                ابق على اطلاع
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                احصل على آخر التطورات في 
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  الذكاء الاصطناعي
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                اشترك في نشرتنا الإخبارية للحصول على أحدث الأخبار والتطورات
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <Input 
                    type="email" 
                    placeholder="أدخل بريدك الإلكتروني"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 h-12"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 h-12 font-semibold">
                  <Send className="w-4 h-4 ml-2" />
                  اشتراك
                </Button>
              </div>
            </div>

            
          </div>
        </div> */}

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="text-white w-7 h-7" />
                  </div>
                  {/* Floating sparkles */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Exa Bytex
                  </span>
                  <span className="text-sm text-gray-400 font-medium">
                    مستقبل الذكاء الاصطناعي
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-lg leading-relaxed">
                نقدم حلول الأتمتة والتكامل، روبوتات المحادثة الذكية، والتسويق الرقمي المتقدم لتحويل أعمالك نحو المستقبل الرقمي المتطور.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">info@exabytex.com</span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">201555831761+</span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">الجيزة، الشيخ زايد</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 rtl:space-x-reverse">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    target="_blank"
                    className="group relative"
                    aria-label={social.name}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${social.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <social.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-400" />
                روابط سريعة
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/5"
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${link.gradient} flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}>
                        <link.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="flex-1">{link.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-400" />
                خدماتنا
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <div className="group flex items-center gap-3 text-gray-300 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-300">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="group-hover:text-white transition-colors">{service.name}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-8">
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <Bot className="w-4 h-4 ml-2" />
                    ابدأ مشروعك الآن
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <span>© 2025 Exa Bytex. جميع الحقوق محفوظة.</span>
                <span className="text-red-400">
                  صُنع بـ <Heart className="w-4 h-4 inline text-red-500" /> في exabytex
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
                <Link href="/refund-policy" className="hover:text-white transition-colors">سياسة الاسترداد</Link>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">شروط الاستخدام</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 