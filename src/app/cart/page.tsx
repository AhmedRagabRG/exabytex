'use client'

import { useCart } from '@/components/providers/cart-provider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  Brain,
  Sparkles,
  Zap,
  Rocket,
  Shield,
  CreditCard,
  CheckCircle,
  Star,
  Tag,
  Gift
} from 'lucide-react'

interface PromoCode {
  id: string
  code: string
  description: string
  discountType: string
  discountValue: number
}

interface PromoValidation {
  valid: boolean
  promoCode: PromoCode
  discountAmount: number
  finalTotal: number
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  discountedPrice?: number
  hasDiscount?: boolean
  image?: string
  category: string
  features: string[]
  isPopular?: boolean
}

export default function CartPage() {
  const { items, total, isLoading, updateQuantity, removeFromCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoValidation | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return

    setPromoLoading(true)
    setPromoError('')

    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: promoCode.trim(),
          cartTotal: total
        })
      })

      const data = await response.json()

      if (response.ok) {
        setAppliedPromo(data)
        setPromoCode('')
        // إشعار نجاح
        const successDiv = document.createElement('div')
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse'
        successDiv.textContent = `تم تطبيق الكوبون ${data.promoCode.code} بنجاح!`
        document.body.appendChild(successDiv)
        setTimeout(() => successDiv.remove(), 3000)
      } else {
        setPromoError(data.error)
      }
    } catch (error) {
      console.log(error)
      setPromoError('خطأ في تطبيق الكوبون')
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoError('')
  }

  // حساب السعر الصحيح للمنتج (مع أو بدون خصم)
  const getProductPrice = (product: any) => {
    return (product.hasDiscount && product.discountedPrice) 
      ? product.discountedPrice 
      : product.price
  }

  // حساب السعر الأصلي للمنتج
  const getOriginalPrice = (product: any) => {
    return product.price
  }

  // حساب المجموع الصحيح للسلة
  const calculateCartTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (getProductPrice(item.product) * item.quantity)
    }, 0)
  }

  const cartSubtotal = calculateCartTotal()
  const finalTotal = appliedPromo ? appliedPromo.finalTotal : cartSubtotal

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-300 text-lg">جاري تحميل سلة التسوق الذكية...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-16">
            <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <CardContent className="p-12 relative z-10">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <ShoppingBag className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  سلة التسوق فارغة
                </h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. اكتشف مجموعتنا الرائعة من حلول الذكاء الاصطناعي
                </p>
                <Link href="/store">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <ArrowLeft className="w-5 h-5 ml-2" />
                    تصفح المتجر الذكي
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(itemId, newQuantity)
    // إعادة حساب الكوبون عند تغيير الكمية
    if (appliedPromo) {
      const newTotal = calculateCartTotal()
      try {
        const response = await fetch('/api/promo-codes/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code: appliedPromo.promoCode.code,
            cartTotal: newTotal
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setAppliedPromo(data)
        } else {
          setAppliedPromo(null)
        }
      } catch (error) {
        console.log(error)
        setAppliedPromo(null)
      }
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId)
    // إعادة حساب الكوبون عند حذف عنصر
    if (appliedPromo && items.length > 1) {
      setTimeout(async () => {
        const newTotal = calculateCartTotal()
        try {
          const response = await fetch('/api/promo-codes/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              code: appliedPromo.promoCode.code,
              cartTotal: newTotal
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            setAppliedPromo(data)
          } else {
            setAppliedPromo(null)
          }
        } catch (error) {
          console.log(error)
          setAppliedPromo(null)
        }
      }, 100)
    } else if (items.length === 1) {
      setAppliedPromo(null)
    }
  }

  const benefits = [
    { icon: Shield, text: "حماية متقدمة للبيانات", gradient: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "معالجة فورية بالذكاء الاصطناعي", gradient: "from-yellow-500 to-orange-500" },
    { icon: CheckCircle, text: "ضمان الجودة 100%", gradient: "from-green-500 to-emerald-500" },
    { icon: Star, text: "دعم فني على مدار الساعة", gradient: "from-purple-500 to-pink-500" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/store">
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-all duration-300 mb-6">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى المتجر
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">سلة التسوق الذكية</h1>
              <p className="text-gray-300 text-lg">
                لديك {items.length} {items.length === 1 ? 'منتج' : 'منتجات'} من حلول الذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => {
              const productPrice = getProductPrice(item.product)
              const originalPrice = getOriginalPrice(item.product)
              const hasDiscount = (item.product as any).hasDiscount && (item.product as any).discountedPrice
              
              return (
                <Card key={item.id} className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              width={96}
                              height={96}
                              className="rounded-xl object-cover w-full h-full"
                            />
                          ) : (
                            <Brain className="w-12 h-12 text-white" />
                          )}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {item.product.title}
                        </h3>
                        <p className="text-gray-300 mb-3 text-sm line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">(4.9)</span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                            {item.product.category}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-sm text-gray-300 font-medium">الكمية:</span>
                          <div className="flex items-center bg-white/10 rounded-lg backdrop-blur-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="text-gray-300 hover:text-white hover:bg-white/20 rounded-r-none"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2 text-white font-bold min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="text-gray-300 hover:text-white hover:bg-white/20 rounded-l-none"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-center">
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                              <Tag className="h-3 w-3" />
                              خصم خاص
                            </span>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          {hasDiscount ? (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-400 line-through flex items-center justify-center gap-1">
                                <span className="text-xs">الأصلي:</span>
                                {(originalPrice * item.quantity).toLocaleString('ar-SA')} ر.س
                              </p>
                              <p className="text-2xl font-bold text-green-400">
                                {(productPrice * item.quantity).toLocaleString('ar-SA')} ر.س
                              </p>
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                  وفر {(((originalPrice - productPrice) / originalPrice) * 100).toFixed(0)}%
                                </span>
                                <span className="text-xs text-gray-400">
                                  مدخرات: {((originalPrice - productPrice) * item.quantity).toLocaleString('ar-SA')} ر.س
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {(productPrice * item.quantity).toLocaleString('ar-SA')} ر.س
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Benefits Section */}
            <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <CardContent className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  مميزات حصرية مع كل شراء
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${benefit.gradient} flex items-center justify-center`}>
                        <benefit.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <CardContent className="p-6 relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-blue-400" />
                  ملخص الطلب
                </h2>

                {/* Promo Code Section */}
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-bold text-purple-400">كوبون الخصم</span>
                  </div>
                  
                  {!appliedPromo ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="أدخل رمز الكوبون"
                          className="flex-1 bg-slate-800/80 border border-purple-400/30 rounded-lg px-3 py-2 text-white placeholder-white/60 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                          disabled={promoLoading}
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={promoLoading || !promoCode.trim()}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm"
                        >
                          {promoLoading ? 'جاري...' : 'تطبيق'}
                        </Button>
                      </div>
                      {promoError && (
                        <p className="text-xs text-red-400">{promoError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-bold text-green-400">
                            {appliedPromo.promoCode.code}
                          </span>
                        </div>
                        <Button
                          onClick={removePromoCode}
                          variant="ghost"
                          size="sm"
                          aria-label="إزالة كود الخصم"
                          className="text-red-400 hover:text-red-300 p-1 h-auto"
                        >
                          ✕
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">{appliedPromo.promoCode.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/5">
                    <span className="text-gray-300">المجموع الفرعي:</span>
                    <span className="font-bold text-white">{cartSubtotal.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="text-gray-300">خصم الكوبون:</span>
                      <span className="font-bold text-green-400">-{appliedPromo.discountAmount.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-gray-300">الشحن:</span>
                    <span className="font-bold text-green-400">مجاني</span>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                      <span className="text-lg font-bold text-white">المجموع الكلي:</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {finalTotal.toLocaleString('ar-SA')} ر.س
                      </span>
                    </div>
                  </div>

                  {appliedPromo && (
                    <div className="text-center text-sm text-green-400 font-medium">
                      🎉 وفرت {appliedPromo.discountAmount.toLocaleString('ar-SA')} ر.س من هذا الطلب!
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                      <CheckCircle className="w-5 h-5 ml-2" />
                      إتمام الشراء الآن
                    </Button>
                  </Link>

                  <Link href="/store">
                    <Button variant="outline" className="w-full border-white/30 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300">
                      <ArrowLeft className="w-4 h-4 ml-2" />
                      متابعة التسوق الذكي
                    </Button>
                  </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-bold text-green-400">دفع آمن 100%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    جميع المعاملات محمية بتقنيات التشفير المتقدمة
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 