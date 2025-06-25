<template>
   <NavbarVue />
   <div>
      <h2>Welcome, {{ auth.user?.email }}</h2>
      <p>This is the user dashboard.</p>
   </div>
</template>

<script setup>
import NavbarVue from '@/components/Navbar.vue';
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
