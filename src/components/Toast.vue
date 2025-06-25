<template>
   <div v-if="ui.showToast" class="toast">
      {{ ui.toastMessage }}
   </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
</script>

<style scoped>
.toast {
   position: fixed;
   top: 20px;
   right: 20px;
   background-color: #e74c3c;
   color: white;
   padding: 0.75rem 1.2rem;
   border-radius: 5px;
   box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
   z-index: 9999;
   font-size: 14px;
}
</style>
