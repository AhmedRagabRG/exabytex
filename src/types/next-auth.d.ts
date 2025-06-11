// احذف NextAuth إذا لم يكن مستخدمًا

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'ADMIN' | 'MANAGER' | 'USER' // Made required
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: 'ADMIN' | 'MANAGER' | 'USER' // Made required
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string // Made required
  }
} 