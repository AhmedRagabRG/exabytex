export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  discountedPrice?: number
  hasDiscount?: boolean
  image: string
  category: string
  features: string[]
  isPopular?: boolean
  averageRating?: number
  reviewCount?: number
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  coverImage?: string
  author: {
    name: string
    email: string
    image?: string
    role: string
  }
  tags: string[]
  publishedAt: Date
  featured?: boolean
}

export interface Order {
  id: string
  userId: string
  productId: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
  createdAt: Date
  product: Product
}

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  avatar: string
  rating: number
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
} 