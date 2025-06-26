<template>
   <div class="manga-detail" v-if="manga">
      <div class="header">
         <img :src="manga.cover_url" alt="cover" />
         <div class="info">
            <h2>{{ manga.title }}</h2>
            <p><strong>Status:</strong> {{ manga.status }}</p>
            <p class="description">{{ manga.description }}</p>
         </div>
      </div>

      <h3>Boblar:</h3>
      <ul>
         <li v-for="chapter in chapters" :key="chapter.id">
            <router-link :to="`/read/${manga.id}/${chapter.id}`">
               📖 Bob {{ chapter.number }}
            </router-link>
         </li>
      </ul>
   </div>
   <p v-else>Yuklanmoqda...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const mangaId = route.params.mangaId

const manga = ref(null)
const chapters = ref([])

onMounted(async () => {
   const { data: mangaData } = await supabase.from('manga').select('*').eq('id', mangaId).single()
   manga.value = mangaData

   const { data: chapterData } = await supabase
      .from('chapters')
      .select('id, number')
      .eq('manga_id', mangaId)
      .order('number', { ascending: true })

   chapters.value = chapterData || []
})
</script>

<style scoped>
.manga-detail {
   max-width: 800px;
   margin: auto;
   padding: 2rem;
}

.header {
   display: flex;
   gap: 1rem;
   margin-bottom: 2rem;
}

img {
   width: 150px;
   height: auto;
   border-radius: 8px;
}

.info {
   flex: 1;
}

.description {
   margin-top: 1rem;
}

ul {
   padding: 0;
   list-style: none;
}

li {
   margin: 0.5rem 0;
}
</style>
