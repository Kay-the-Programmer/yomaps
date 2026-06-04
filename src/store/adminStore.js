import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,

      setAuth: ({ token, user }) => set({ token, username: user?.username || null }),
      logout: () => set({ token: null, username: null })
    }),
    { name: 'yomaps-admin' }
  )
)

// Non-hook accessors for use inside axios interceptors
export const getAdminToken = () => useAdminStore.getState().token
export const clearAdminAuth = () => useAdminStore.getState().logout()
