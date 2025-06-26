<template>
   <Navbar />
   <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Bu sahifa faqat ro‘yxatdan o‘tgan foydalanuvchilar uchun.</p>
   </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';

// Bu sahifa protected route orqali himoyalangan
</script>

<style scoped>
.dashboard {
   color: white;
   padding: 2rem;
}
</style>
