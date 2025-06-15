import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Search, 
  ArrowLeft, 
  AlertTriangle,
  Sparkles,
  Zap,
  Brain,
  Rocket
} from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center animate-bounce">
        <Brain className="h-8 w-8 text-white" />
      </div>
      <div className="absolute top-40 left-10 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div className="absolute bottom-40 right-20 w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce delay-500">
        <Zap className="h-7 w-7 text-white" />
      </div>
      <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse delay-1500">
        <Rocket className="h-5 w-5 text-white" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Number with Gradient */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
          </div>

          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              عذراً، الصفحة غير موجودة
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
              يبدو أن الصفحة التي تبحث عنها قد انتقلت إلى مكان آخر أو لم تعد موجودة
            </p>
            <p className="text-lg text-gray-400">
              لا تقلق، يمكنك العودة إلى الصفحة الرئيسية أو استخدام البحث للعثور على ما تريد
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
              >
                <Home className="h-5 w-5" />
                العودة للرئيسية
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
              >
                <Search className="h-5 w-5" />
                تواصل معنا
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link href="/" className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">الصفحة الرئيسية</h3>
                <p className="text-gray-300 text-sm">اكتشف خدماتنا وحلولنا المتقدمة</p>
              </div>
            </Link>

            <Link href="/store" className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">المتجر</h3>
                <p className="text-gray-300 text-sm">تصفح منتجاتنا وخدماتنا الرقمية</p>
              </div>
            </Link>

            <Link href="/contact" className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">اتصل بنا</h3>
                <p className="text-gray-300 text-sm">نحن هنا لمساعدتك في أي وقت</p>
              </div>
            </Link>
          </div>

          {/* Fun Message */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10 backdrop-blur-md max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              هل تعلم؟
            </h4>
            <p className="text-gray-300 leading-relaxed">
              نحن في <span className="text-blue-400 font-semibold">Exa Bytex</span> نعمل باستمرار على تطوير موقعنا وإضافة صفحات جديدة. 
              إذا كنت تبحث عن شيء محدد، تواصل معنا وسنساعدك في العثور عليه!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 