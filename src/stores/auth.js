import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
   state: () => ({
      user: null,
      isAdmin: false,
   }),
   actions: {
      async fetchUser() {
         const { data: { user } } = await supabase.auth.getUser()
         this.user = user

         // 🔽 YANGI QISM: admin tekshiruv
         const email = user?.email || ''
         const role = user?.user_metadata?.role || ''

         this.isAdmin = role === 'admin' || email === 'rasulbekkomilov7@gmail.com'

         if (!user) {
            ui.showToastMessage("Avval tizimga kiring")
            return
         }

      },

      async logout() {
         await supabase.auth.signOut()
         this.user = null
         this.isAdmin = false
      }
   }
})
