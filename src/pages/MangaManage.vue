<template>
   <div class="manga-form">
      <h2>Yangi Manga Qo'shish</h2>
      <form @submit.prevent="addManga">
         <label>
            Manga nomi:
            <input v-model="title" type="text" required />
         </label>

         <label>
            Cover URL (rasm manzili):
            <input v-model="coverUrl" type="url" required />
         </label>

         <label>
            Status:
            <select v-model="status" required>
               <option disabled value="">Tanlang</option>
               <option value="ongoing">Ongoing</option>
               <option value="completed">Completed</option>
               <option value="translating">Being Translated</option>
            </select>
         </label>

         <button type="submit" :disabled="loading">
            <span v-if="loading">Yuklanmoqda...</span>
            <span v-else>Qo'shish</span>
         </button>
      </form>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
   </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'

const title = ref('')
const coverUrl = ref('')
const status = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)

async function addManga() {
   loading.value = true
   message.value = ''
   error.value = ''

   const { data, err } = await supabase.from('manga').insert([
      {
         title: title.value,
         cover_url: coverUrl.value,
         status: status.value,
      },
   ])

   loading.value = false

   if (err) {
      error.value = 'Xatolik yuz berdi: ' + err.message
   } else {
      message.value = 'Manga muvaffaqiyatli qoshildi!'
      title.value = ''
      coverUrl.value = ''
      status.value = ''
   }
}
</script>

<style scoped>
.manga-form {
   max-width: 400px;
   margin: auto;
   background: #1a1a1a;
   padding: 20px;
   border-radius: 10px;
   color: #fff;
}

.manga-form h2 {
   text-align: center;
   margin-bottom: 1rem;
}

label {
   display: block;
   margin-bottom: 1rem;
}

input,
select {
   width: 100%;
   padding: 8px;
   background: #2a2a2a;
   border: 1px solid #555;
   border-radius: 4px;
   color: white;
}

button {
   width: 100%;
   padding: 10px;
   background-color: #4caf50;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
}

button:disabled {
   background-color: #888;
   cursor: not-allowed;
}

.success {
   color: #00e676;
   margin-top: 10px;
}

.error {
   color: #ff5252;
   margin-top: 10px;
}
</style>
