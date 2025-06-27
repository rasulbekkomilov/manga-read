<template>
   <div class="reader">
      <h1 class="chapter-title">{{ chapterTitle }}</h1>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-else-if="pages.length > 0" class="pages">
         <img v-for="(page, index) in pages" :key="index" :src="page" :alt="`Page ${index + 1}`" />
      </div>

      <div v-else class="loading">
         ⏳ Yuklanmoqda yoki bob mavjud emas...
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const pages = ref([])
const chapterTitle = ref('')
const error = ref(null)

onMounted(async () => {
   const { chapterSlug } = route.params

   const { data, error: fetchError } = await supabase
      .from('chapters')
      .select(`
         pages,
         number,
         slug,
         manga (
            title,
            slug
         )
      `)
      .eq('slug', chapterSlug)
      .single()

   if (fetchError || !data) {
      error.value = '❌ Bob topilmadi yoki xatolik yuz berdi.'
      return
   }

   pages.value = data.pages
   chapterTitle.value = `${data.manga.title} - ${data.number}-bob`
})
</script>


<style scoped>
.reader {
   max-width: 900px;
   margin: 2rem auto;
   padding: 1rem;
   font-family: 'Segoe UI', sans-serif;
}

.chapter-title {
   font-size: 1.8rem;
   font-weight: bold;
   text-align: center;
   margin-bottom: 2rem;
   color: #1f2937;
}

.error {
   color: #dc2626;
   text-align: center;
   font-size: 1.1rem;
   margin-top: 2rem;
}

.loading {
   text-align: center;
   font-size: 1.1rem;
   color: #6b7280;
   margin-top: 2rem;
}

.pages {
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.pages img {
   width: 100%;
   height: auto;
   border-radius: 8px;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
   object-fit: contain;
}
</style>
