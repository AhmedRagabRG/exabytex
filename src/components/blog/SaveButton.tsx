'use client'

import { Heart } from "lucide-react"
import { toast } from "sonner"

interface SaveButtonProps {
  postId: string
}

export function SaveButton({ postId }: SaveButtonProps) {
  const handleSave = () => {
    // في المستقبل يمكن ربطها بـ API للمفضلة
    // يمكن إضافة المقال لقاعدة البيانات في جدول المفضلة
    toast.success('تم حفظ المقال في المفضلة!')
    
    // يمكن إضافة logic هنا لحفظ المقال فعلياً
    console.log('حفظ المقال:', postId)
  }

  return (
    <button 
      onClick={handleSave}
      aria-label={`حفظ المقال في المفضلة`}
      className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-all duration-200 transform hover:scale-105 shadow-md"
    >
      <Heart className="h-5 w-5" />
      <span>حفظ للمفضلة</span>
    </button>
  )
} 