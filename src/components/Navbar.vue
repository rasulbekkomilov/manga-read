<template>
   <nav class="navbar">
      <router-link class="logo" to="/">📖 MangaZone</router-link>

      <ul class="nav-links">
         <li><router-link to="/">Bosh sahifa</router-link></li>
         <li v-if="isLoggedIn"><router-link to="/dashboard">Dashboard</router-link></li>
         <li v-if="isAdmin"><router-link to="/admin">Admin Panel</router-link></li>
         <li v-if="!isLoggedIn"><router-link to="/login">Kirish</router-link></li>
         <li v-if="!isLoggedIn"><router-link to="/signup">Ro'yhatdan o'tish</router-link></li>
         <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Chiqish</a></li>
      </ul>
   </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'

const router = useRouter()
const auth = useAuthStore()
const isAdmin = ref(false)
const isLoggedIn = ref(false)

onMounted(async () => {
   await auth.fetchUser()
   isLoggedIn.value = !!auth.user

   if (auth.user) {
      const { data } = await supabase
         .from('admin_users')
         .select('*')
         .eq('user_id', auth.user.id)
         .single()

      isAdmin.value = !!data
   }
})

const logout = async () => {
   await supabase.auth.signOut()
   isLoggedIn.value = false
   isAdmin.value = false
   router.push('/')
}
</script>

<style scoped>
.navbar {
   display: flex;
   justify-content: space-between;
   align-items: center;
   background: #2e2e3a;
   color: #fff;
   padding: 1rem 2rem;
}

.logo {
   font-size: 1.4rem;
   font-weight: bold;
   color: #fff;
   text-decoration: none;
}

.nav-links {
   display: flex;
   gap: 1.2rem;
   list-style: none;
   align-items: center;
}

.nav-links a,
.nav-links router-link {
   color: #fff;
   text-decoration: none;
   font-weight: 500;
   transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links router-link:hover {
   color: #00bcd4;
}

a {
   cursor: pointer;
}
</style>
