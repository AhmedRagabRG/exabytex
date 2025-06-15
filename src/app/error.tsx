'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  AlertCircle,
  Sparkles,
  Zap,
  Bug,
  Settings
} from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
        <Bug className="h-8 w-8 text-white" />
      </div>
      <div className="absolute top-40 left-10 w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center animate-pulse">
        <Settings className="h-6 w-6 text-white" />
      </div>
      <div className="absolute bottom-40 right-20 w-14 h-14 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center animate-bounce delay-500">
        <Zap className="h-7 w-7 text-white" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              عذراً، حدث خطأ!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
              حدث خطأ غير متوقع أثناء تحميل هذه الصفحة
            </p>
            <p className="text-lg text-gray-400 mb-6">
              لا تقلق، هذا الأمر نادر الحدوث وفريقنا يعمل على حل المشكلة
            </p>
            
            {/* Error Details (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-red-400 font-semibold mb-2">تفاصيل الخطأ (Development Mode):</h3>
                <code className="text-red-300 text-sm break-all">
                  {error.message}
                </code>
                {error.digest && (
                  <p className="text-red-400 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={reset}
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="h-5 w-5" />
              حاول مرة أخرى
            </Button>

            <Link href="/">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
              >
                <Home className="h-5 w-5" />
                العودة للرئيسية
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <button 
              onClick={() => window.location.reload()}
              className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">إعادة تحميل الصفحة</h3>
              <p className="text-gray-300 text-sm">قد يحل هذا المشكلة بشكل مؤقت</p>
            </button>

            <Link href="/contact" className="group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">أبلغ عن المشكلة</h3>
                <p className="text-gray-300 text-sm">تواصل معنا لحل المشكلة</p>
              </div>
            </Link>
          </div>

          {/* Support Message */}
          <div className="p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl border border-white/10 backdrop-blur-md max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              نحن نهتم بتجربتك
            </h4>
            <p className="text-gray-300 leading-relaxed">
              إذا استمر ظهور هذا الخطأ، يرجى التواصل معنا على{' '}
              <span className="text-blue-400 font-semibold">info@exabytex.com</span>{' '}
              أو عبر واتساب <span className="text-green-400 font-semibold">201555831761+</span>.
              فريقنا التقني جاهز لمساعدتك على مدار الساعة.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 