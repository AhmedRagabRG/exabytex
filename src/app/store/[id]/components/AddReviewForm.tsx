'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AddReviewFormProps {
  productId: string
  productTitle: string
  onReviewAdded: () => void
}

export function AddReviewForm({ productId, productTitle, onReviewAdded }: AddReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (rating === 0) {
      setError('يرجى اختيار تقييم')
      return
    }

    if (comment.trim().length < 10) {
      setError('التعليق يجب أن يكون 10 أحرف على الأقل')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'حدث خطأ في إضافة المراجعة')
      }

      // إعادة تعيين النموذج
      setRating(0)
      setComment('')
      setShowForm(false)
      
      // إشعار النجاح
      const successDiv = document.createElement('div')
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse'
      successDiv.textContent = 'تم إضافة مراجعتك بنجاح!'
      document.body.appendChild(successDiv)
      
      setTimeout(() => {
        successDiv.remove()
      }, 3000)
      
      // إعادة تحميل المراجعات
      onReviewAdded()

    } catch (error) {
      setError((error as any).message || 'حدث خطأ في إضافة المراجعة')
    } finally {
      setIsLoading(false)
    }
  }

  if (!showForm) {
    return (
      <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <CardContent className="p-6 relative z-10 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">شارك رأيك</h3>
          <p className="text-gray-300 mb-4">هل جربت هذا المنتج؟ شاركنا تجربتك</p>
          {session ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Star className="w-4 h-4 mr-2" />
              اكتب مراجعة
            </Button>
          ) : (
            <Button 
              onClick={() => router.push('/auth/signin')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              سجل دخول لكتابة مراجعة
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            اكتب مراجعة لـ {productTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* تقييم بالنجوم */}
            <div>
              <label className="block text-white/80 mb-2">التقييم *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-2xl transition-all duration-200 hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors duration-200 ${
                        star <= (hoverRating || rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-300 mt-1">
                  {rating === 1 && 'ضعيف'}
                  {rating === 2 && 'مقبول'}
                  {rating === 3 && 'جيد'}
                  {rating === 4 && 'ممتاز'}
                  {rating === 5 && 'رائع'}
                </p>
              )}
            </div>

            {/* التعليق */}
            <div>
              <label className="block text-white/80 mb-2">تعليقك *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-800/80 border border-purple-400/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:bg-slate-800/90 h-32 resize-none"
                placeholder="شاركنا تجربتك مع هذا المنتج..."
                required
                minLength={10}
              />
              <p className="text-xs text-gray-400 mt-1">
                {comment.length}/10 حرف على الأقل
              </p>
            </div>

            {/* رسالة خطأ */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'جاري الإرسال...' : 'إرسال المراجعة'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setRating(0)
                  setComment('')
                  setError('')
                }}
                disabled={isLoading}
                className="border-white/30 text-white hover:bg-white/10"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </Card>
  )
} 