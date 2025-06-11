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
  product: Product;
  quantity: number;
  name: string;
  price: number;
  discountedPrice?: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },

      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);

        if (existingItem) {
          // تحديث الكمية إذا كان المنتج موجود
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          // إضافة منتج جديد
          const newItem: CartItem = {
            id: `cart-${product.id}-${Date.now()}`,
            product,
            quantity,
            name: product.title,
            price: product.price,
            discountedPrice: product.discountedPrice,
            image: product.image
          };

          set({
            items: [...items, newItem]
          });
        }
      },

      removeFromCart: (itemId) => {
        const { items } = get();
        set({
          items: items.filter(item => item.id !== itemId)
        });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          // إزالة العنصر إذا كانت الكمية صفر أو أقل
          set({
            items: items.filter(item => item.id !== itemId)
          });
        } else {
          set({
            items: items.map(item =>
              item.id === itemId
                ? { ...item, quantity }
                : item
            )
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.discountedPrice || item.price;
          return total + (price * item.quantity);
        }, 0);
      },

      getCartItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'ai-agency-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
); 