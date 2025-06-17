'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ShoppingCart, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: string
  productTitle: string
  price: number
  discountedPrice?: number
  hasDiscount?: boolean
}

export function AddToCartButton({ 
  productId, 
  productTitle,
  price,
  discountedPrice,
  hasDiscount 
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          price,
          discountedPrice,
          hasDiscount
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        alert(data.error || 'حدث خطأ في إضافة المنتج للسلة')
        return
      }

      // إظهار حالة النجاح
      setIsAdded(true)
      
      // تحديث السلة في الواجهة
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      
      // إشعار نجاح
      const successDiv = document.createElement('div')
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse'
      successDiv.textContent = `تم إضافة "${productTitle}" للسلة بنجاح!`
      document.body.appendChild(successDiv)
      
      setTimeout(() => {
        successDiv.remove()
      }, 3000)
      
      // إعادة تعيين حالة الزر بعد 3 ثوان
      setTimeout(() => {
        setIsAdded(false)
      }, 3000)

    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('حدث خطأ في إضافة المنتج للسلة')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className={`font-semibold py-3 px-8 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
      } text-white`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
          جاري الإضافة...
        </>
      ) : isAdded ? (
        <>
          <CheckCircle className="w-5 h-5 ml-2" />
          تمت الإضافة!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 ml-2" />
          إضافة للسلة
        </>
      )}
    </Button>
  )
} 