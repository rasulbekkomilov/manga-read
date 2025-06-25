<template>
   <div class="admin">
      <h2>Admin Panel</h2>
      <MangaForm @manga-added="fetchMangas" />
      <hr />
      <div v-for="manga in mangas" :key="manga.id" class="manga-item">
         <h3>{{ manga.title }}</h3>
         <p>{{ manga.description }}</p>
         <ChapterForm :mangaId="manga.id" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import MangaForm from '@/components/MangaForm.vue'
import ChapterForm from '@/components/ChapterForm.vue'

const mangas = ref([])

async function fetchMangas() {
   const { data, error } = await supabase.from('manga').select('*')
   if (!error) mangas.value = data
}

onMounted(fetchMangas)
</script>

<style scoped>
.admin {
   padding: 2rem;
}

.manga-item {
   margin-top: 2rem;
   border: 1px solid #ccc;
   padding: 1rem;
   border-radius: 6px;
}
</style>
