// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
   state: () => ({
      user: null,
      isAdmin: false,
   }),

   actions: {
      async fetchUser() {
         const { data, error } = await supabase.auth.getUser()

         if (error) {
            console.error('Foydalanuvchi maʼlumotini olishda xatolik:', error)
            return
         }

         this.user = data.user
         this.isAdmin = this.user?.email === 'rasulbekkomilov7@gmail.com' // Adminni shu yerda aniqlaymiz
      },

      async logout() {
         await supabase.auth.signOut()
         this.user = null
         this.isAdmin = false
      }
   }
})
