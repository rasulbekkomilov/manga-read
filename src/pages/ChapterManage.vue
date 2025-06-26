<template>
   <div class="chapter-form">
      <h2>📥 Bob Yuklash</h2>

      <form @submit.prevent="submitChapter">
         <div>
            <label>Manga tanlang:</label>
            <select v-model="selectedMangaId" required>
               <option disabled value="">-- Manga tanlang --</option>
               <option v-for="m in mangas" :key="m.id" :value="m.id">
                  {{ m.title }}
               </option>
            </select>
         </div>

         <div>
            <label>Bob raqami:</label>
            <input v-model="chapterNumber" type="number" required />
         </div>

         <div class="pages-section">
            <label>Sahifalar:</label>
            <div v-for="(url, index) in pages" :key="index" class="page-input">
               <input v-model="pages[index]" type="text" :placeholder="`Sahifa ${index + 1} URL`" required />
            </div>
            <button type="button" @click="addPage" class="add-page-btn">➕ Yana sahifa qo‘shish</button>
         </div>

         <button type="submit" class="submit-btn">✅ Yuklash</button>
      </form>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const selectedMangaId = ref('')
const chapterNumber = ref('')
const pages = ref(['', '', '', '', '']) // Default 5 ta input
const mangas = ref([])

onMounted(async () => {
   const { data, error } = await supabase.from('manga').select('id, title')
   if (!error) mangas.value = data
})

function addPage() {
   pages.value.push('')
}

async function submitChapter() {
   if (!selectedMangaId.value || !chapterNumber.value || pages.value.some(p => !p)) {
      alert('Iltimos, barcha maydonlarni to‘ldiring.')
      return
   }

   const { error } = await supabase.from('chapters').insert({
      manga_id: selectedMangaId.value,
      number: chapterNumber.value,
      pages: pages.value
   })

   if (error) {
      console.error('Bobni yuklashda xatolik:', error)
      alert('Xatolik yuz berdi')
   } else {
      alert('Bob muvaffaqiyatli yuklandi!')
      // Tozalash
      selectedMangaId.value = ''
      chapterNumber.value = ''
      pages.value = ['', '', '', '', '']
   }
}
</script>

<style scoped>
.chapter-form {
   max-width: 600px;
   margin: auto;
   background: #fff;
   padding: 2rem;
   border-radius: 10px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

label {
   display: block;
   margin-top: 1rem;
   font-weight: 500;
}

input,
select {
   width: 100%;
   padding: 0.5rem;
   margin-top: 0.3rem;
   border: 1px solid #ccc;
   border-radius: 5px;
}

.pages-section {
   margin-top: 1rem;
}

.page-input {
   margin-bottom: 0.5rem;
}

.add-page-btn {
   background-color: #f0f0f0;
   border: none;
   padding: 0.4rem 0.8rem;
   cursor: pointer;
   border-radius: 5px;
   margin-top: 0.5rem;
}

.add-page-btn:hover {
   background-color: #e0e0e0;
}

.submit-btn {
   margin-top: 2rem;
   padding: 0.6rem 1.2rem;
   background-color: #4caf50;
   color: white;
   border: none;
   border-radius: 6px;
   cursor: pointer;
}

.submit-btn:hover {
   background-color: #45a049;
}
</style>
