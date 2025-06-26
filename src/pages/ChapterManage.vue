<!-- src/components/ChapterForm.vue -->
<template>
   <form @submit.prevent="submitChapter">
      <label>Manga tanlang:</label>
      <select v-model="selectedMangaId" required>
         <option v-for="manga in mangas" :key="manga.id" :value="manga.id">
            {{ manga.title }}
         </option>
      </select>

      <label>Bob raqami:</label>
      <input v-model="chapterNumber" type="number" required />

      <label>Sahifalar (5 ta URL):</label>
      <div v-for="(page, index) in pages" :key="index">
         <input v-model="pages[index]" :placeholder="`Sahifa ${index + 1} URL`" required />
      </div>

      <button type="submit">Yuklash</button>
      <p v-if="message">{{ message }}</p>
   </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const mangas = ref([])
const selectedMangaId = ref('')
const chapterNumber = ref('')
const pages = ref(Array(5).fill(''))
const message = ref('')

onMounted(async () => {
   const { data } = await supabase.from('manga').select('id, title')
   mangas.value = data
})

const submitChapter = async () => {
   const { data, error } = await supabase.from('chapters').insert({
      manga_id: selectedMangaId.value,
      number: chapterNumber.value,
      pages: pages.value // This should be a JSON/array column in Supabase
   })

   if (error) {
      message.value = 'Xatolik: ' + error.message
   } else {
      message.value = 'Bob muvaffaqiyatli yuklandi!'
      chapterNumber.value = ''
      pages.value = Array(5).fill('')
   }
}
</script>
