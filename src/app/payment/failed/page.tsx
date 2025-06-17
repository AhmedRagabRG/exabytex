'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentFailedPage() {
  const router = useRouter()

  useEffect(() => {
    // الحصول على الـ parameters من الـ URL مباشرة
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get('order_id')
    const error = params.get('error') || 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.'
    
    // إنشاء URL جديد لصفحة النجاح
    const successUrl = new URL('/payment/success', window.location.origin)
    successUrl.searchParams.set('status', 'failed')
    if (orderId) successUrl.searchParams.set('order_id', orderId)
    successUrl.searchParams.set('error', error)
    
    // التوجيه إلى صفحة النجاح
    router.replace(successUrl.toString())
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري معالجة حالة الدفع...</p>
      </div>
    </div>
  )
} 