'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Brain } from 'lucide-react'

interface ProductImageProps {
  src?: string
  alt: string
  title: string
}

export function ProductImage({ src, alt }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse">
            <Brain className="w-16 h-16 text-white" />
          </div>
          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <Image 
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setImageError(true)}
    />
  )
} 