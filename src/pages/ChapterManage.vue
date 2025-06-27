<template>
   <div class="container">
      <h2 class="title">📄 Boblarni Boshqarish</h2>

      <!-- Manga tanlash -->
      <div class="form-group">
         <label for="mangaSelect">Mangani tanlang:</label>
         <select v-model="selectedMangaId" @change="fetchChapters">
            <option disabled value="">Mangani tanlang...</option>
            <option v-for="manga in mangas" :key="manga.id" :value="manga.id">
               {{ manga.title }}
            </option>
         </select>
      </div>

      <!-- Bob qo‘shish -->
      <div v-if="selectedMangaId" class="form-group">
         <label>Yangi bob raqami:</label>
         <input type="number" v-model.number="newChapterNumber" placeholder="Masalan: 1" />

         <label>Slug (Qo‘lda yoziladi):</label>
         <input type="text" v-model="newSlug" placeholder="Masalan: kagurabachi_1-bob" />

         <label>Rasm linklari:</label>
         <div class="page-inputs">
            <input v-for="(link, index) in pageLinks" :key="index" v-model="pageLinks[index]" type="text"
               :placeholder="`Page ${index + 1} link`" @input="handlePageInput(index)" />
         </div>

         <button class="btn primary" @click="addChapter">➕ Bob qo‘shish</button>
      </div>

      <!-- Boblar ro‘yxati -->
      <div v-if="selectedMangaId" class="chapters-section">
         <h3>📚 Tanlangan manga boblari</h3>

         <div v-if="chapters.length > 0" class="chapter-list">
            <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
               <span>Bob #{{ chapter.number }} ({{ chapter.slug }})</span>
               <button class="btn danger" @click="deleteChapter(chapter.id)">🗑️ O‘chirish</button>
            </div>
         </div>
         <p v-else class="no-chapters">Bu mangada boblar yo‘q</p>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const mangas = ref([])
const chapters = ref([])
const selectedMangaId = ref('')
const newChapterNumber = ref(null)
const newSlug = ref('')
const pageLinks = ref([''])

onMounted(async () => {
   const { data, error } = await supabase.from('manga').select('id, title')
   if (!error) mangas.value = data
})

async function fetchChapters() {
   chapters.value = []
   if (!selectedMangaId.value) return

   const { data, error } = await supabase
      .from('chapters')
      .select('id, number, slug')
      .eq('manga_id', selectedMangaId.value)
      .order('number', { ascending: true })

   if (!error) chapters.value = data
}

function handlePageInput(index) {
   if (index === pageLinks.value.length - 1 && pageLinks.value[index].trim() !== '') {
      pageLinks.value.push('')
   }
}

async function addChapter() {
   if (!newChapterNumber.value || !newSlug.value || !pageLinks.value.some(link => link.trim())) {
      alert("Iltimos, barcha maydonlarni to‘ldiring.")
      return
   }

   const { error } = await supabase.from('chapters').insert({
      number: newChapterNumber.value,
      slug: newSlug.value,
      pages: pageLinks.value.filter(link => link.trim() !== ''),
      manga_id: selectedMangaId.value,
   })

   if (!error) {
      newChapterNumber.value = null
      newSlug.value = ''
      pageLinks.value = ['']
      fetchChapters()
   } else {
      alert("Bob qo‘shishda xatolik: " + error.message)
   }
}

async function deleteChapter(id) {
   const confirmDelete = confirm('Rostdan ham bu bobni o‘chirmoqchimisiz?')
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

.title {
   font-size: 1.8rem;
   text-align: center;
   margin-bottom: 2rem;
}

.form-group {
   margin-bottom: 1.5rem;
}

input,
select {
   width: 100%;
   max-width: 400px;
   padding: 0.6rem;
   margin-top: 0.4rem;
   margin-bottom: 0.8rem;
   border-radius: 6px;
   border: 1px solid #ccc;
   font-size: 1rem;
}

.page-inputs {
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
}

.chapters-section {
   background-color: #f9f9f9;
   padding: 1rem;
   border-radius: 8px;
   border: 1px solid #ddd;
}

.chapter-list {
   margin-top: 1rem;
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
}

.chapter-item {
   background: #fff;
   padding: 0.6rem 1rem;
   border-radius: 6px;
   border: 1px solid #ccc;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.btn {
   padding: 0.5rem 0.9rem;
   font-size: 0.95rem;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   margin-left: 0.5rem;
}

.btn.primary {
   background-color: #3498db;
   color: #fff;
}

.btn.danger {
   background-color: #e74c3c;
   color: #fff;
}

.no-chapters {
   margin-top: 1rem;
   font-style: italic;
   color: #777;
}

@media (max-width: 600px) {
   .chapter-item {
      flex-direction: column;
      align-items: flex-start;
   }
}
</style>
