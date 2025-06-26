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
         <ul>
            <li v-for="chapter in recentChapters" :key="chapter.id">
               <div class="chapter-info">
                  <strong>#{{ chapter.number }}</strong> — {{ chapter.manga_title }}
               </div>
               <span class="date">{{ formatDate(chapter.created_at) }}</span>
            </li>
         </ul>
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
   // Mangalar soni
   const { count: mangaCount } = await supabase
      .from('manga')
      .select('id', { count: 'exact', head: true })
   totalManga.value = mangaCount

   // Boblar soni
   const { count: chapterCount } = await supabase
      .from('chapters')
      .select('id', { count: 'exact', head: true })
   totalChapters.value = chapterCount

   // Oxirgi yuklangan 5 ta bob (manga nomi bilan)
   const { data, error } = await supabase
      .from('chapters')
      .select('id, number, created_at, manga_id, manga!chapters_manga_id_fkey(title)')
      .order('created_at', { ascending: false })
      .limit(5)

   if (!error && data) {
      recentChapters.value = data.map((chap) => ({
         id: chap.id,
         number: chap.number,
         created_at: chap.created_at,
         manga_title: chap.manga?.title || 'Nomaʼlum',
      }))
   } else {
      console.error('Chapterlarni olishda xatolik:', error)
   }
})

function formatDate(dateStr) {
   return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   })
}
</script>

<style scoped>
.dashboard {
   max-width: 1000px;
   margin: 2rem auto;
   padding: 2rem;
   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
   background: #fff;
   border-radius: 12px;
   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

h2 {
   font-size: 2rem;
   font-weight: bold;
   color: #333;
   margin-bottom: 2rem;
   text-align: center;
}

.stats {
   display: flex;
   flex-wrap: wrap;
   gap: 1.5rem;
   margin-bottom: 2.5rem;
}

.stat-card {
   flex: 1 1 250px;
   background: linear-gradient(to right, #f0f4ff, #e0eaff);
   padding: 1.5rem;
   border-radius: 10px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
   text-align: center;
   transition: transform 0.3s ease;
}

.stat-card:hover {
   transform: translateY(-5px);
}

.stat-card h3 {
   margin-bottom: 0.5rem;
   font-size: 1.1rem;
   color: #4a4a4a;
}

.stat-card p {
   font-size: 2rem;
   font-weight: bold;
   color: #222;
}

.recent-chapters {
   background-color: #f9fafe;
   border: 1px solid #dde3f0;
   padding: 1.5rem;
   border-radius: 10px;
}

.recent-chapters h3 {
   margin-bottom: 1rem;
   font-size: 1.3rem;
   color: #444;
   border-left: 4px solid #4b7bec;
   padding-left: 0.5rem;
}

.recent-chapters ul {
   list-style: none;
   padding: 0;
   margin: 0;
}

.recent-chapters li {
   padding: 0.75rem 1rem;
   margin-bottom: 0.5rem;
   background-color: #ffffff;
   border: 1px solid #e0e6f0;
   border-radius: 6px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   font-size: 1rem;
   transition: background 0.2s;
}

.recent-chapters li:hover {
   background-color: #f1f5fb;
}

.date {
   font-size: 0.9rem;
   color: #777;
}

.chapter-info {
   font-weight: 500;
   color: #333;
}
</style>
