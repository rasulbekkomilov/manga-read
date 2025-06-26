<template>
   <div>
      <h2>Sign Up</h2>
      <form @submit.prevent="signup">
         <input v-model="email" type="email" placeholder="Email" required />
         <input v-model="password" type="password" placeholder="Password" required />
         <button type="submit">Signup</button>
      </form>
      <p v-if="error" style="color: red">{{ error }}</p>
      <p>Agar allaqachon ro'yhatdan o'tkan bo'lsangiz <RouterLink to="/login">Kirish sahifasiga o'tish</RouterLink></p>
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
</script>
