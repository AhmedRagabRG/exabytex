import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Tag,
} from "lucide-react"

export function Blog() {
  const blogPosts = [
    {
      title: "مستقبل الذكاء الاصطناعي في الأعمال العربية",
      excerpt: "كيف تغير تقنيات الذكاء الاصطناعي وجه الأعمال في المنطقة العربية وما هي الفرص المتاحة للشركات للاستفادة من هذه التقنيات المتطورة.",
      date: "15 ديسمبر 2024",
      readTime: "5 دقائق",
      category: "ذكاء اصطناعي",
      slug: "ai-future-business",
      gradient: "from-blue-500 to-cyan-500",
      categoryColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "كيفية أتمتة عمليات الشركات باستخدام n8n",
      excerpt: "دليل شامل لاستخدام منصة n8n في أتمتة العمليات التجارية وتحسين الكفاءة وتقليل الأخطاء البشرية في بيئة العمل.",
      date: "12 ديسمبر 2024",
      readTime: "8 دقائق",
      category: "أتمتة",
      slug: "automation-n8n-guide",
      gradient: "from-purple-500 to-pink-500",
      categoryColor: "bg-purple-100 text-purple-800"
    },
    {
      title: "استراتيجيات التسويق الرقمي بالذكاء الاصطناعي",
      excerpt: "اكتشف كيف تستخدم الذكاء الاصطناعي في حملاتك التسويقية لتحقيق معدلات تحويل أعلى واستهداف أدق للعملاء المحتملين.",
      date: "10 ديسمبر 2024",
      readTime: "6 دقائق",
      category: "تسويق رقمي",
      slug: "ai-digital-marketing",
      gradient: "from-green-500 to-emerald-500",
      categoryColor: "bg-green-100 text-green-800"
    }
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-8 border border-blue-200">
            <Sparkles className="w-4 h-4 ml-2 text-blue-600" />
            مدونة المعرفة التقنية
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-slate-900 mb-2">اكتشف أحدث</span>
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              المقالات التقنية
            </span>
          </h2>

          <p className="text-xl lg:text-2xl mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            مقالات ونصائح حصرية حول أحدث تقنيات الذكاء الاصطناعي والأتمتة لمساعدتك في تطوير أعمالك
          </p>
        </div>

        {/* Categories */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} مقال</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Featured Blog Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <CardContent className="relative z-10 p-6">
                {/* Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.categoryColor}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors leading-tight">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-500 text-xs">{post.category}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Link href={`/blog/${post.slug}`}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white group-hover:border-transparent transition-all duration-300"
                  >
                    اقرأ المقال كاملاً
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>

              {/* Floating Icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden mb-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              اشترك في نشرتنا البريدية
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              احصل على أحدث المقالات والنصائح التقنية مباشرة في بريدك الإلكتروني
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-full">
                اشترك الآن
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-6 border border-blue-200">
            <BookOpen className="w-4 h-4 ml-2 text-blue-600" />
            اكتشف المزيد
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
            استكشف مكتبة المقالات الكاملة
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            أكثر من 50 مقال تقني متخصص في الذكاء الاصطناعي والأتمتة والتسويق الرقمي
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <BookOpen className="ml-2 h-5 w-5" />
                تصفح جميع المقالات
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg rounded-full"
            >
              البحث في المقالات
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 