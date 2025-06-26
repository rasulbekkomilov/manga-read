<!-- src/pages/ChapterRead.vue -->
<template>
   <div v-if="chapter" class="chapter-read">
      <h2>{{ mangaTitle }} — Bob #{{ chapter.number }}</h2>

      <div class="pages">
         <div v-for="(img, idx) in chapter.pages" :key="idx" class="page-img">
            <img :src="img" :alt="`Page ${idx + 1}`" />
         </div>
      </div>

      <div class="chapter-nav">
         <button @click="goToChapter(prevChapterId)" :disabled="!prevChapterId">⬅ Oldingi bob</button>
         <button @click="goToChapter(nextChapterId)" :disabled="!nextChapterId">Keyingi bob ➡</button>
      </div>
   </div>

   <div v-else>
      <LoadingSpinner />
   </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute()
const router = useRouter()

const chapter = ref(null)
const mangaTitle = ref('')
const allChapters = ref([])
const prevChapterId = ref(null)
const nextChapterId = ref(null)

// 🔁 Chapter ma’lumotini yuklovchi funksiya
async function fetchChapterData(chapterId) {
   chapter.value = null // sahifani tozalash
   const { data: current, error } = await supabase
      .from('chapters')
      .select('id, number, manga_id, pages')
      .eq('id', chapterId)
      .single()

   if (error) return

   chapter.value = current

   // 🧾 Manga nomini olish
   const { data: manga } = await supabase
      .from('manga')
      .select('title')
      .eq('id', current.manga_id)
      .single()

   mangaTitle.value = manga?.title || 'Nomaʼlum Manga'

   // 📖 Barcha boblar ro‘yxati
   const { data: chapters } = await supabase
      .from('chapters')
      .select('id, number')
      .eq('manga_id', current.manga_id)
      .order('number', { ascending: true })

   allChapters.value = chapters

   const index = chapters.findIndex(c => c.id === chapterId)
   prevChapterId.value = chapters[index - 1]?.id || null
   nextChapterId.value = chapters[index + 1]?.id || null
}

// ⌛ route.params.chapterId o‘zgarsa — qayta chaqiramiz
watch(
   () => route.params.chapterId,
   (newId) => {
      if (newId) fetchChapterData(newId)
   },
   { immediate: true }
)

function goToChapter(chapterId) {
   if (chapterId) {
      router.push(`/read/${chapter.value.manga_id}/${chapterId}`)
   }
}
</script>

<style scoped>
.chapter-read {
   max-width: 800px;
   margin: auto;
   padding: 2rem;
}

.pages {
   margin-bottom: 2rem;
}

.page-img {
   margin-bottom: 1rem;
}

img {
   width: 100%;
   border-radius: 6px;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chapter-nav {
   display: flex;
   justify-content: space-between;
}

button {
   padding: 0.6rem 1.2rem;
   font-size: 1rem;
   border: none;
   background-color: #4b7bec;
   color: white;
   border-radius: 6px;
   cursor: pointer;
   transition: 0.3s ease;
}

button:disabled {
   background-color: #ccc;
   cursor: not-allowed;
}
</style>
