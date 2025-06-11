"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/components/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut, 
  Brain, 
  Sparkles, 
  Zap,
  Rocket,
  Bot,
  Globe,
  Coins,
  Settings
} from "lucide-react"
import { NoSSR } from "@/components/no-ssr"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()
  const { items = [] } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { 
      name: "الرئيسية", 
      href: "/", 
      icon: Globe,
      gradient: "from-blue-500 to-cyan-500" 
    },
    { 
      name: "الخدمات", 
      href: "/#services", 
      icon: Zap,
      gradient: "from-purple-500 to-pink-500" 
    },
    { 
      name: "المتجر", 
      href: "/store", 
      icon: Rocket,
      gradient: "from-green-500 to-emerald-500" 
    },
    { 
      name: "مولد المحتوى", 
      href: "/ai-content", 
      icon: Brain,
      gradient: "from-orange-500 to-red-500" 
    },
    { 
      name: "المدونة", 
      href: "/blog", 
      icon: Brain,
      gradient: "from-orange-500 to-red-500" 
    },
    { 
      name: "اتصل بنا", 
      href: "/contact", 
      icon: Bot,
      gradient: "from-indigo-500 to-purple-500" 
    },
  ]

  return (
    <header className={`relative text-white sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl border-b border-white/20' 
        : 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-white/10'
    }`}>
      {/* Animated Background Elements */}
      <div className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${
        isScrolled ? 'opacity-30' : 'opacity-100'
      }`}>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/2 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3 rtl:space-x-reverse">
              <div className="relative">
                <div className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-lg ${
                  isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <Brain className={`text-white transition-all duration-500 ${
                    isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  }`} />
                </div>
                {/* Floating sparkles */}
                <div className={`absolute -top-1 -right-1 bg-yellow-400 rounded-full animate-ping transition-all duration-500 ${
                  isScrolled ? 'w-2 h-2' : 'w-3 h-3'
                }`}></div>
                <div className={`absolute -bottom-1 -left-1 bg-cyan-400 rounded-full animate-pulse transition-all duration-500 ${
                  isScrolled ? 'w-1.5 h-1.5' : 'w-2 h-2'
                }`}></div>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-500 ${
                  isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                  Exa Bytex
                </span>
                <span className={`text-gray-400 font-medium transition-all duration-500 ${
                  isScrolled ? 'text-xs opacity-70' : 'text-xs'
                }`}>
                  مستقبل الذكاء الاصطناعي
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10"
                aria-label={item.name}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}>
                    <item.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Active Indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-8 transition-all duration-300"></div>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse">
            {/* Coins Link for Logged In Users */}
            {/* Cart Icon with Badge */}
            <NoSSR fallback={
              <Button variant="ghost" size="icon" className="relative hover:bg-white/10 transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-300" />
              </Button>
            }>
              <Link href="/cart" aria-label="عرض السلة">
                <Button variant="ghost" size="icon" aria-label={`عرض السلة - ${items.length} عناصر`} className="relative group hover:bg-white/10 transition-all duration-300">
                  <ShoppingCart className="h-5 w-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-bold">
                      {items.length}
                    </span>
                  )}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </NoSSR>

            <NoSSR fallback={
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button 
                  variant="outline" 
                  className="border-white/30 text-gray-300 hover:bg-white hover:text-slate-900 transition-all duration-300"
                >
                  تسجيل الدخول
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                  إنشاء حساب
                </Button>
              </div>
            }>
              {session ? (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Link href="/dashboard" aria-label="لوحة التحكم">
                    <Button variant="ghost" size="icon" aria-label="لوحة التحكم" className="relative group hover:bg-white/10 transition-all duration-300">
                      <User className="h-5 w-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => signOut()}
                    aria-label="تسجيل الخروج"
                    className="flex items-center space-x-2 rtl:space-x-reverse border-white/30 text-gray-300 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>خروج</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Link href="/auth/signin">
                    <Button 
                      variant="outline" 
                      className="border-white/30 text-gray-300 hover:bg-white hover:text-slate-900 transition-all duration-300"
                    >
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <Sparkles className="w-4 h-4 ml-2 text-white" />
                      إنشاء حساب
                    </Button>
                  </Link>
                </div>
              )}
            </NoSSR>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className="text-white hover:bg-white/10"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className={`px-2 pt-4 pb-6 space-y-2 backdrop-blur-md rounded-2xl mt-4 border border-white/10 shadow-2xl transition-all duration-500 ${
              isScrolled 
                ? 'bg-slate-900/98' 
                : 'bg-gradient-to-b from-slate-800/95 to-slate-900/95'
            }`}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group block px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  aria-label={item.name}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-medium text-gray-300 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-white/10">
                <NoSSR>
                  {session ? (
                                      <div className="space-y-3">
                    <Link href="/coins" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-all duration-300">
                        <Coins className="h-4 w-4" />
                        <span>متجر الكوينز</span>
                      </Button>
                    </Link>
                    <Link href="/cart" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse border-white/30 text-gray-300 hover:bg-white hover:text-slate-900 transition-all duration-300">
                        <ShoppingCart className="h-4 w-4" />
                        <span>السلة ({items.length})</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-white/30 text-gray-300 hover:bg-white hover:text-slate-900 transition-all duration-300">
                        <User className="h-4 w-4 ml-2" />
                        لوحة التحكم
                      </Button>
                    </Link>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full border-white/30 text-gray-300 hover:bg-white hover:text-slate-900 transition-all duration-300">
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300">
                          <Sparkles className="w-4 h-4 ml-1 text-white" />
                          إنشاء حساب
                        </Button>
                      </Link>
                    </div>
                  )}
                </NoSSR>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 