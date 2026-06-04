import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      currency: 'ZMW',

      setCurrency: (currency) => set({ currency }),

      addItem: (product, size, quantity = 1) => {
        const existing = get().items.find(
          (i) => i.product._id === product._id && i.size === size
        )
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.product._id === product._id && i.size === size
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          }))
        } else {
          set((state) => ({ items: [...state.items, { product, size, quantity }] }))
        }
      },

      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product._id === productId && i.size === size)
          )
        })),

      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter(
                  (i) => !(i.product._id === productId && i.size === size)
                )
              : state.items.map((i) =>
                  i.product._id === productId && i.size === size
                    ? { ...i, quantity }
                    : i
                )
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price_zmw * i.quantity, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
    }),
    { name: 'yomaps-cart' }
  )
)

export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}))
