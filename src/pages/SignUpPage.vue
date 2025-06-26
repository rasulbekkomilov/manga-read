<template>
   <div class="auth-container">
      <div class="auth-card">
         <h2>📝 Ro'yhatdan o'tish</h2>
         <form @submit.prevent="signup">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Parol (kamida 6 ta belgi)" required />
            <button :disabled="loading" type="submit">
               {{ loading ? "Yuklanmoqda..." : "Ro'yhatdan o'tish" }}
            </button>
            <p v-if="error" class="error-msg">{{ error }}</p>
         </form>
         <router-link to="/login" class="switch-link">Hisobingiz bormi? Kirish</router-link>
      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const signup = async () => {
   loading.value = true
   error.value = ''

   const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
   })

   loading.value = false

   if (signUpError) {
      error.value = signUpError.message
      return
   }

   router.push('/login')
   window.location.reload()
}
</script>

<style scoped>
.auth-container {
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 100vh;
   background: #eef1f7;
}

.auth-card {
   background: white;
   padding: 2rem;
   border-radius: 12px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
   width: 100%;
   max-width: 400px;
   text-align: center;
}

.auth-card h2 {
   margin-bottom: 1.2rem;
}

.auth-card input {
   width: 100%;
   padding: 0.75rem;
   margin-bottom: 1rem;
   border-radius: 6px;
   border: 1px solid #ccc;
}

.auth-card button {
   width: 100%;
   padding: 0.75rem;
   background: #27ae60;
   color: white;
   border: none;
   border-radius: 6px;
   cursor: pointer;
}

.auth-card button:hover {
   background: #219150;
}

.switch-link {
   display: block;
   margin-top: 1rem;
   color: #27ae60;
   text-decoration: none;
}

.error-msg {
   color: red;
   font-size: 0.9rem;
   margin-top: 0.5rem;
}
</style>
