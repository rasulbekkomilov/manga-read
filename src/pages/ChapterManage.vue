<template>
   <div class="chapter-manage">
      <h1>📄 Boblarni boshqarish</h1>

      <form @submit.prevent="addChapter" class="chapter-form">
         <label>
            Manga:
            <select v-model="newChapter.manga_id" required>
               <option value="" disabled selected>Tanlang</option>
               <option v-for="manga in mangaList" :key="manga.id" :value="manga.id">
                  {{ manga.title }}
               </option>
            </select>
         </label>

         <label>
            Bob raqami:
            <input type="number" v-model="newChapter.number" required />
         </label>

         <div class="page-list">
            <label>Rasm URLlari (5ta majburiy):</label>
            <div v-for="(page, index) in newChapter.pages" :key="index">
               <input type="url" v-model="newChapter.pages[index]" placeholder="Rasm URL" required />
            </div>

            <button v-if="newChapter.pages.length < 20" type="button" class="add-page-btn" @click="addPageField">
               ➕ Qo‘shimcha sahifa
            </button>
         </div>

         <button class="submit-btn" type="submit">➕ Bob qo‘shish</button>
      </form>

      <hr />

      <div class="chapter-list">
         <h2>🗂️ Mavjud boblar</h2>
         <div v-if="chapters.length === 0" class="empty">Boblar hali mavjud emas.</div>
         <ul>
            <li v-for="chapter in chapters" :key="chapter.id">
               <strong>{{ getMangaTitle(chapter.manga_id) }}</strong> - Bob {{ chapter.number }}
               <button @click="deleteChapter(chapter.id)">🗑️ O‘chirish</button>
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const mangaList = ref([])
const chapters = ref([])

const newChapter = ref({
   manga_id: '',
   number: '',
   pages: ['', '', '', '', ''] // 5ta boshlang‘ich input
})

// Mangalarni olish
async function fetchManga() {
   const { data, error } = await supabase.from('manga').select('id, title')
   if (!error) mangaList.value = data
}

// Boblarni olish
async function fetchChapters() {
   const { data } = await supabase
      .from('chapters')
      .select('*')
      .order('created_at', { ascending: false })

   chapters.value = data || []
}

// Bob qo‘shish
async function addChapter() {
   const { error } = await supabase.from('chapters').insert([newChapter.value])
   if (!error) {
      await fetchChapters()
      resetForm()
   }
}

// Bob o‘chirish
async function deleteChapter(id) {
   await supabase.from('chapters').delete().eq('id', id)
   await fetchChapters()
}

// Qo‘shimcha sahifa inputi
function addPageField() {
   if (newChapter.value.pages.length < 20) {
      newChapter.value.pages.push('')
   }
}

// Manga nomini ID orqali olish
function getMangaTitle(id) {
   const manga = mangaList.value.find(m => m.id === id)
   return manga ? manga.title : 'Noma’lum'
}

// Formani tozalash
function resetForm() {
   newChapter.value = {
      manga_id: '',
      number: '',
      pages: ['', '', '', '', '']
   }
}

onMounted(async () => {
   await fetchManga()
   await fetchChapters()
})
</script>

<style scoped>
.chapter-manage {
   max-width: 850px;
   margin: 2rem auto;
   padding: 1rem;
   font-family: 'Segoe UI', sans-serif;
}

.chapter-form {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   background: #f8f9fc;
   padding: 1.5rem;
   border-radius: 10px;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.chapter-form label {
   display: flex;
   flex-direction: column;
   font-weight: 500;
   color: #333;
}

.chapter-form input,
.chapter-form select {
   padding: 0.6rem;
   margin-top: 0.3rem;
   border-radius: 6px;
   border: 1px solid #ccc;
}

.page-list input {
   margin-bottom: 0.5rem;
}

.add-page-btn {
   background: #e0f0ff;
   border: none;
   padding: 0.5rem 1rem;
   border-radius: 6px;
   cursor: pointer;
   margin-top: 0.5rem;
   transition: background 0.3s;
}

.add-page-btn:hover {
   background: #d0e7ff;
}

.submit-btn {
   background: #4caf50;
   color: white;
   border: none;
   padding: 0.75rem;
   border-radius: 6px;
   font-size: 1rem;
   cursor: pointer;
}

.submit-btn:hover {
   background: #45a045;
}

.chapter-list {
   margin-top: 2rem;
}

.chapter-list ul {
   list-style: none;
   padding: 0;
}

.chapter-list li {
   padding: 0.75rem;
   background: #f1f3f5;
   margin-bottom: 0.5rem;
   border-radius: 6px;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.chapter-list button {
   background: transparent;
   border: none;
   color: red;
   font-size: 1.1rem;
   cursor: pointer;
}

.empty {
   color: #777;
   font-style: italic;
}
</style>
