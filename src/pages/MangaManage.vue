<template>
   <div class="container">
      <h2 class="title">📚 Manga Qo‘shish</h2>

      <!-- Manga form -->
      <div class="form-group">
         <label>Nomi:</label>
         <input v-model="newManga.title" type="text" placeholder="Manga nomi" />

         <label>Slug (url):</label>
         <input v-model="newManga.slug" type="text" placeholder="slug-nomi" />

         <label>Cover rasmi (link):</label>
         <input v-model="newManga.cover_url" type="text" placeholder="https://image.url" />

         <label>Holati:</label>
         <select v-model="newManga.status">
            <option value="ongoing">Davom etmoqda</option>
            <option value="completed">Tugagan</option>
            <option value="hiatus">Pauzada</option>
            <option value="cancelled">To‘xtatilgan</option>
         </select>

         <label>Janrlar (vergul bilan):</label>
         <input v-model="newManga.genres" type="text" placeholder="action, adventure, fantasy" />

         <label>Tavsif:</label>
         <textarea v-model="newManga.description" placeholder="Manga haqida qisqacha..." rows="3"></textarea>

         <button class="btn primary" @click="submitManga">➕ Qo‘shish</button>
      </div>

      <!-- Mavjud mangalar ro‘yxati -->
      <div class="manga-list">
         <h3>📖 Mavjud Mangalar</h3>
         <div v-for="manga in mangas" :key="manga.id" class="manga-card">
            <div>
               <strong>{{ manga.title }}</strong>
               <small style="display: block; color: gray">Slug: {{ manga.slug }}</small>
            </div>
            <div>
               <button class="btn edit" @click="editManga(manga)">✏️</button>
               <button class="btn danger" @click="deleteManga(manga.id)">🗑️</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const newManga = ref({
   title: '',
   slug: '',
   cover_url: '',
   status: 'ongoing',
   genres: '',
   description: ''
})

const mangas = ref([])

onMounted(fetchMangas)

async function fetchMangas() {
   const { data, error } = await supabase.from('manga').select('*').order('created_at', { ascending: false })
   if (!error) mangas.value = data
}

async function submitManga() {
   if (!newManga.value.title || !newManga.value.slug) return

   const { error } = await supabase.from('manga').insert({
      ...newManga.value,
      genres: newManga.value.genres.split(',').map(g => g.trim())
   })

   if (!error) {
      newManga.value = {
         title: '', slug: '', cover_url: '', status: 'ongoing', genres: '', description: ''
      }
      fetchMangas()
   }
}

async function deleteManga(id) {
   const confirmDelete = confirm('Rostdan ham bu mangani o‘chirmoqchimisiz?')
   if (!confirmDelete) return

   const { error } = await supabase.from('manga').delete().eq('id', id)
   if (!error) fetchMangas()
}

function editManga(manga) {
   newManga.value = {
      title: manga.title,
      slug: manga.slug,
      cover_url: manga.cover_url,
      status: manga.status,
      genres: manga.genres.join(', '),
      description: manga.description || ''
   }
   deleteManga(manga.id)
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
   margin-bottom: 2rem;
}

input,
select,
textarea {
   width: 100%;
   padding: 0.6rem;
   margin-bottom: 1rem;
   border-radius: 6px;
   border: 1px solid #ccc;
   font-size: 1rem;
   box-sizing: border-box;
}

.btn {
   padding: 0.5rem 1rem;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   margin-right: 0.5rem;
   font-size: 0.95rem;
}

.btn.primary {
   background-color: #3498db;
   color: white;
}

.btn.danger {
   background-color: #e74c3c;
   color: white;
}

.btn.edit {
   background-color: #f39c12;
   color: white;
}

.manga-list {
   background: #f9f9f9;
   border: 1px solid #ddd;
   padding: 1rem;
   border-radius: 8px;
}

.manga-card {
   display: flex;
   justify-content: space-between;
   padding: 0.8rem;
   border-bottom: 1px solid #ccc;
   align-items: center;
}

@media (max-width: 600px) {
   .manga-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
   }
}
</style>
