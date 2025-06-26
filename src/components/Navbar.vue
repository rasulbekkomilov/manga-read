<!-- src/components/Navbar.vue -->
<template>
   <nav class="navbar">
      <router-link to="/" class="logo">📖 MangaSite</router-link>

      <div class="nav-links">
         <router-link v-if="!auth.user" to="/login">Kirish</router-link>
         <router-link v-if="!auth.user" to="/signup">Ro‘yxatdan o‘tish</router-link>

         <router-link v-if="auth.isAdmin" to="/admin">🛠 Admin Panel</router-link>
         <router-link v-if="auth.user" to="/dashboard">Dashboard</router-link>

         <button v-if="auth.user" @click="logout">Chiqish</button>
      </div>
   </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'

const auth = useAuthStore()

async function logout() {
   await supabase.auth.signOut()
   window.location.reload();
   auth.clearUser()
   window.location.href = '/'
}
</script>

<style scoped>
.navbar {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 1rem 2rem;
   background: #4b7bec;
   color: white;
}

.logo {
   font-weight: bold;
   font-size: 1.2rem;
   color: white;
   text-decoration: none;
}

.nav-links {
   display: flex;
   gap: 1rem;
   align-items: center;
}

.nav-links a,
.nav-links button {
   color: white;
   background: transparent;
   border: none;
   cursor: pointer;
   font-size: 1rem;
   text-decoration: none;
}

.nav-links button:hover,
.nav-links a:hover {
   text-decoration: underline;
}
</style>
