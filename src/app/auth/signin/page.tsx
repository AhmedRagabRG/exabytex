"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, Brain, Sparkles, Zap, Bot, ArrowRight, AlertCircle } from "lucide-react"
import Image from 'next/image';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        console.log('Sign in error:', result.error)
        setError('بريد إلكتروني أو كلمة مرور خاطئة')
      } else if (result?.ok) {
        console.log('Sign in success')
        // Success - redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        // Fallback: check if authentication actually worked
        const session = await getSession()
        if (session?.user) {
          console.log('Authentication successful via session check')
          window.location.href = '/dashboard'
        } else {
          console.log('Authentication failed')
          setError('بريد إلكتروني أو كلمة مرور خاطئة')
        }
      }
    } catch (error) {
      console.error('Server error:', error)
      setError('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
        <Zap className="h-7 w-7 text-white" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Image 
                    src="/logo.svg"
                    alt="logo"
                    width='9'
                    height='9'
                    className='text-white transition-all duration-500 w-9 h-9'
                />
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
              مرحباً بك مرة أخرى
            </h2>
            <p className="text-lg text-gray-300">
              أدخل بياناتك للوصول إلى لوحة التحكم المتطورة
            </p>
          </div>
        </div>

        {/* Sign In Form */}
        <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Bot className="h-6 w-6 text-blue-400" />
                تسجيل الدخول
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                ادخل إلى عالم الذكاء الاصطناعي المتقدم
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="flex items-center p-4 text-sm text-red-200 bg-red-500/10 rounded-lg border border-red-500/20 backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 ml-2 text-red-400" />
                    {error}
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative group">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pr-10 pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-400 rounded bg-white/10"
                    />
                    <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-300">
                      تذكرني
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
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
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      تسجيل الدخول
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/10 text-gray-300 backdrop-blur-sm rounded-full">أو</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-6 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" 
                  size="lg"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  الدخول بجوجل
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-indigo-600/20 border-indigo-500/30 text-white hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-all duration-300" 
                  size="lg"
                  onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  الدخول بالديسكورد
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-300">
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
            بتسجيل الدخول، أنت توافق على{" "}
            <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300 transition-colors">
              شروط الاستخدام
            </Link>{" "}
            و{" "}
            <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 transition-colors">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 