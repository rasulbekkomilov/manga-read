<template>
   <div class="home">
      <div class="manga-list">
         <router-link v-for="manga in mangas" :key="manga.id" :to="`/series/${manga.id}/${slugify(manga.title)}`"
            class="manga-card">
            <img :src="manga.cover_url" />
            <h3>{{ manga.title }}</h3>
         </router-link>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'


const mangas = ref([])

onMounted(async () => {
   const { data, error } = await supabase.from('manga').select('*')
   if (!error) mangas.value = data
})

function slugify(title) {
   return title.toLowerCase().replace(/\s+/g, '-')
}
</script>

<style scoped>
.manga-list {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
   gap: 1rem;
}

.manga-card {
   background: #1e1e1e;
   padding: 0.5rem;
   border-radius: 8px;
   text-align: center;
   text-decoration: none;
   color: white;
}

.manga-card img {
   width: 100%;
   height: 220px;
   object-fit: cover;
   border-radius: 6px;
}
</style>
