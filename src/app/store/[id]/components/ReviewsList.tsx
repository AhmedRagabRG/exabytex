'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Calendar } from 'lucide-react'
import { DateDisplay } from "@/components/ui/date-display"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface ReviewsListProps {
  productId: string
  refreshTrigger: number
}

export function ReviewsList({ productId, refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${productId}/reviews`)
      
      if (!response.ok) {
        throw new Error('فشل في جلب المراجعات')
      }

      const data = await response.json()
      setReviews(data)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'حدث خطأ في جلب المراجعات')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId, refreshTrigger])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      counts[review.rating as keyof typeof counts]++
    })
    return counts
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="relative overflow-hidden border-0 bg-white/5 backdrop-blur-md animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/10 rounded mb-3"></div>
              <div className="h-20 bg-white/10 rounded mb-3"></div>
              <div className="h-3 bg-white/10 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-0 bg-red-500/10 backdrop-blur-md">
        <CardContent className="p-6 text-center">
          <p className="text-red-300">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <CardContent className="p-8 text-center relative z-10">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">لا توجد مراجعات بعد</h3>
          <p className="text-gray-300">كن أول من يراجع هذا المنتج</p>
        </CardContent>
      </Card>
    )
  }

  const ratingCounts = getRatingCounts()

  return (
    <div className="space-y-6">
      {/* ملخص التقييمات */}
      <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{getAverageRating()}</span>
                <div className="flex gap-1">
                  {renderStars(Math.round(parseFloat(String(getAverageRating()))))}
                </div>
              </div>
              <p className="text-gray-300">
                بناءً على {reviews.length} مراجعة
              </p>
            </div>
            
            {/* توزيع التقييمات */}
            <div className="space-y-2 min-w-[200px]">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="text-white w-2">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: reviews.length > 0 ? `${(ratingCounts[rating as keyof typeof ratingCounts] / reviews.length) * 100}%` : '0%' 
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-300 w-6 text-right">
                    {ratingCounts[rating as keyof typeof ratingCounts]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المراجعات */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <CardContent className="p-6 relative z-10">
              {/* معلومات المراجع */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {review.user.name || 'مستخدم'}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="h-3 w-3" />
                      <DateDisplay date={review.createdAt} />
                    </div>
                  </div>
                </div>
                
                {/* تقييم المراجعة */}
                <div className="flex gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* نص المراجعة */}
              <p className="text-gray-200 leading-relaxed">
                {review.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 