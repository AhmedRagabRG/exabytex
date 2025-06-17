"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowRight, CheckCircle, Brain, Sparkles, Bot, Shield, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني')
        
        // في بيئة التطوير، عرض الرابط للاختبار
        if (data.resetUrl) {
          console.log('🔗 Reset URL for testing:', data.resetUrl)
          setSuccess(prev => `${prev}

📧 ملاحظة للمطور: 
تم إنشاء رابط الاستعادة بنجاح. تحقق من Developer Console (F12) للحصول على الرابط المباشر للاختبار.

🔗 رابط الاستعادة: ${data.resetUrl}`)
        }
      } else {
        setSuccess(data.error || 'حدث خطأ أثناء إرسال البريد الإلكتروني')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setSuccess('حدث خطأ في الخادم. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center animate-bounce opacity-30">
        <Brain className="h-8 w-8 text-white" />
      </div>
      <div className="absolute top-40 left-10 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse opacity-30">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div className="absolute bottom-20 right-20 w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce delay-500 opacity-30">
        <Shield className="h-7 w-7 text-white" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="text-white w-8 h-8" />
              </div>
              {/* Floating sparkles */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Exa ByteX
              </span>
              <span className="text-sm text-gray-400 font-medium">
                مستقبل الذكاء الاصطناعي
              </span>
            </div>
          </Link>
          
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">
              استعادة كلمة المرور
            </h2>
            <p className="text-lg text-gray-300">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
          </div>
        </div>

        {/* Reset Password Form */}
        <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-blue-400" />
                نسيت كلمة المرور؟
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                لا تقلق، يحدث هذا لأفضلنا. أدخل بريدك الإلكتروني أدناه
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Message */}
                {success && (
                  <div className="flex items-center p-4 text-sm text-green-200 bg-green-500/10 rounded-lg border border-green-500/20 backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 ml-2 text-green-400" />
                    {success}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative group">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      إرسال رابط الاستعادة
                    </div>
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-medium text-sm">نصيحة</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    تحقق من مجلد الرسائل المهملة إذا لم تجد البريد الإلكتروني في صندوق الوارد
                  </p>
                </div>
              </div>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>

              {/* Sign Up Link */}
              <div className="mt-4 text-center">
                <p className="text-gray-300 text-sm">
                  ليس لديك حساب؟{" "}
                  <Link 
                    href="/auth/signup" 
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    أنشئ حساباً جديداً
                  </Link>
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            احتجت مساعدة؟{" "}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
              تواصل معنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 