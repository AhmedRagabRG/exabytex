"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Phone,
  ArrowRight,
  Brain,
  Sparkles,
  Zap,
  Bot,
  Rocket,
  Shield,
  Users,
  Clock,
  Star
} from "lucide-react"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError('يجب الموافقة على شروط الخدمة')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      } else {
        setError(data.error || 'حدث خطأ أثناء إنشاء الحساب')
      }
    } catch (error) {
      setError('حدث خطأ في الخادم. حاول مرة أخرى.' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    // Clear errors when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const benefits = [
    { icon: Brain, text: "الوصول لجميع منتجات الذكاء الاصطناعي", gradient: "from-blue-500 to-cyan-500" },
    { icon: Users, text: "استشارات مجانية مع خبرائنا", gradient: "from-purple-500 to-pink-500" },
    { icon: Clock, text: "دعم فني على مدار الساعة", gradient: "from-green-500 to-emerald-500" },
    { icon: Zap, text: "تحديثات حصرية ومنتجات جديدة", gradient: "from-orange-500 to-red-500" },
    { icon: Shield, text: "مجتمع حصري من رواد الأعمال", gradient: "from-indigo-500 to-purple-500" },
    { icon: Star, text: "خصومات خاصة للأعضاء", gradient: "from-yellow-500 to-orange-500" }
  ]

  const stats = [
    { icon: Users, number: "500+", label: "عميل سعيد", gradient: "from-blue-500 to-cyan-500" },
    { icon: Star, number: "95%", label: "رضا العملاء", gradient: "from-green-500 to-emerald-500" },
    { icon: Clock, number: "24/7", label: "دعم فني", gradient: "from-purple-500 to-pink-500" }
  ]

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
        <Rocket className="h-7 w-7 text-white" />
      </div>

      <div className="max-w-7xl w-full space-y-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Benefits */}
          <div className="hidden lg:flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="text-white w-10 h-10" />
                  </div>
                  {/* Floating sparkles */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                انضم إلى مجتمع
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  الذكاء الاصطناعي
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                ابدأ رحلتك في عالم الذكاء الاصطناعي واحصل على حلول مبتكرة لأعمالك
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <benefit.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors text-lg">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <CardContent className="p-4 text-center relative z-10">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Brain className="text-white w-8 h-8" />
                      </div>
                      {/* Floating sparkles */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-2">
                    <Bot className="h-7 w-7 text-blue-400" />
                    إنشاء حساب جديد
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    أنشئ حسابك واحصل على إمكانية الوصول لجميع منتجاتنا المتطورة
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

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center p-4 text-sm text-red-200 bg-red-500/10 rounded-lg border border-red-500/20 backdrop-blur-sm">
                        <AlertCircle className="w-5 h-5 ml-2 text-red-400" />
                        {error}
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                        الاسم الكامل
                      </label>
                      <div className="relative group">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

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
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pr-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                        رقم الهاتف (اختياري)
                      </label>
                      <div className="relative group">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+201555831761"
                          value={formData.phone}
                          onChange={handleInputChange}
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
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
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
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
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

                    {/* Accept Terms */}
                    <div className="flex items-center">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-400 rounded bg-white/10"
                        required
                      />
                      <label htmlFor="acceptTerms" className="mr-2 block text-sm text-gray-300">
                        أوافق على{" "}
                        <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                          شروط الخدمة
                        </Link>{" "}
                        و{" "}
                        <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                          سياسة الخصوصية
                        </Link>
                      </label>
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
                          جاري إنشاء الحساب...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-5 w-5" />
                          إنشاء الحساب
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
                      التسجيل بجوجل
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
                      التسجيل بالديسكورد
                    </Button>
                  </div>

                  {/* Sign In Link */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-300">
                      لديك حساب بالفعل؟{" "}
                      <Link 
                        href="/auth/signin" 
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        تسجيل الدخول
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 