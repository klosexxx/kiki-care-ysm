import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      cartCount: 0,
      wishlistCount: 0,

      setUser: (user, token) => {
        localStorage.setItem('kiki_token', token)
        localStorage.setItem('kiki_user', JSON.stringify(user))
        set({ user, token })
      },

      logout: () => {
        localStorage.removeItem('kiki_token')
        localStorage.removeItem('kiki_user')
        set({ user: null, token: null, cartCount: 0 })
      },

      setCartCount: (count) => set({ cartCount: count }),
      setWishlistCount: (count) => set({ wishlistCount: count }),
    }),
    { name: 'kiki-store', partialize: (state) => ({ user: state.user, token: state.token }) }
  )
)

export default useStore