'use client'

import { SessionProvider } from 'next-auth/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost::3000'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath={`${baseUrl}/api/auth`}>
      {children}
    </SessionProvider>
  )
} 