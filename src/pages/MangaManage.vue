<template>
   <div class="manga-form-container">
      <div class="form-card">
         <h2>📚 Manga Qo‘shish</h2>
         <form @submit.prevent="submitManga">
            <!-- Manga nomi -->
            <input v-model="title" type="text" placeholder="Manga nomi" required />

            <!-- Cover link -->
            <input v-model="coverUrl" type="url" placeholder="Cover URL (rasm manzili)" required />
            <div v-if="coverUrl" class="preview">
               <img :src="coverUrl" alt="Cover preview" />
            </div>

            <!-- Janr tanlash -->
            <div class="genres">
               <label v-for="g in genreList" :key="g">
                  <input type="checkbox" :value="g" v-model="genres" />
                  {{ g }}
               </label>
            </div>

            <!-- Holat -->
            <select v-model="status" required>
               <option disabled value="">Holatini tanlang</option>
               <option value="tugagan">Tugagan</option>
               <option value="davom etyapti">Davom etyapti</option>
               <option value="to‘xtatilgan">To‘xtatilgan</option>
               <option value="pauzada">Pauzada</option>
            </select>

            <button type="submit" :disabled="loading">
               <span v-if="loading">Yuklanmoqda...</span>
               <span v-else>Qo‘shish</span>
            </button>
         </form>
      </div>

      <div class="chapters-card">
         <h3>📄 Mavjud boblar</h3>
         <div v-if="chapters.length">
            <ul>
               <li v-for="ch in chapters" :key="ch.id">
                  Bob #{{ ch.number }} - {{ ch.created_at.split('T')[0] }}
               </li>
            </ul>
         </div>
         <div v-else>
            <p>⛔ Hali boblar mavjud emas.</p>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const title = ref('')
const genres = ref([])
const status = ref('')
const coverUrl = ref('')
const loading = ref(false)
const chapters = ref([])

const genreList = [
   'Action', 'Adventure', 'Fantasy', 'Romance', 'Comedy',
   'Drama', 'Horror', 'Mystery', 'Sci-Fi', 'Slice of Life'
]

async function submitManga() {
   if (!title.value || !status.value || genres.value.length === 0 || !coverUrl.value) return

   loading.value = true
   try {
      const { error } = await supabase.from('manga').insert([{
         title: title.value,
         genres: genres.value,
         status: status.value,
         cover_url: coverUrl.value
      }])

      if (error) throw error

      alert('✅ Manga muvaffaqiyatli qo‘shildi')
      title.value = ''
      genres.value = []
      status.value = ''
      coverUrl.value = ''
      fetchChapters()
   } catch (err) {
      console.error(err)
      alert('❌ Manga qo‘shishda xatolik')
   }
   loading.value = false
}

async function fetchChapters() {
   const { data, error } = await supabase
      .from('chapters')
      .select('id, number, created_at')
      .order('created_at', { ascending: false })

   if (!error) chapters.value = data
}

onMounted(fetchChapters)
</script>

<style scoped>
.manga-form-container {
   display: flex;
   flex-wrap: wrap;
   gap: 2rem;
   justify-content: center;
   padding: 2rem;
}

.form-card,
.chapters-card {
   flex: 1 1 400px;
   background: #fff;
   padding: 2rem;
   border-radius: 10px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2,
h3 {
   margin-bottom: 1rem;
   color: #333;
}

form input,
form select {
   display: block;
   width: 100%;
   margin-bottom: 1rem;
   padding: 0.75rem;
   border-radius: 6px;
   border: 1px solid #ccc;
   font-size: 1rem;
}

.genres {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
   gap: 0.5rem;
   margin-bottom: 1rem;
}

.genres label {
   font-size: 0.95rem;
   display: flex;
   align-items: center;
   gap: 0.4rem;
}

.preview img {
   width: 100%;
   max-height: 200px;
   object-fit: contain;
   margin-bottom: 1rem;
   border: 1px solid #ccc;
   border-radius: 6px;
}

button {
   width: 100%;
   background: #4b7bec;
   color: white;
   border: none;
   padding: 0.75rem;
   border-radius: 6px;
   font-size: 1rem;
   cursor: pointer;
   transition: background 0.3s ease;
}

button:hover {
   background: #3867d6;
}

.chapters-card ul {
   list-style: none;
   padding: 0;
   margin: 0;
}

.chapters-card li {
   padding: 0.75rem 1rem;
   margin-bottom: 0.5rem;
   background: #f5f7fb;
   border-radius: 6px;
   font-size: 0.95rem;
}
</style>
