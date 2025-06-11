import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Sparkles, Zap, MessageSquare, Brain, Rocket, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300 mb-8 border border-white/20">
            <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
            مستقبل الأعمال الرقمية
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white mb-2">نحول أعمالك إلى</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              قوة رقمية خارقة
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            نقدم حلول الأتمتة والتكامل، روبوتات المحادثة الذكية، والتسويق الرقمي المتقدم 
            <br className="hidden lg:block" />
            لتحويل أعمالك نحو المستقبل
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/store">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                <Rocket className="ml-2 h-5 w-5" />
                ابدأ رحلتك الرقمية
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm"
              >
                <MessageSquare className="ml-2 h-5 w-5" />
                اقرأ المدونة
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm"
              >
                <Play className="ml-2 h-5 w-5" />
                شاهد كيف نعمل
              </Button>
            </Link>
          </div>

          {/* Services Icons */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white mb-2">الأتمتة والتكامل</h3>
                <p className="text-gray-300 text-sm">ربط وأتمتة جميع أنظمة العمل</p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white mb-2">روبوتات المحادثة</h3>
                <p className="text-gray-300 text-sm">خدمة عملاء ذكية 24/7</p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white mb-2">التسويق الرقمي</h3>
                <p className="text-gray-300 text-sm">استراتيجيات تسويقية متقدمة</p>
              </div>
            </div>
          </div> */}

          {/* Technologies Section */}
          <div className="mb-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-8 text-center">
              التقنيات والأدوات التي نستخدمها
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* n8n */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">n8n</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Workflow Automation</p>
                </div>
              </div>

              {/* Python */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">PY</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Python</p>
                </div>
              </div>

              {/* Make (Integromat) */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">Make</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Automation Platform</p>
                </div>
              </div>

              {/* Zapier */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-300 text-xs text-center">Zapier</p>
                </div>
              </div>

              {/* OpenAI */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-300 text-xs text-center">OpenAI API</p>
                </div>
              </div>

              {/* Node.js */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-lime-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">JS</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Node.js</p>
                </div>
              </div>
            </div>

            {/* Additional Tech Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6 max-w-4xl mx-auto">
              {/* Google Apps Script */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xs">GAS</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Google Apps Script</p>
                </div>
              </div>

              {/* API Integration */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xs">API</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">API Integration</p>
                </div>
              </div>

              {/* Webhooks */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-300 text-xs text-center">Webhooks</p>
                </div>
              </div>

              {/* Database */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xs">DB</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Database Systems</p>
                </div>
              </div>

              {/* Cloud Services */}
              <div className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xs">☁️</span>
                  </div>
                  <p className="text-gray-300 text-xs text-center">Cloud Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Elements */}
      <div className="absolute top-1/4 right-8 animate-bounce delay-1000">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-1/4 left-8 animate-bounce delay-2000">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
          <Star className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute top-1/2 right-1/4 animate-pulse">
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
      </div>
    </section>
  )
} 