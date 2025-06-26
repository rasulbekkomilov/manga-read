<template>
   <div class="manga-manage">
      <h2>📘 Manga Boshqaruvi</h2>

      <form @submit.prevent="submitForm" class="manga-form">
         <input v-model="form.title" type="text" placeholder="Manga nomi" required />
         <textarea v-model="form.description" placeholder="Manga tavsifi"></textarea>
         <input v-model="form.cover_url" type="text" placeholder="Cover URL" required />
         <select v-model="form.status">
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
         </select>
         <button type="submit">{{ editingId ? 'Saqlash' : 'Qo‘shish' }}</button>
      </form>

      <div class="manga-list">
         <h3>📚 Mavjud Mangalar</h3>
         <ul>
            <li v-for="manga in mangas" :key="manga.id">
               <div>
                  <strong>{{ manga.title }}</strong> — <small>{{ manga.status }}</small>
               </div>
               <div class="actions">
                  <button @click="editManga(manga)">✏️</button>
                  <button @click="deleteManga(manga.id)">🗑</button>
               </div>
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const mangas = ref([])
const editingId = ref(null)
const form = ref({
   title: '',
   description: '',
   cover_url: '',
   status: 'ongoing',
})

async function fetchMangas() {
   const { data, error } = await supabase.from('manga').select('*').order('created_at', { ascending: false })
   if (!error) mangas.value = data
}

async function submitForm() {
   if (!form.value.title || !form.value.cover_url) return

   if (editingId.value) {
      // Update
      await supabase.from('manga').update(form.value).eq('id', editingId.value)
      editingId.value = null
   } else {
      // Insert
      await supabase.from('manga').insert([form.value])
   }

   await fetchMangas()
   resetForm()
}

function resetForm() {
   form.value = {
      title: '',
      description: '',
      cover_url: '',
      status: 'ongoing',
   }
   editingId.value = null
}

function editManga(manga) {
   form.value = { ...manga }
   editingId.value = manga.id
}

async function deleteManga(id) {
   const confirmDelete = confirm('Haqiqatan ham o‘chirmoqchimisiz?')
   if (confirmDelete) {
      await supabase.from('manga').delete().eq('id', id)
      await fetchMangas()
   }
}

onMounted(fetchMangas)
</script>

<style scoped>
.manga-manage {
   max-width: 800px;
   margin: 2rem auto;
   padding: 2rem;
   background: #fff;
   border-radius: 12px;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
   font-family: sans-serif;
}

.manga-form {
   display: flex;
   flex-direction: column;
   gap: 1rem;
   margin-bottom: 2rem;
}

.manga-form input,
.manga-form textarea,
.manga-form select {
   padding: 0.5rem;
   border: 1px solid #ccc;
   border-radius: 6px;
}

.manga-form button {
   background: #4a90e2;
   color: white;
   border: none;
   padding: 0.6rem;
   cursor: pointer;
   border-radius: 6px;
   transition: background 0.2s;
}

.manga-form button:hover {
   background: #3578c2;
}

.manga-list ul {
   list-style: none;
   padding: 0;
}

.manga-list li {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0.75rem;
   border-bottom: 1px solid #eee;
}

.actions button {
   margin-left: 0.5rem;
   background: transparent;
   border: none;
   cursor: pointer;
   font-size: 1.2rem;
}
</style>
