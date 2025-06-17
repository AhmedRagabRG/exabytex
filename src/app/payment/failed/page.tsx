'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // نقل جميع الـ parameters إلى صفحة النجاح مع تغيير الحالة
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', 'failed')
    
    // إضافة رسالة الخطأ إذا كانت موجودة
    if (!params.has('error')) {
      params.set('error', 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.')
    }
    
    // التوجيه إلى صفحة النجاح مع الـ parameters المحدثة
    router.replace(`/payment/success?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري معالجة حالة الدفع...</p>
      </div>
    </div>
  )
} 