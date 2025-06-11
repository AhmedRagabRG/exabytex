'use client'

import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from 'lucide-react'
import { AddReviewForm } from './AddReviewForm'
import { ReviewsList } from './ReviewsList'

interface ProductReviewsSectionProps {
  productId: string
  productTitle: string
}

export function ProductReviewsSection({ productId, productTitle }: ProductReviewsSectionProps) {
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0)

  const handleReviewAdded = () => {
    setReviewsRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-md shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-400" />
              آراء العملاء والمراجعات
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              شارك تجربتك واقرأ آراء العملاء الآخرين
            </CardDescription>
          </CardHeader>
        </div>
      </Card>

      {/* Add Review Form */}
      <AddReviewForm 
        productId={productId}
        productTitle={productTitle}
        onReviewAdded={handleReviewAdded}
      />

      {/* Reviews List */}
      <ReviewsList 
        productId={productId}
        refreshTrigger={reviewsRefreshTrigger}
      />
    </div>
  )
} 