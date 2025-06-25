<!-- src/pages/LoginPage.vue -->
<template>
   <div class="login-page">
      <h2>Login</h2>
      <form @submit.prevent="login">
         <input v-model="email" type="email" placeholder="Email" required />
         <input v-model="password" type="password" placeholder="Password" required />
         <button type="submit" :disabled="loading">
            <span v-if="loading">Yuklanmoqda...</span>
            <span v-else>Login</span>
         </button>
      </form>
      <p v-if="error" class="error-msg">{{ error }}</p>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

async function login() {
   if (!email.value || !password.value) {
      error.value = 'Email va parolni to‘ldiring.'
      return
   }

   loading.value = true
   ui.setLoading(true)
   error.value = ''

   const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
   })

   loading.value = false
   ui.setLoading(false)

   if (loginError) {
      console.error('Login xatosi:', loginError)
      error.value = loginError.message
      ui.showToastMessage(loginError.message || "Tizimga kira olmadingiz")
   } else {
      await auth.fetchUser()
      router.push('/dashboard') // yoki bosh sahifa
   }
}
</script>

<style scoped>
.login-page {
   max-width: 400px;
   margin: 0 auto;
   padding: 2rem;
}

input {
   display: block;
   width: 100%;
   margin-bottom: 1rem;
   padding: 0.5rem;
}

button {
   width: 100%;
   padding: 0.5rem;
   background-color: #eee;
   border: 1px solid #ccc;
   cursor: pointer;
}

.error-msg {
   color: red;
   margin-top: 1rem;
}
</style>
