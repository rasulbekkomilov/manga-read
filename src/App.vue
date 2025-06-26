<template>
  <Navbar />
  <div>
    <Toast />
    <div v-if="ui.loading" class="page-loading">
      <LoadingSpinner />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import Toast from '@/components/Toast.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUiStore } from '@/stores/ui'
import Navbar from './components/Navbar.vue';

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
