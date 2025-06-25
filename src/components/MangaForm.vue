<template>
   <form @submit.prevent="submitManga">
      <h3>Yangi Manga Qo‘shish</h3>

      <input v-model="title" placeholder="Sarlavha" required />
      <textarea v-model="description" placeholder="Tavsif" required />
      <input v-model="status" placeholder="Holat (ongoing/completed)" required />
      <input v-model="coverUrl" placeholder="Cover rasm URL manzili" required />

      <button type="submit">Qo‘shish</button>
   </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useUiStore } from '@/stores/ui'

const emit = defineEmits(['manga-added'])
const ui = useUiStore()

const title = ref('')
const description = ref('')
const status = ref('')
const coverUrl = ref('')

async function submitManga() {
   ui.setLoading(true)

   const { error } = await supabase.from('manga').insert({
      title: title.value,
      description: description.value,
      status: status.value,
      cover_url: coverUrl.value,
   })

   ui.setLoading(false)

   if (error) {
      ui.showToastMessage("Manga qo‘shishda xatolik")
   } else {
      emit('manga-added')
      title.value = ''
      description.value = ''
      status.value = ''
      coverUrl.value = ''
   }
}
</script>

<style scoped>
form {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   padding: 1rem;
   border: 1px solid #ccc;
   border-radius: 6px;
   max-width: 400px;
}

input,
textarea {
   padding: 0.5rem;
   border-radius: 4px;
   border: 1px solid #aaa;
}

button {
   padding: 0.6rem;
   background-color: #2c3e50;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
}

button:hover {
   background-color: #1abc9c;
}
</style>
