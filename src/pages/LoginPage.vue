<template>
   <div class="auth-container">
      <div class="auth-card">
         <h2>Kirish</h2>
         <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Parol" required />
            <button type="submit" :disabled="loading">
               {{ loading ? 'Yuklanmoqda...' : 'Kirish' }}
            </button>
            <p v-if="error" class="error-msg">{{ error }}</p>
         </form>
         <router-link to="/signup" class="switch-link">Hisob yo‘qmi? Ro‘yxatdan o‘tish</router-link>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const auth = useAuthStore()

async function handleLogin() {
   loading.value = true
   error.value = ''

   const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
   })

   loading.value = false

   if (loginError) {
      error.value = loginError.message
   } else {
      await auth.fetchUser()
      window.location.href = '/dashboard' // reload bilan
   }
}
</script>
<style scoped>
.auth-container {
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 100vh;
   background: #f2f3f8;
}

.auth-card {
   background: white;
   padding: 2.5rem;
   border-radius: 12px;
   box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
   width: 100%;
   max-width: 400px;
   text-align: center;
}

.auth-card h2 {
   margin-bottom: 1.5rem;
   color: #333;
}

.auth-card form input {
   display: block;
   width: 100%;
   padding: 0.75rem;
   margin-bottom: 1rem;
   border-radius: 6px;
   border: 1px solid #ccc;
   font-size: 1rem;
}

.auth-card button {
   width: 100%;
   padding: 0.75rem;
   background: #4b7bec;
   border: none;
   border-radius: 6px;
   color: white;
   font-size: 1rem;
   cursor: pointer;
   transition: background 0.3s ease;
}

.auth-card button:hover {
   background: #3867d6;
}

.error-msg {
   margin-top: 0.75rem;
   color: red;
   font-size: 0.9rem;
}

.switch-link {
   display: block;
   margin-top: 1.25rem;
   color: #4b7bec;
   text-decoration: none;
   font-size: 0.95rem;
}
</style>
