<template>
   <div class="reader">
      <h2>📖 {{ chapterSlug }}</h2>
      <div v-if="pages.length > 0">
         <img v-for="(page, i) in pages" :key="i" :src="page" class="page-img" />
      </div>
      <p v-else>⏳ Yuklanmoqda yoki bob topilmadi</p>
   </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const route = useRoute()
const chapterSlug = route.params.chapterSlug
const mangaSlug = route.params.mangaSlug

const pages = ref([])

onMounted(async () => {
   const { data: manga } = await supabase
      .from('manga')
      .select('id')
      .eq('slug', mangaSlug)
      .single()

   if (manga) {
      const { data: chapter } = await supabase
         .from('chapters')
         .select('pages')
         .eq('slug', chapterSlug)
         .eq('manga_id', manga.id)
         .single()

      if (chapter) {
         pages.value = chapter.pages
      }
   }
})
</script>

<style scoped>
.page-img {
   width: 100%;
   max-width: 700px;
   margin: 0 auto;
   display: block;
   margin-bottom: 1rem;
}
</style>
