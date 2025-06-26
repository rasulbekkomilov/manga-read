// stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
   const loading = ref(false)

   function setLoading(val) {
      loading.value = val
   }

   function showToastMessage(message) {
      alert(message) // yoki bu yerga o'z toast komponentingizni chaqiring
   }

   return { loading, setLoading, showToastMessage }
})
