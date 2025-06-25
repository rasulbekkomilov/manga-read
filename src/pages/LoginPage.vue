<template>
   <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
         <input v-model="email" type="email" placeholder="Email" required />
         <input v-model="password" type="password" placeholder="Password" required />
         <button type="submit" :disabled="loading">
            <span v-if="loading">Yuklanmoqda...</span>
            <span v-else>Login</span>
         </button>
      </form>
      <p v-if="error" style="color: red">{{ error }}</p>
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
      ui.showToastMessage("Tarmoqda muammo, qaytadan urining")
      error.value = loginError.message
   } else {
      await auth.fetchUser()
      router.push('/dashboard')
   }
}
</script>

<style>
button {
   color: black;
   border: 1px solid #ccc;
}
</style>