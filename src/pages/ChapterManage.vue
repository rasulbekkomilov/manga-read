<template>
   <div class="chapter-manage container">
      <h2>📄 Boblarni Boshqarish</h2>

      <!-- Manga tanlash -->
      <div class="form-group">
         <label for="mangaSelect">Mangani tanlang:</label>
         <select v-model="selectedMangaId" @change="fetchChapters">
            <option disabled value="">Mangani tanlang...</option>
            <option v-for="manga in mangas" :key="manga.id" :value="manga.id">{{ manga.title }}</option>
         </select>
      </div>

      <!-- Bob qo‘shish -->
      <div v-if="selectedMangaId" class="add-chapter">
         <h3>➕ Yangi Bob Qo‘shish</h3>
         <form @submit.prevent="submitChapter">
            <input type="number" v-model="chapterNumber" placeholder="Bob raqami" required />
            <div v-for="(url, index) in pageUrls" :key="index" class="page-input">
               <input v-model="pageUrls[index]" placeholder="Rasm linki (page URL)" />
            </div>
            <button type="button" @click="addPageInput">+ Yana sahifa</button>
            <button type="submit">📤 Yuklash</button>
         </form>
      </div>

      <!-- Boblar ro‘yxati -->
      <div v-if="selectedMangaId" class="chapter-list">
         <h3>📚 Tanlangan Manga Boblari</h3>
         <div v-if="chapters.length">
            <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
               <span>Bob #{{ chapter.number }}</span>
               <button v-if="auth.isAdmin" @click="deleteChapter(chapter.id)">🗑️ O'chirish</button>
            </div>
         </div>
         <p v-else class="no-chapters">Bu mangada boblar yo‘q</p>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'

const mangas = ref([])
const selectedMangaId = ref('')
const chapters = ref([])
const chapterNumber = ref('')
const pageUrls = ref([''])
const auth = useAuthStore()

onMounted(async () => {
   const { data, error } = await supabase.from('manga').select('id, title')
   if (!error) mangas.value = data
})

async function fetchChapters() {
   chapters.value = []
   const { data, error } = await supabase
      .from('chapters')
      .select('id, number')
      .eq('manga_id', selectedMangaId.value)
      .order('number', { ascending: true })

   if (!error) chapters.value = data
}

function addPageInput() {
   pageUrls.value.push('')
}

async function submitChapter() {
   if (!chapterNumber.value || pageUrls.value.every(url => url.trim() === '')) {
      alert('Iltimos, bob raqami va kamida bitta sahifa linkini kiriting.')
      return
   }

   const { data, error } = await supabase.from('chapters').insert({
      manga_id: selectedMangaId.value,
      number: chapterNumber.value,
      pages: pageUrls.value.filter(url => url.trim() !== '')
   })

   if (!error) {
      alert('Bob muvaffaqiyatli qo‘shildi!')
      chapterNumber.value = ''
      pageUrls.value = ['']
      fetchChapters()
   } else {
      console.error(error)
      alert('Xatolik yuz berdi.')
   }
}

async function deleteChapter(id) {
   const confirmDelete = confirm('Bu bobni o‘chirishga ishonchingiz komilmi?')
   if (!confirmDelete) return

   const { error } = await supabase.from('chapters').delete().eq('id', id)
   if (!error) fetchChapters()
}
</script>

<style scoped>
.container {
   max-width: 800px;
   margin: 0 auto;
   padding: 2rem 1rem;
   font-family: 'Segoe UI', sans-serif;
}

h2,
h3 {
   text-align: center;
   margin-bottom: 1rem;
   color: #333;
}

.form-group {
   margin-bottom: 1.5rem;
   text-align: center;
}

select {
   padding: 0.6rem;
   border-radius: 6px;
   font-size: 1rem;
   width: 100%;
   max-width: 300px;
   border: 1px solid #ccc;
}

.add-chapter form {
   display: flex;
   flex-direction: column;
   gap: 0.6rem;
   margin-bottom: 2rem;
   align-items: center;
}

.add-chapter input {
   padding: 0.5rem;
   width: 100%;
   max-width: 400px;
   border-radius: 6px;
   border: 1px solid #ccc;
}

.add-chapter button {
   padding: 0.6rem 1.2rem;
   background-color: #4b7bec;
   color: white;
   border: none;
   border-radius: 6px;
   cursor: pointer;
}

.add-chapter button:hover {
   background-color: #3867d6;
}

.chapter-list {
   border-top: 1px solid #ddd;
   padding-top: 1.5rem;
}

.chapter-item {
   background: #fdfdfd;
   padding: 0.6rem 1rem;
   border: 1px solid #ccc;
   margin-bottom: 0.6rem;
   border-radius: 6px;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.chapter-item button {
   background: #ff5e57;
   color: white;
   border: none;
   padding: 0.4rem 0.8rem;
   border-radius: 4px;
   cursor: pointer;
}

.chapter-item button:hover {
   background: #e74c3c;
}

.no-chapters {
   text-align: center;
   font-style: italic;
   color: #777;
}

@media (max-width: 600px) {

   .add-chapter input,
   select {
      width: 100%;
   }

   .chapter-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.4rem;
   }

   .chapter-item button {
      align-self: flex-end;
   }
}
</style>
