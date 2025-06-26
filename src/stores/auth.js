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
         try {
            // Avval sessiyani tekshiramiz
            const {
               data: { session },
               error: sessionError
            } = await supabase.auth.getSession()

            if (sessionError || !session) {
               console.warn('Foydalanuvchi sessiyasi yo‘q')
               this.user = null
               this.isAdmin = false
               return
            }

            // Endi foydalanuvchini olamiz
            const {
               data: { user },
               error: userError
            } = await supabase.auth.getUser()

            if (userError) {
               console.error('Foydalanuvchini olishda xatolik:', userError)
               return
            }

            this.user = user
            this.isAdmin = user?.email === 'rasulbekkomilov7@gmail.com'
         } catch (err) {
            console.error('Foydalanuvchi maʼlumotini olishda istisno:', err)
         }
      },

      async logout() {
         await supabase.auth.signOut()
         this.user = null
         this.isAdmin = false
      }
   }
})
