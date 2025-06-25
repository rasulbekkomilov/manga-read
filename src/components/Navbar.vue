<template>
   <nav>
      <router-link to="/">Home</router-link>
      <router-link v-if="!auth.user" to="/login">Login</router-link>
      <router-link v-if="!auth.user" to="/signup">Signup</router-link>

      <div v-if="auth.user">
         <router-link to="/dashboard">Dashboard</router-link>
         <router-link v-if="auth.isAdmin" to="/admin">Admin Panel</router-link>
         <button @click="logout">Logout</button>
      </div>
   </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = async () => {
   await auth.logout()
   router.push('/login')
}
</script>
<style>
nav {
   display: flex;
   justify-content: space-between;
   align-items: center;
   background-color: #2c3e50;
   padding: 1rem 2rem;
   color: white;
}

nav a {
   color: white;
   text-decoration: none;
   margin-right: 1.5rem;
   font-weight: 500;
   transition: color 0.3s ease;
}

nav a:last-child {
   margin-right: 0;
}

nav a:hover {
   color: #1abc9c;
}

button {
   border: 1px solid white;
   padding: 0.5rem 1rem;
   border-radius: 5px;
   cursor: pointer;
   transition: all 0.3s ease;
   margin-left: 1rem;
}

button:hover {
   background-color: #1abc9c;
   border-color: #1abc9c;
   color: #2c3e50;
}

/* Responsive - mobil ekranlar uchun */
@media (max-width: 768px) {
   nav {
      flex-direction: column;
      align-items: flex-start;
   }

   nav a,
   button {
      margin: 0.5rem 0;
   }
}
</style>