// stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useUiStore } from './ui'

export const useAuthStore = defineStore('auth', {
   state: () => ({
      user: null,
      isAdmin: false,
   }),

   actions: {
      async fetchUser() {
         const ui = useUiStore() // 💡 Faqat action ichida chaqirish mumkin!
         const { data, error } = await supabase.auth.getUser()

         if (error) {
            ui.showToastMessage("Foydalanuvchini olishda xatolik")
            return
         }

         this.user = data.user
         this.isAdmin = this.user?.email === 'rasulbekkomilov7@gmail.com'
      }
   }
})
