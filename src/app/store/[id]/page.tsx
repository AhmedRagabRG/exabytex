import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Check, 
  Download,
  Shield,
  Users,
  HeadphonesIcon,
  Brain,
  Sparkles,
  Zap,
  Rocket,
  ArrowLeft,
  Clock,
  Award,
  TrendingUp,
  Tag
} from "lucide-react"
import { ProductImage } from "./components/ProductImage"
import { AddToCartButton } from "./components/AddToCartButton"
import { SimpleActionButtons } from "./components/SimpleActionButtons"
import { ProductReviewsSection } from "./components/ProductReviewsSection"
import { PriceDisplay, DiscountPrice } from '@/components/ui/PriceDisplay'

// Product interface
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  hasDiscount?: boolean;
  image?: string;
  category: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {}
  }

  return {
    title: `${product.title} - Exa Bytex Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      type: "website",
      images: product.image ? [product.image] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  const benefits = [
    {
      icon: Shield,
      title: "ضمان الجودة",
      description: "ضمان استرداد لمدة 30 يوم",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: HeadphonesIcon,
      title: "دعم فني",
      description: "دعم على مدار الساعة",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Download,
      title: "تحديثات مجانية",
      description: "تحديثات مدى الحياة",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "مجتمع المستخدمين",
      description: "الوصول لمجتمع حصري",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { icon: Users, number: "1000+", label: "عميل راضي", gradient: "from-blue-500 to-cyan-500" },
    { icon: Award, number: "98%", label: "معدل الرضا", gradient: "from-green-500 to-emerald-500" },
    { icon: TrendingUp, number: "300%", label: "زيادة الإنتاجية", gradient: "from-purple-500 to-pink-500" },
    { icon: Clock, number: "24/7", label: "دعم فني", gradient: "from-orange-500 to-red-500" }
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/store">
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-all duration-300">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى المتجر
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div>
            <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
                  <ProductImage 
                    src={product.image} 
                    alt={product.title}
                    title={product.title}
                  />
                  
                  {product.isPopular && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg animate-pulse">
                      <Star className="w-3 h-3 ml-1" />
                      الأكثر مبيعاً
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Product Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <CardContent className="p-4 text-center relative z-10">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 backdrop-blur-sm">
                {product.category}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {product.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                {product.hasDiscount && product.discountedPrice ? (
                  <div className="space-y-4">
                    <DiscountPrice 
                      amount={product.discountedPrice}
                      originalAmount={product.price}
                      showSavings={true}
                      className="space-y-3"
                    />
                    
                    {/* Savings Highlight */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-400">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-bold">
                          توفير فوري من السعر الأصلي!
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <PriceDisplay 
                      amount={product.price} 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    />
                  </div>
                )}
                <p className="text-gray-400 mt-2">شامل جميع التحديثات والدعم الفني</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <AddToCartButton 
                  productId={product.id}
                  productTitle={product.title}
                />
                <SimpleActionButtons 
                  productId={product.id}
                  productTitle={product.title}
                  productUrl={`/store/${product.id}`}
                />
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${benefit.gradient} flex items-center justify-center`}>
                      <benefit.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{benefit.title}</div>
                      <div className="text-gray-400 text-xs">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-blue-400" />
                المميزات الذكية
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                اكتشف القوة الحقيقية للذكاء الاصطناعي في تطوير أعمالك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Reviews Section */}
        <ProductReviewsSection productId={id} productTitle={product.title} />
      </div>
    </div>
  )
} 