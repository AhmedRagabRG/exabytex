"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/sections/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Grid, List, Sparkles, Brain, Bot, Rocket, TrendingUp, ShoppingCart, Users, Award, Shield } from "lucide-react"
import { Product } from "@/types"
import Link from "next/link"

const defaultCategories = [
  "جميع الفئات",
  "أدوات الذكاء الاصطناعي",
  "الاستشارات",
  "التدريب",
  "التطوير"
]

export default function StorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // جلب المنتجات من قاعدة البيانات
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        
        // استخراج فئات المنتجات الفريدة
        const uniqueCategories = Array.from(new Set(data.map((product: Product) => product.category))) as string[]
        setCategories(["جميع الفئات", ...uniqueCategories])
      } else {
        throw new Error('فشل في جلب المنتجات')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('حدث خطأ في جلب المنتجات')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "جميع الفئات" || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mb-6"></div>
          <div className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-purple-400 animate-pulse" />
            جاري تحميل المنتجات...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Button onClick={fetchProducts} className="bg-purple-600 hover:bg-purple-700">
            المحاولة مرة أخرى
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold mb-6">
            <ShoppingCart className="h-4 w-4 text-blue-400" />
            متجر الحلول الذكية
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            حلولنا الرقمية
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              لمستقبل أعمالك
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            اكتشف حلول الذكاء الاصطناعي المتطورة والحلول الرقمية المبتكرة لتطوير أعمالك
          </p>

          {/* Floating Elements */}
          <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <div className="absolute top-40 left-10 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, number: "500+", label: "عميل راضي", color: "from-blue-500 to-cyan-500" },
            { icon: Award, number: "98%", label: "معدل النجاح", color: "from-purple-500 to-pink-500" },
            { icon: Shield, number: "100%", label: "أمان مضمون", color: "from-green-500 to-emerald-500" },
            { icon: TrendingUp, number: "24/7", label: "دعم فني", color: "from-orange-500 to-red-500" }
          ].map((stat, index) => (
            <Card key={index} className="group border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-12 border-0 bg-white/10 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="ابحث عن المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 pl-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl"
                />
              </div>

              {/* Category Filter */}
              <div className="relative w-full lg:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white/10 border border-white/20 text-white rounded-xl px-6 py-3 pr-12 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 min-w-[200px]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-slate-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-10 px-4 ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-10 px-4 ${viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-white/10"}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategory === "جميع الفئات" ? "جميع المنتجات" : selectedCategory}
              </h2>
              <p className="text-gray-300">
                {filteredProducts.length} منتج متاح
              </p>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-300">لا توجد منتجات</h3>
              <p className="text-gray-400 mb-6">لم نعثر على منتجات تطابق بحثك</p>
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("جميع الفئات")
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                مسح البحث
              </Button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <Card className="border-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold mb-6">
                <Bot className="h-4 w-4 text-blue-400" />
                هل تحتاج لحل مخصص؟
              </div>
              <h2 className="text-4xl font-bold mb-4">
                احصل على استشارة مجانية
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                فريقنا من الخبراء جاهز لمساعدتك في إيجاد الحل المثالي لاحتياجاتك التقنية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                    احجز استشارة مجانية
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                    تواصل معنا
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 