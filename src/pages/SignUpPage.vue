<!-- <template>
   <div>
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
         <input v-model="email" type="email" placeholder="Email" required />
         <input v-model="password" type="password" placeholder="Password" required />
         <button type="submit">Signup</button>
      </form>
      <p v-if="error" style="color: red">{{ error }}</p>
      <p>Agar allaqachon ro'yhatdan o'tkan bo'lsangiz <RouterLink to="/login">Kirish sahifasiga o'tish</RouterLink>
      </p>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function signup() {
   const { error: signupError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
         data: { role: 'user' } // oddiy user
      }
   })

   if (signupError) {
      error.value = signupError.message
   } else {
      await auth.fetchUser()
      router.push('/dashboard')
   }
}
</script> -->

<template>
   <div class="auth-container">
      <div class="auth-card">
         <h2>Ro‘yxatdan o‘tish</h2>
         <form @submit.prevent="signup">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Parol" required />
            <button type="submit" :disabled="loading">
               <span v-if="loading">Yuklanmoqda...</span>
               <span v-else>Ro‘yxatdan o‘tish</span>
            </button>
            <p v-if="error" class="error-msg">{{ error }}</p>
         </form>
         <router-link to="/login" class="switch-link">Allaqachon hisobingiz bormi? Kirish</router-link>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const signup = async () => {
   loading.value = true
   error.value = ''
   const { error: signupError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
   })

   loading.value = false

   if (signupError) {
      error.value = signupError.message
   } else {
      router.push('/login')
   }
}
</script>

<style scoped>
/* Bir xil style LoginPage.vue bilan */
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
