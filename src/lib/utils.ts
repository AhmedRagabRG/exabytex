import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
}

/**
 * دالة للحصول على الرابط الأساسي للموقع
 * تأخذ في الاعتبار بيئة العمل ومتغيرات البيئة
 */
export function getBaseUrl(): string {
  // إذا كان هناك متغير BASE_URL محدد، استخدمه
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }

  // إذا كان هناك متغير NEXTAUTH_URL محدد، استخدمه
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // في بيئة الإنتاج، استخدم الدومين الرسمي
  if (process.env.NODE_ENV === 'production') {
    return 'https://exabytex.com'
  }

  // في التطوير، استخدم localhost
  return 'http://localhost:3000'
}

/**
 * دالة للحصول على رابط كامل لصفحة معينة
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * دالة لتحديد ما إذا كان الموقع في بيئة الإنتاج
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * دالة لتحديد ما إذا كان الموقع في بيئة التطوير
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
} 