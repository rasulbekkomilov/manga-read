import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
   state: () => ({
      loading: false,
      toastMessage: '',
      showToast: false,
   }),
   actions: {
      setLoading(value) {
         this.loading = value
      },
      showToastMessage(message) {
         this.toastMessage = message
         this.showToast = true
         setTimeout(() => {
            this.showToast = false
            this.toastMessage = ''
         }, 5000) // 5 sekund
      }
   }
})
