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
            <router-link v-for="chapter in recentChapters" :key="chapter.id" :to="`/${chapter.manga_slug}/${chapter.slug}`"
               class="chapter-card">
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
import { onMounted, ref } from 'vue'
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

   const { data, error } = await supabase
      .from('chapters')
      .select(`
         id,
         slug,
         number,
         manga (
            slug,
            title,
            cover_url
         )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

   if (error) {
      console.error('Xatolik:', error)
      return
   }

   recentChapters.value = data.map(chap => ({
      id: chap.id,
      slug: chap.slug,
      number: chap.number,
      title: chap.manga?.title || 'Nomaʼlum',
      manga_slug: chap.manga?.slug || '',
      cover_url: chap.manga?.cover_url || ''
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

h2 {
   font-size: 2rem;
   margin-bottom: 1.5rem;
   color: #333;
}

.stats {
   display: flex;
   flex-wrap: wrap;
   gap: 1.5rem;
   margin-bottom: 2.5rem;
}

.stat-card {
   flex: 1 1 250px;
   background: linear-gradient(135deg, #eef2ff, #dbeafe);
   padding: 1.5rem;
   border-radius: 12px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
   text-align: center;
   transition: transform 0.2s ease;
}

.stat-card:hover {
   transform: translateY(-4px);
}

.stat-card h3 {
   font-size: 1.2rem;
   color: #4a4a4a;
   margin-bottom: 0.5rem;
}

.stat-card p {
   font-size: 1.8rem;
   font-weight: bold;
   color: #1f2937;
}

.recent-chapters {
   margin-top: 2rem;
}

.recent-chapters h3 {
   margin-bottom: 1rem;
   font-size: 1.5rem;
   color: #1f2937;
}

.chapter-grid {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
   gap: 1rem;
}

.chapter-card {
   background: #ffffff;
   border: 1px solid #e5e7eb;
   border-radius: 10px;
   overflow: hidden;
   text-decoration: none;
   color: #111827;
   transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chapter-card:hover {
   transform: translateY(-5px);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.chapter-card img {
   width: 100%;
   height: 220px;
   object-fit: cover;
   border-bottom: 1px solid #e5e7eb;
}

.chapter-card .info {
   padding: 0.6rem;
   text-align: center;
   font-weight: 500;
   font-size: 0.95rem;
}

.chapter-card .info span {
   display: block;
   font-size: 1rem;
   font-weight: 600;
   color: #374151;
   margin-bottom: 4px;
}
</style>
