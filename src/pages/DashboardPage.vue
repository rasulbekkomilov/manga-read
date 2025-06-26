<template>
   <div class="dashboard">
      <h2>📊 Dashboard</h2>

      <div class="stats">
         <div class="stat-card">
            <h3>📚 Jami Mangalar</h3>
            <p>{{ totalManga }}</p>
         </div>

         <div class="stat-card">
            <h3>📄 Jami Boblar</h3>
            <p>{{ totalChapters }}</p>
         </div>
      </div>

      <div class="recent-chapters">
         <h3>🆕 Oxirgi Yuklangan Boblar</h3>
         <div class="chapter-grid">
            <router-link v-for="chapter in recentChapters" :key="chapter.id"
               :to="`/read/${chapter.manga_id}/${chapter.id}`" class="chapter-card">
               <img :src="chapter.cover_url" alt="Manga cover" />
               <div class="info">
                  <span>{{ chapter.title }}</span>
                  <p>#{{ chapter.number }}-bob</p>
               </div>
            </router-link>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const totalManga = ref(0)
const totalChapters = ref(0)
const recentChapters = ref([])

onMounted(async () => {
   const { count: mangaCount } = await supabase
      .from('manga')
      .select('id', { count: 'exact', head: true })
   totalManga.value = mangaCount

   const { count: chapterCount } = await supabase
      .from('chapters')
      .select('id', { count: 'exact', head: true })
   totalChapters.value = chapterCount

   const { data: chapters, error } = await supabase
      .from('chapters')
      .select(`
         id,
         number,
         manga_id,
         created_at,
         fk_manga_id (
            title,
            cover_url
         )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

   if (error) {
      console.error('Chapterlarni olishda xatolik:', error)
      return
   }

   recentChapters.value = chapters.map(chap => ({
      id: chap.id,
      number: chap.number,
      manga_id: chap.manga_id,
      title: chap.fk_manga_id?.title || 'Nomaʼlum',
      cover_url: chap.fk_manga_id?.cover_url || ''
   }))
})
</script>

<style scoped>
.dashboard {
   max-width: 1100px;
   margin: 2rem auto;
   padding: 2rem;
   font-family: 'Segoe UI', sans-serif;
}

.stats {
   display: flex;
   flex-wrap: wrap;
   gap: 1rem;
   margin-bottom: 2.5rem;
}

.stat-card {
   flex: 1 1 250px;
   background: linear-gradient(to right, #f0f4ff, #e0eaff);
   padding: 1.5rem;
   border-radius: 10px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
   text-align: center;
}

.stat-card h3 {
   font-size: 1.2rem;
   color: #4a4a4a;
   margin-bottom: 0.5rem;
}

.stat-card p {
   font-size: 1.8rem;
   font-weight: bold;
   color: #222;
}

.recent-chapters {
   margin-top: 2rem;
}

.recent-chapters h3 {
   margin-bottom: 1rem;
   font-size: 1.4rem;
   color: #333;
}

.chapter-grid {
   display: grid;
   grid-template-columns: repeat(5, 1fr);
   gap: 1rem;
}

.chapter-card {
   background: #fff;
   border: 1px solid #ddd;
   border-radius: 8px;
   overflow: hidden;
   text-decoration: none;
   color: #333;
   transition: transform 0.2s ease;
}

.chapter-card:hover {
   transform: translateY(-5px);
}

.chapter-card img {
   width: 100%;
   height: 220px;
   object-fit: cover;
}

.chapter-card .info {
   padding: 0.5rem;
   text-align: center;
   font-weight: 500;
}
</style>
