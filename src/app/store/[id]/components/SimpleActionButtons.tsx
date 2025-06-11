'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Heart, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface SimpleActionButtonsProps {
  productId: string
  productTitle: string
  productUrl: string
}

export function SimpleActionButtons({ productId, productTitle, productUrl }: SimpleActionButtonsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  // فحص حالة المنتج في المفضلة عند التحميل
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(`/api/wishlist/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setIsWishlisted(data.isWishlisted)
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }

    checkWishlistStatus()
  }, [productId])

  const handleWishlist = async () => {
    try {
      setIsWishlistLoading(true)
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        const data = await response.json()
        setIsWishlisted(data.isWishlisted)
        toast.success(data.message)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error managing wishlist:', error)
      toast.error('خطأ في الاتصال بالسيرفر')
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      const fullUrl = `${window.location.origin}${productUrl}`
      
      if (navigator.share) {
        await navigator.share({
          title: productTitle,
          text: `اكتشف هذا المنتج الرائع: ${productTitle}`,
          url: fullUrl,
        })
        toast.success('تم مشاركة المنتج بنجاح!')
      } else {
        await navigator.clipboard.writeText(fullUrl)
        toast.success('تم نسخ رابط المنتج للحافظة!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('فشل في مشاركة المنتج')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleWishlist}
        disabled={isWishlistLoading}
        aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        className={`border-white/30 hover:bg-white/10 hover:text-white transition-all duration-300 ${
          isWishlisted ? 'text-red-500 bg-red-500/10 border-red-500/30' : 'text-gray-300'
        }`}
      >
        {isWishlistLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : (
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleShare}
        disabled={isSharing}
        aria-label="مشاركة المنتج"
        className="border-white/30 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
      >
        <Share2 className={`h-5 w-5 ${isSharing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )
}