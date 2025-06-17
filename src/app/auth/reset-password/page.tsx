"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowRight, CheckCircle, Brain, Sparkles, Shield, ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!token) {
      setError('رابط استعادة كلمة المرور غير صحيح')
      setIsValidating(false)
      return
    }

    // التحقق من صحة الـ token
    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setIsValidToken(true)
      } else {
        setError(data.error || 'رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية')
      }
    } catch (error) {
      setError('حدث خطأ في التحقق من الرابط')
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.password || !formData.confirmPassword) {
      setError('جميع الحقول مطلوبة')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين')
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password: formData.password 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم تغيير كلمة المرور بنجاح!')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      } else {
        setError(data.error || 'حدث خطأ أثناء تغيير كلمة المرور')
      }
    } catch (error) {
      setError('حدث خطأ في الخادم. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white">جاري التحقق من الرابط...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">رابط غير صحيح</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <Link 
                href="/auth/forgot-password"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                طلب رابط جديد
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Brain className="text-white w-8 h-8" />
              </div>
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
              إعادة تعيين كلمة المرور
            </h2>
            <p className="text-lg text-gray-300">
              أدخل كلمة المرور الجديدة الخاصة بك
            </p>
          </div>
        </div>

        {/* Reset Password Form */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Lock className="h-6 w-6 text-blue-400" />
                كلمة مرور جديدة
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                اختر كلمة مرور قوية وآمنة لحسابك
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Message */}
                {success && (
                  <div className="flex items-center p-4 text-sm text-green-200 bg-green-500/10 rounded-lg border border-green-500/20 backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 ml-2 text-green-400" />
                    {success}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center p-4 text-sm text-red-200 bg-red-500/10 rounded-lg border border-red-500/20 backdrop-blur-sm">
                    <AlertTriangle className="w-5 h-5 ml-2 text-red-400" />
                    {error}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    كلمة المرور الجديدة
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative group">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pr-10 pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg" 
                  size="lg"
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري التحديث...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      تحديث كلمة المرور
                    </div>
                  )}
                </Button>
              </form>

              {/* Back to Sign In */}
              <div className="text-center">
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white">جاري التحميل...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
} 