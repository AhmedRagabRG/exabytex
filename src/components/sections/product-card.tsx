import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Eye, CheckCircle, Sparkles, Zap, Bot, Rocket, Tag } from "lucide-react"
import { Product } from "@/types"
import Link from "next/link"
import { useCart } from "@/components/providers/cart-provider"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Image from 'next/image'
import { PriceDisplay, DiscountPrice } from '@/components/ui/PriceDisplay'

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart()
  const { data: session } = useSession()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin'
      return
    }

    setIsAdding(true)
    try {
      await addToCart(product.id)
      setIsAdded(true)
      
      // إعادة تعيين الحالة بعد 3 ثوان
      setTimeout(() => {
        setIsAdded(false)
      }, 3000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      // في حالة الخطأ، إعادة تعيين فوري
      setIsAdded(false)
    } finally {
      setIsAdding(false)
    }
  }

  // استمع للـ events من CartProvider
  useEffect(() => {
    const handleSuccess = (event: any) => {
      // إشعار نجاح باستخدام native notification
      if (typeof window !== 'undefined') {
        const successDiv = document.createElement('div')
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse'
        successDiv.textContent = `تم إضافة "${product.title}" للسلة بنجاح!`
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          successDiv.remove()
        }, 3000)
      }
    }

    const handleError = (event: any) => {
      // إشعار خطأ
      if (typeof window !== 'undefined') {
        const errorDiv = document.createElement('div')
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        errorDiv.textContent = event.detail.message || 'خطأ في إضافة المنتج للسلة'
        document.body.appendChild(errorDiv)
        
        setTimeout(() => {
          errorDiv.remove()
        }, 4000)
      }
    }

    window.addEventListener('addToCartSuccess', handleSuccess)
    window.addEventListener('addToCartError', handleError)

    return () => {
      window.removeEventListener('addToCartSuccess', handleSuccess)
      window.removeEventListener('addToCartError', handleError)
    }
  }, [product.title])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "الأتمتة والتكامل":
        return Zap
      case "روبوتات المحادثة":
        return Bot
      case "التسويق الرقمي":
        return Rocket
      default:
        return Sparkles
    }
  }

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "الأتمتة والتكامل":
        return "from-blue-500 to-cyan-500"
      case "روبوتات المحادثة":
        return "from-purple-500 to-pink-500"
      case "التسويق الرقمي":
        return "from-green-500 to-emerald-500"
      default:
        return "from-orange-500 to-red-500"
    }
  }

  const CategoryIcon = getCategoryIcon(product.category)
  const categoryGradient = getCategoryGradient(product.category)

  // حساب نسبة الخصم
  const discountPercentage = product.hasDiscount && product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0

  if (viewMode === "list") {
    return (
      <Card className="group border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative z-10 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Image */}
            <div className="relative w-full lg:w-48 h-32 bg-gradient-to-br from-slate-800/50 to-purple-800/50 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${categoryGradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <CategoryIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Popular Badge */}
              {product.isPopular && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white fill-current" />
                </div>
              )}

              {/* Discount Badge */}
              {product.hasDiscount && discountPercentage > 0 && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {discountPercentage}% خصم
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <Badge 
                  variant="outline" 
                  className="border-white/30 text-white bg-white/10"
                >
                  {product.category}
                </Badge>
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">
                    {(product.averageRating && product.averageRating > 0) ? product.averageRating : 'جديد'}
                  </span>
                  {(product.reviewCount && product.reviewCount > 0) && (
                    <span className="text-gray-400 text-xs">({product.reviewCount})</span>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {product.title}
              </h3>
              
              <p className="text-gray-300 mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {product.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-300">
                    <div className={`w-2 h-2 bg-gradient-to-r ${categoryGradient} rounded-full ml-2 flex-shrink-0`}></div>
                    {feature}
                  </div>
                ))}
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  {product.hasDiscount && product.discountedPrice ? (
                    <DiscountPrice 
                      amount={product.discountedPrice}
                      originalAmount={product.price}
                      showSavings={true}
                    />
                  ) : (
                    <div>
                      <PriceDisplay amount={product.price} size="md" />
                      <div className="text-sm text-gray-400">شامل الضريبة</div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Link href={`/store/${product.id}`} aria-label={`تفاصيل المنتج: ${product.title}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/20"
                    >
                      <Eye className="h-4 w-4 ml-2" />
                      التفاصيل
                    </Button>
                  </Link>
                  
                  <Button 
                    size="sm" 
                    className={`bg-gradient-to-r ${categoryGradient} hover:opacity-90 transition-opacity`}
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded}
                  >
                    {isAdding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري...
                      </>
                    ) : isAdded ? (
                      <>
                        <CheckCircle className="h-4 w-4 ml-2" />
                        تمت
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-800/50 to-purple-800/50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-20 h-20 bg-gradient-to-r ${categoryGradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
            <CategoryIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        
        {/* Popular Badge */}
        {product.isPopular && (
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <Star className="h-6 w-6 text-white fill-current" />
          </div>
        )}

        {/* Discount Badge */}
        {product.hasDiscount && discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 animate-pulse shadow-lg">
            <Tag className="h-4 w-4" />
            {discountPercentage}% خصم
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link href={`/store/${product.id}`} aria-label={`تفاصيل المنتج: ${product.title}`}>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
            >
              <Eye className="h-4 w-4 ml-2" />
              عرض التفاصيل
            </Button>
          </Link>
        </div>

        {/* Floating sparkles */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-3">
            <Badge 
              variant="outline" 
              className="border-white/30 text-white bg-white/10"
            >
              {product.category}
            </Badge>
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm">
                {(product.averageRating && product.averageRating > 0) ? product.averageRating : 'جديد'}
              </span>
              {(product.reviewCount && product.reviewCount > 0) && (
                <span className="text-gray-400 text-xs">({product.reviewCount})</span>
              )}
            </div>
          </div>
          
          <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {product.title}
          </CardTitle>
          
          <CardDescription className="line-clamp-3 text-gray-300">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Features */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">المميزات الرئيسية:</h4>
            <ul className="space-y-2">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-300">
                  <div className={`w-2 h-2 bg-gradient-to-r ${categoryGradient} rounded-full ml-2 flex-shrink-0`}></div>
                  {feature}
                </li>
              ))}
              {product.features.length > 3 && (
                <li className="text-sm text-blue-400 font-medium">
                  +{product.features.length - 3} مميزات أخرى
                </li>
              )}
            </ul>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div>
              {product.hasDiscount && product.discountedPrice ? (
                <DiscountPrice 
                  amount={product.discountedPrice}
                  originalAmount={product.price}
                  showSavings={true}
                />
              ) : (
                <div>
                  <PriceDisplay amount={product.price} size="md" />
                  <div className="text-sm text-gray-400">شامل الضريبة</div>
                </div>
              )}
            </div>
            
            <Button 
              size="sm" 
              className={`bg-gradient-to-r ${categoryGradient} hover:opacity-90 transition-opacity shadow-lg`}
              onClick={handleAddToCart}
              disabled={isAdding || isAdded}
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الإضافة...
                </>
              ) : isAdded ? (
                <>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  تمت الإضافة
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  أضف للسلة
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
} 