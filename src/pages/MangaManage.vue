<template>
   <div class="manage-container">
      <h2>Manga Qo‘shish</h2>

      <form @submit.prevent="submitManga" class="manga-form">
         <input v-model="title" type="text" placeholder="Nomi" required />
         <input v-model="cover_url" type="url" placeholder="Cover URL" required />
         <textarea v-model="description" placeholder="Tavsifi"></textarea>
         <select v-model="status" required>
            <option value="" disabled selected>Holatini tanlang</option>
            <option value="davom etmoqda">Davom etmoqda</option>
            <option value="tugagan">Tugagan</option>
            <option value="pauzada">Pauzada</option>
            <option value="to‘xtatilgan">To‘xtatilgan</option>
         </select>
         <input v-model="genresInput" type="text" placeholder="Janrlar (vergul bilan)" />
         <button type="submit">{{ editingId ? 'Saqlash' : 'Qo‘shish' }}</button>
      </form>

      <div class="manga-list">
         <h3>📚 Qo‘shilgan Mangalar</h3>
         <p v-if="mangas.length === 0">Hali manga qo‘shilmagan.</p>
         <div v-else class="manga-cards">
            <div class="manga-card" v-for="m in mangas" :key="m.id">
               <img :src="m.cover_url" alt="cover" />
               <div class="info">
                  <h4>{{ m.title }}</h4>
                  <p>{{ m.status }}</p>
                  <p class="desc">{{ m.description || 'Tavsif yo‘q' }}</p>
                  <div class="actions">
                     <button @click="editManga(m)">✏️</button>
                     <button @click="deleteManga(m.id)">🗑</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const title = ref('')
const description = ref('')
const status = ref('')
const cover_url = ref('')
const genresInput = ref('')
const editingId = ref(null)
const mangas = ref([])

onMounted(fetchMangas)

async function fetchMangas() {
   const { data } = await supabase.from('manga').select('*').order('created_at', { ascending: false })
   mangas.value = data || []
}

async function submitManga() {
   const genreArray = genresInput.value.split(',').map(g => g.trim()).filter(Boolean)

   const payload = {
      title: title.value,
      description: description.value,
      status: status.value,
      cover_url: cover_url.value,
      genres: genreArray,
   }

   if (editingId.value) {
      await supabase.from('manga').update(payload).eq('id', editingId.value)
      editingId.value = null
   } else {
      await supabase.from('manga').insert(payload)
   }

   title.value = ''
   description.value = ''
   status.value = ''
   cover_url.value = ''
   genresInput.value = ''

   fetchMangas()
}

function editManga(m) {
   title.value = m.title
   description.value = m.description
   status.value = m.status
   cover_url.value = m.cover_url
   genresInput.value = m.genres?.join(', ') || ''
   editingId.value = m.id
}

async function deleteManga(id) {
   if (confirm('Rostdan ham o‘chirmoqchimisiz?')) {
      await supabase.from('manga').delete().eq('id', id)
      fetchMangas()
   }
}
</script>

<style scoped>
.manage-container {
   max-width: 1000px;
   margin: auto;
   padding: 2rem 1rem;
   font-family: 'Segoe UI', sans-serif;
}

.manga-form {
   display: grid;
   gap: 1rem;
   margin-bottom: 2rem;
}

.manga-form input,
.manga-form textarea,
.manga-form select {
   padding: 0.7rem;
   font-size: 1rem;
   border: 1px solid #ccc;
   border-radius: 6px;
}

.manga-form button {
   padding: 0.8rem;
   background: #4b7bec;
   color: white;
   border: none;
   border-radius: 6px;
   font-weight: bold;
   cursor: pointer;
}

.manga-list {
   margin-top: 2rem;
}

.manga-cards {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
   gap: 1rem;
}

.manga-card {
   background: #fff;
   border: 1px solid #ddd;
   border-radius: 10px;
   overflow: hidden;
   display: flex;
   flex-direction: column;
}

.manga-card img {
   width: 100%;
   height: 300px;
   object-fit: cover;
}

.info {
   padding: 0.75rem;
}

.info h4 {
   margin: 0;
   font-size: 1.1rem;
   color: #333;
}

.info .desc {
   font-size: 0.9rem;
   color: #666;
   margin: 0.5rem 0;
   height: 60px;
   overflow: hidden;
}

.actions {
   display: flex;
   justify-content: flex-end;
   gap: 0.5rem;
}

.actions button {
   background: transparent;
   border: none;
   font-size: 1.1rem;
   cursor: pointer;
}
</style>
