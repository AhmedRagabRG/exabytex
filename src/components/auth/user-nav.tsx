"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Link href="/auth/signin">
          <Button variant="ghost" size="sm">
            تسجيل الدخول
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">
            إنشاء حساب
          </Button>
        </Link>
      </div>
    )
  }

  const user = session.user
  const userInitials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-auto px-3 py-2">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} alt={user.name || ''} />
              <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <p className="text-sm font-medium leading-none">
                {user.name || 'مستخدم'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
} 