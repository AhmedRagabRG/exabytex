'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    title: string
    price: number
    image?: string
  }
}

interface CartState {
  items: CartItem[]
  total: number
  isLoading: boolean
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => void
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        isLoading: false
      }
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      )
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        return { ...state, items: updatedItems, total }
      } else {
        const updatedItems = [...state.items, action.payload]
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        return { ...state, items: updatedItems, total }
      }
    }
    
    case 'UPDATE_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      return { ...state, items: updatedItems, total }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      return { ...state, items: updatedItems, total }
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isLoading: false
  })

  const refreshCart = async () => {
    if (!session?.user) return

    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'SET_CART', payload: { items: data.cartItems, total: data.total } })
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
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

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'ADD_ITEM', payload: data.cartItem })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
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

      if (response.ok) {
        dispatch({ type: 'UPDATE_ITEM', payload: { id: itemId, quantity } })
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId })
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  useEffect(() => {
    if (session?.user) {
      refreshCart()
    } else {
      dispatch({ type: 'CLEAR_CART' })
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
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 