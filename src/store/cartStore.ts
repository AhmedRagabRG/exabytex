import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  hasDiscount?: boolean;
  image?: string;
  category: string;
  features: string[];
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountedPrice?: number;
  hasDiscount?: boolean;
  quantity: number;
  image?: string;
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

interface CartStore {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  appliedPromo: PromoValidation | null;
  setAppliedPromo: (promo: PromoValidation | null) => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      appliedPromo: null,
      setAppliedPromo: (promo) => {
        set({ appliedPromo: promo });
      },
      addToCart: async (item) => {
        set({ isLoading: true });
        try {
          const items = get().items;
          const existingItem = items.find(i => i.id === item.id);
          
          if (existingItem) {
            const updatedItems = items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
            set({ items: updatedItems });
          } else {
            set({ items: [...items, { ...item, quantity: 1 }] });
          }
          
          // إعادة حساب المجموع
          const newTotal = get().items.reduce((sum, item) => {
            const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
              ? item.discountedPrice 
              : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          set({ total: newTotal });
        } catch (error) {
          console.error('Error adding to cart:', error);
          const event = new CustomEvent('addToCartError', {
            detail: { message: error instanceof Error ? error.message : 'خطأ في إضافة المنتج للسلة' }
          });
          window.dispatchEvent(event);
        } finally {
          set({ isLoading: false });
        }
      },
      removeFromCart: async (itemId) => {
        set({ isLoading: true });
        try {
          const items = get().items.filter(item => item.id !== itemId);
          
          // إعادة حساب المجموع
          const newTotal = items.reduce((sum, item) => {
            const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
              ? item.discountedPrice 
              : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          set({ items, total: newTotal });

          // إذا أصبحت السلة فارغة، إزالة الكوبون
          if (items.length === 0) {
            set({ appliedPromo: null });
          }
        } catch (error) {
          console.error('Error removing from cart:', error);
          const event = new CustomEvent('removeFromCartError', {
            detail: { message: error instanceof Error ? error.message : 'خطأ في حذف المنتج من السلة' }
          });
          window.dispatchEvent(event);
        } finally {
          set({ isLoading: false });
        }
      },
      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          const items = get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          
          // إعادة حساب المجموع
          const newTotal = items.reduce((sum, item) => {
            const itemPrice = item.hasDiscount && item.discountedPrice !== undefined 
              ? item.discountedPrice 
              : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0);
          
          set({ items, total: newTotal });
        } catch (error) {
          console.error('Error updating quantity:', error);
          const event = new CustomEvent('updateQuantityError', {
            detail: { message: error instanceof Error ? error.message : 'خطأ في تحديث الكمية' }
          });
          window.dispatchEvent(event);
        } finally {
          set({ isLoading: false });
        }
      },
      clearCart: () => {
        set({ items: [], total: 0, appliedPromo: null });
      },
      getCartTotal: () => {
        const { items, appliedPromo } = get();
        const subtotal = items.reduce((total, item) => {
          const price = item.hasDiscount && item.discountedPrice !== undefined 
            ? item.discountedPrice 
            : item.price;
          return total + (price * item.quantity);
        }, 0);
        
        return appliedPromo ? appliedPromo.finalTotal : subtotal;
      },
      getCartItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'ai-agency-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        appliedPromo: state.appliedPromo
      })
    }
  )
); 