import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, Sparkles, Brain, Zap, Bot } from "lucide-react"
import { BlogPost } from "@/types"
import { DateDisplay } from "@/components/ui/date-display"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "ذكاء اصطناعي":
      case "ai":
        return Brain
      case "أتمتة":
      case "automation":
        return Zap
      case "روبوتات":
      case "chatbots":
        return Bot
      default:
        return Sparkles
    }
  }

  const getTagGradient = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "ذكاء اصطناعي":
      case "ai":
        return "from-blue-500 to-cyan-500"
      case "أتمتة":
      case "automation":
        return "from-purple-500 to-pink-500"
      case "روبوتات":
      case "chatbots":
        return "from-green-500 to-emerald-500"
      default:
        return "from-orange-500 to-red-500"
    }
  }

  const TagIcon = getTagIcon(post.tags[0] || "")
  const tagGradient = getTagGradient(post.tags[0] || "")

  return (
    <Card className={`group border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
      featured ? "md:col-span-2 lg:col-span-1" : ""
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      
      {/* Featured Badge */}
      {post.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className={`relative bg-gradient-to-br from-slate-800/50 to-purple-800/50 ${
        featured ? "h-64" : "h-48"
      } overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${featured ? "w-20 h-20" : "w-16 h-16"} bg-gradient-to-r ${tagGradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
            <TagIcon className={`${featured ? "h-10 w-10" : "h-8 w-8"} text-white`} />
          </div>
        </div>
        
        {/* Category overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Floating sparkles */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-6 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <CardHeader className={featured ? "p-6" : "p-4"}>
          <CardTitle className={`text-white group-hover:text-blue-400 transition-colors line-clamp-2 ${
            featured ? "text-xl" : "text-lg"
          }`}>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </CardTitle>
          
          <CardDescription className={`line-clamp-3 text-gray-300 ${
            featured ? "text-base" : "text-sm"
          }`}>
            {post.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent className={featured ? "p-6 pt-0" : "p-4 pt-0"}>
          {/* Author and Date */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className={`${featured ? "w-10 h-10" : "w-8 h-8"} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center`}>
                <span className="text-white font-semibold text-xs">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <span className="text-gray-300">{post.author.name}</span>
            </div>
            
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-400">
              <Calendar className="h-4 w-4" />
              <DateDisplay date={post.publishedAt} />
            </div>
          </div>

          {/* Read More Link */}
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 group hover:scale-105"
            aria-label={`اقرأ المزيد عن: ${post.title}`}
          >
            اقرأ المزيد
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardContent>
      </div>
    </Card>
  )
} 