'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string // cart item ID
  productId: string // product ID
  name: string
  price: number
  quantity: number
  image?: string
  category: string
  description: string
  type: string
  hasDiscount?: boolean
  discountedPrice?: number
  features?: string
}

interface CartState {
  items: CartItem[]
  total: number
  isLoading: boolean
  appliedPromo: PromoValidation | null
}

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
}

interface PromoValidation {
  valid: boolean;
  promoCode: PromoCode;
  discountAmount: number;
  finalTotal: number;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => void
  refreshCart: () => Promise<void>
  setAppliedPromo: (promo: PromoValidation | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PROMO'; payload: PromoValidation | null }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_CART':
      return { ...state, ...action.payload, isLoading: false }
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id)
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        const total = updatedItems.reduce((sum, item) => {
          const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
            ? item.discountedPrice 
            : item.price;
          return sum + (itemPrice * item.quantity);
        }, 0);
        return { ...state, items: updatedItems, total }
      } else {
        const updatedItems = [...state.items, action.payload]
        const total = updatedItems.reduce((sum, item) => {
          const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
            ? item.discountedPrice 
            : item.price;
          return sum + (itemPrice * item.quantity);
        }, 0);
        return { ...state, items: updatedItems, total }
      }
    }
    
    case 'UPDATE_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => {
        const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
          ? item.discountedPrice 
          : item.price;
        return sum + (itemPrice * item.quantity);
      }, 0);
      return { ...state, items: updatedItems, total }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => {
        const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
          ? item.discountedPrice 
          : item.price;
        return sum + (itemPrice * item.quantity);
      }, 0);
      return { ...state, items: updatedItems, total }
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, appliedPromo: null }

    case 'SET_PROMO':
      return { ...state, appliedPromo: action.payload }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isLoading: false,
    appliedPromo: null
  })

  const setAppliedPromo = (promo: PromoValidation | null) => {
    dispatch({ type: 'SET_PROMO', payload: promo })
    // حفظ الكوبون في localStorage
    if (promo) {
      localStorage.setItem('appliedPromo', JSON.stringify(promo))
    } else {
      localStorage.removeItem('appliedPromo')
    }
  }

  // استرجاع الكوبون من localStorage عند تحميل الصفحة
  useEffect(() => {
    const savedPromo = localStorage.getItem('appliedPromo')
    if (savedPromo) {
      try {
        const promo = JSON.parse(savedPromo)
        dispatch({ type: 'SET_PROMO', payload: promo })
      } catch (error) {
        console.error('Error parsing saved promo:', error)
        localStorage.removeItem('appliedPromo')
      }
    }
  }, [])

  const refreshCart = async () => {
    if (!session?.user) return

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.cart) {
          // استخدام البيانات مباشرة من API
          const cartItems = data.cart
          const total = data.cart.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0)
          
          dispatch({ type: 'SET_CART', payload: { items: cartItems, total } })
        } else {
          // إذا لم تكن هناك سلة، أنشئ سلة فارغة
          dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } })
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      // في حالة الخطأ، أنشئ سلة فارغة
      dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    if (!session?.user) {
      // Redirect to login or show message
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // إعادة جلب السلة لضمان التحديث الصحيح
        await refreshCart()
        
        // إشعار نجاح
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('addToCartSuccess', { 
            detail: { message: data.message } 
          })
          window.dispatchEvent(event)
        }
      } else {
        throw new Error(data.error || 'فشل في إضافة المنتج للسلة')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      
      // إشعار خطأ
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('addToCartError', { 
          detail: { message: error instanceof Error ? error.message : 'خطأ في إضافة المنتج للسلة' } 
        })
        window.dispatchEvent(event)
      }
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (!response.ok) {
        // محاولة قراءة error message من response
        let errorMessage = 'فشل في تحديث الكمية'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // إذا response مش JSON، استعمل status code
          errorMessage = `خطأ ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.success) {
        // إعادة جلب السلة لضمان التحديث الصحيح
        await refreshCart()
      } else {
        throw new Error(data.error || 'فشل في تحديث الكمية')
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      
      // إشعار المستخدم بالخطأ
      if (typeof window !== 'undefined') {
        const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الكمية'
        const event = new CustomEvent('updateQuantityError', { 
          detail: { message: errorMessage } 
        })
        window.dispatchEvent(event)
      }
      
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!session?.user) return

    try {
      // التحقق من أن العنصر مؤقت (من localStorage)
      const isTempItem = itemId.includes('coin-temp-') || itemId.includes('temp-')

      if (isTempItem) {
        // للعناصر المؤقتة، احذف من localStorage مباشرة
        try {
          const storedCart = localStorage.getItem("cart")
          let currentCart = storedCart ? JSON.parse(storedCart) : []
          
          // إزالة العنصر من localStorage
          currentCart = currentCart.filter((item: any) => item.id !== itemId)
          localStorage.setItem("cart", JSON.stringify(currentCart))

          // تحديث السلة على الخادم
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart: currentCart }),
          })

          // إعادة جلب السلة
          await refreshCart()
          return
        } catch (error) {
          console.error('Error removing temp item from localStorage:', error)
        }
      }

      // للعناصر العادية، استخدم API
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل في حذف المنتج')
      }

      const data = await response.json()

      if (data.success) {
        // إعادة جلب السلة لضمان التحديث الصحيح
        await refreshCart()
      } else {
        throw new Error(data.error || 'فشل في حذف المنتج')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      
      // في حالة الخطأ، إعادة جلب السلة لضمان التطابق
      await refreshCart()
      
      // إشعار المستخدم بالخطأ
      if (typeof window !== 'undefined') {
        const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف المنتج'
        const event = new CustomEvent('removeFromCartError', { 
          detail: { message: errorMessage } 
        })
        window.dispatchEvent(event)
      }
      
      throw error
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  // Load cart when session changes
  useEffect(() => {
    if (session?.user) {
      refreshCart()
    } else {
      // Clear cart when not logged in
      dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } })
    }
  }, [session])

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCart()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', handleCartUpdate)
      
      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate)
      }
    }
  }, [session])

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        setAppliedPromo
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    // بدلاً من throw error، أرجع قيم افتراضية آمنة
    console.warn('useCart must be used within a CartProvider')
    return {
      items: [],
      total: 0,
      isLoading: false,
      addToCart: async () => {},
      updateQuantity: async () => {},
      removeFromCart: async () => {},
      clearCart: () => {},
      refreshCart: async () => {},
      setAppliedPromo: () => {}
    }
  }
  return context
} 