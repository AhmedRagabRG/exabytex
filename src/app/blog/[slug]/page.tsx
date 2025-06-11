'use client';

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Edit } from "lucide-react"
import { ShareButton } from "@/components/blog/ShareButton"
import { SaveButton } from "@/components/blog/SaveButton"
import { Comments } from "@/components/blog/Comments"
import { Button } from "@/components/ui/button"

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  coverImage?: string;
  tags: string[];
  status: string;
  published: boolean;
  publishedAt: Date;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(`/api/blogs?slug=${slug}`)
    if (!response.ok) return null
    
    const data = await response.json()
    return data.post || data.blogs?.[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

const getRoleInArabic = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'مدير'
    case 'MANAGER': return 'مدير تنفيذي'
    case 'BLOGGER': return 'كاتب'
    case 'USER': return 'مستخدم'
    default: return 'مؤلف'
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { data: session } = useSession()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const initPage = async () => {
      try {
        const resolvedParams = await params
        setSlug(resolvedParams.slug)
        console.log('🚀 تحميل صفحة المقال لـ slug:', resolvedParams.slug)
        
        const postData = await getPostBySlug(resolvedParams.slug)
        
        if (!postData) {
          console.log('❌ المقال غير موجود')
          notFound()
        }

        console.log('✅ تم تحميل المقال بنجاح:', postData.title)
        setPost(postData)
      } catch (error) {
        console.error('💥 خطأ في تحميل المقال:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [params])

  const canEditPost = () => {
    if (!session?.user?.email || !post) return false
    
    // Admin or Manager can edit any blog
    const userRole = (session.user as any)?.role
    if (userRole === 'ADMIN' || userRole === 'MANAGER') return true
    
    // Author can edit their own blog
    return post.author.email === session.user.email
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المقال...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">المقال غير موجود</h1>
          <p className="text-gray-600 mb-4">لم يتم العثور على المقال المطلوب</p>
          <Link 
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            العودة إلى المدونة
          </Link>
        </div>
      </div>
    )
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة إلى المدونة
          </Link>

          {/* Edit Button for Author/Admin */}
          {canEditPost() && (
            <Link href={`/blog/edit/${post.id}`}>
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <Edit className="h-4 w-4 ml-1" />
                تعديل المقال
              </Button>
            </Link>
          )}
        </div>

        {/* Article */}
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-gray-200 pt-6 mb-8">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-xs text-gray-500">{getRoleInArabic(post.author.role)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{new Date(post.publishedAt).toLocaleDateString('ar-EG')}</span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="h-4 w-4 text-green-500" />
                <span>{readingTime} دقائق قراءة</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-8">
                <Image 
                  src={post.coverImage} 
                  alt={post.title}
                  width={800}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-12">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                    .replace(/\n/g, '<br />')
                    .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">')
                    .replace(/<h3>/g, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">')
                    .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 my-4">')
                    .replace(/<li>/g, '<li class="text-gray-700">')
                    .replace(/<p>/g, '<p class="text-gray-700 mb-4">')
                    .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
                }} 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-8 border-t border-gray-200">
              <ShareButton title={post.title} />
              {/* <SaveButton postId={post.id} /> */}
            </div>

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.author.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-2">
                      {getRoleInArabic(post.author.role)}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      كاتب ومختص في مجال الذكاء الاصطناعي والتكنولوجيا، يسعى لتقديم محتوى عربي عالي الجودة في هذا المجال المهم.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Comments blogPostId={post.id} />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
} 