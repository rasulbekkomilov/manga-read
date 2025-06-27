<template>
   <div class="manga-detail">
      <div v-if="manga">
         <h2>{{ manga.title }}</h2>
         <img :src="manga.cover_url" alt="Cover" class="cover" />
         <p><strong>Holat:</strong> {{ manga.status }}</p>
         <p><strong>Janrlar:</strong> {{ manga.genres.join(', ') }}</p>
         <p class="desc">{{ manga.description }}</p>

         <h3>📚 Boblar</h3>
         <ul v-if="chapters.length > 0" class="chapter-list">
            <li v-for="chapter in chapters" :key="chapter.id">
               <router-link :to="`/${manga.slug}/${chapter.slug}`">
                  📖 Bob {{ chapter.number }}
               </router-link>
            </li>
         </ul>
         <p v-else class="no-chapters">Bu mangada hali boblar mavjud emas.</p>
      </div>
      <div v-else>
         <p>⏳ Yuklanmoqda...</p>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const manga = ref(null)
const chapters = ref([])

onMounted(async () => {
   const { data: mangaData } = await supabase
      .from('manga')
      .select('*')
      .eq('slug', route.params.slug)
      .single()

   if (mangaData) {
      manga.value = mangaData

      const { data: chapterData } = await supabase
         .from('chapters')
         .select('id, number, slug')
         .eq('manga_id', mangaData.id)
         .order('number', { ascending: true })

      if (chapterData) chapters.value = chapterData
   }
})
</script>

<style scoped>
.manga-detail {
   max-width: 800px;
   margin: 2rem auto;
   padding: 1rem;
   font-family: 'Segoe UI', sans-serif;
}

.cover {
   width: 100%;
   max-width: 320px;
   height: auto;
   border-radius: 8px;
   margin: 1rem 0;
}

.desc {
   margin-top: 1rem;
   font-size: 1rem;
   color: #444;
   line-height: 1.5;
}

.chapter-list {
   list-style: none;
   padding: 0;
   margin-top: 1rem;
}

.chapter-list li {
   margin-bottom: 0.5rem;
}

.no-chapters {
   font-style: italic;
   color: #888;
   margin-top: 0.5rem;
}
</style>
