'use client'

import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    const url = window.location.href
    
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).then(() => {
        toast.success('تم مشاركة المقال بنجاح!')
      }).catch((err) => {
        console.error('خطأ في المشاركة:', err)
        fallbackShare(url)
      })
    } else {
      fallbackShare(url)
    }
  }

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('تم نسخ رابط المقال!')
    }).catch(() => {
      toast.error('خطأ في نسخ الرابط')
    })
  }

  return (
    <button 
      onClick={handleShare}
      aria-label={`مشاركة مقال: ${title}`}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-all duration-200 transform hover:scale-105 shadow-md"
    >
      <Share2 className="h-5 w-5" />
      <span>مشاركة المقال</span>
    </button>
  )
} 