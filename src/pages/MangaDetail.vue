<template>
   <div class="detail">
      <div class="manga-header">
         <img :src="manga.cover_url" alt="Cover" class="cover" />
         <div class="info">
            <h1>{{ manga.title }}</h1>
            <p><strong>Status:</strong> {{ manga.status }}</p>
            <p><strong>Janr:</strong> {{ manga.genres?.join(', ') || '—' }}</p>
            <p class="description">{{ manga.description || 'Ta’rifi mavjud emas.' }}</p>
         </div>
      </div>

      <div class="chapters">
         <h2>📄 Boblar</h2>
         <div v-if="chapters.length">
            <ul>
               <li v-for="chapter in chapters" :key="chapter.id">
                  <router-link :to="`/read/${manga.id}/${chapter.id}`">
                     📖 Bob #{{ chapter.number }}
                  </router-link>
               </li>
            </ul>
         </div>
         <p v-else class="no-chapters">Hali boblar mavjud emas.</p>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const manga = ref({})
const chapters = ref([])

onMounted(async () => {
   const { mangaId } = route.params

   const { data: mangaData } = await supabase.from('manga').select('*').eq('id', mangaId).single()
   manga.value = mangaData || {}

   const { data: chapterData } = await supabase
      .from('chapters')
      .select('id, number, created_at')
      .eq('manga_id', mangaId)
      .order('number', { ascending: true })

   chapters.value = chapterData || []
})
</script>

<style scoped>
.detail {
   max-width: 1100px;
   margin: auto;
   padding: 1.5rem;
   font-family: 'Segoe UI', sans-serif;
}

.manga-header {
   display: flex;
   flex-wrap: wrap;
   gap: 1.5rem;
   margin-bottom: 2rem;
   background: #f8f9fc;
   padding: 1.5rem;
   border-radius: 12px;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.cover {
   width: 240px;
   height: 340px;
   object-fit: cover;
   border-radius: 10px;
}

.info {
   flex: 1;
}

.info h1 {
   font-size: 2rem;
   margin-bottom: 0.5rem;
   color: #333;
}

.info p {
   margin: 0.4rem 0;
   font-size: 1rem;
   color: #444;
}

.description {
   margin-top: 1rem;
   font-style: italic;
}

.chapters {
   margin-top: 2rem;
}

.chapters h2 {
   margin-bottom: 1rem;
   color: #2d3436;
}

.chapters ul {
   list-style: none;
   padding-left: 0;
   display: flex;
   flex-wrap: wrap;
   gap: 0.75rem;
}

.chapters li {
   background: #ffffff;
   border: 1px solid #ddd;
   border-radius: 6px;
   padding: 0.6rem 1rem;
   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
   transition: transform 0.2s ease;
}

.chapters li:hover {
   transform: translateY(-2px);
}

.chapters a {
   text-decoration: none;
   color: #2c3e50;
   font-weight: 500;
}

.no-chapters {
   font-style: italic;
   color: #888;
}
</style>
