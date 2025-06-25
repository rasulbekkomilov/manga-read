<template>
  <div>
    <Toast />
    <div v-if="ui.loading" class="page-loading">
      <LoadingSpinner />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Toast from '@/components/Toast.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<style scoped>
.page-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
