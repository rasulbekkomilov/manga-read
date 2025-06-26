<template>
   <div class="manga-detail">
      <div class="header">
         <img :src="manga.cover_url" alt="Manga cover" class="cover" />
         <div class="info">
            <h1>{{ manga.title }}</h1>
            <p class="status">📌 Holat: <strong>{{ statusLabel(manga.status) }}</strong></p>
            <p class="genres">🏷️ Janrlar: <span v-for="(g, i) in manga.genres" :key="i">{{ g }}<span
                     v-if="i < manga.genres.length - 1">, </span></span></p>
         </div>
      </div>

      <div class="chapters">
         <h2>📖 Boblar</h2>
         <div v-if="chapters.length === 0" class="empty">
            Bu manga uchun hali boblar mavjud emas.
         </div>
         <ul v-else>
            <li v-for="chapter in chapters" :key="chapter.id">
               <router-link :to="`/read/${manga.id}/${chapter.id}`">
                  {{ chapter.number }} - bob
               </router-link>
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const mangaId = route.params.mangaId

const manga = ref({})
const chapters = ref([])

onMounted(async () => {
   const { data, error } = await supabase
      .from('manga')
      .select('*')
      .eq('id', mangaId)
      .single()

   if (!error) {
      manga.value = data
   }

   const { data: chapterData } = await supabase
      .from('chapters')
      .select('*')
      .eq('manga_id', mangaId)
      .order('number', { ascending: true })

   chapters.value = chapterData || []
})

function statusLabel(status) {
   switch (status) {
      case 'ongoing': return 'Davom etmoqda'
      case 'completed': return 'Tugagan'
      case 'paused': return 'Pauzada'
      case 'stopped': return 'To‘xtatilgan'
      default: return status
   }
}
</script>

<style scoped>
.manga-detail {
   max-width: 900px;
   margin: 2rem auto;
   padding: 1rem;
   font-family: 'Segoe UI', sans-serif;
}

.header {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 1.5rem;
   margin-bottom: 2rem;
}

@media (min-width: 768px) {
   .header {
      flex-direction: row;
      align-items: flex-start;
   }
}

.cover {
   width: 220px;
   height: auto;
   border-radius: 12px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info {
   flex: 1;
}

.info h1 {
   font-size: 2rem;
   margin-bottom: 0.5rem;
   color: #222;
}

.status,
.genres {
   margin-top: 0.5rem;
   color: #444;
   font-size: 1rem;
}

.chapters {
   margin-top: 2rem;
}

.chapters h2 {
   font-size: 1.5rem;
   margin-bottom: 1rem;
}

.chapters ul {
   list-style: none;
   padding: 0;
}

.chapters li {
   margin-bottom: 0.5rem;
   background: #f5f7fa;
   padding: 0.75rem 1rem;
   border-radius: 8px;
   transition: background 0.2s ease;
}

.chapters li:hover {
   background: #e9eef5;
}

.chapters a {
   text-decoration: none;
   color: #2c3e50;
   font-weight: 500;
}

.empty {
   color: #888;
   font-style: italic;
}
</style>
