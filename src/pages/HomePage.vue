<template>
   <div class="home">
      <h2 class="home-title">📖 Barcha Mangalar</h2>
      <div class="manga-list">
         <router-link v-for="manga in mangas" :key="manga.id" :to="`/${manga.slug}`" class="manga-card">
            <img :src="manga.cover_url" alt="Manga cover" />
            <div class="card-info">
               <h3>{{ manga.title }}</h3>
            </div>
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
.home {
   max-width: 1200px;
   margin: 2rem auto;
   padding: 1rem;
   font-family: 'Segoe UI', sans-serif;
}

.home-title {
   font-size: 1.8rem;
   margin-bottom: 1.5rem;
   color: #333;
   text-align: center;
}

.manga-list {
   display: grid;
   grid-template-columns: repeat(5, 1fr);
   /* Har qatorga 5ta card */
   gap: 1.2rem;
}

/* Kartochka */
.manga-card {
   background: #fff;
   border: 1px solid #ddd;
   border-radius: 10px;
   overflow: hidden;
   text-decoration: none;
   transition: transform 0.2s ease, box-shadow 0.2s ease;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
   display: flex;
   flex-direction: column;
}

.manga-card:hover {
   transform: translateY(-4px);
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Rasm */
.manga-card img {
   width: 100%;
   height: 240px;
   object-fit: cover;
}

/* Sarlavha */
.card-info {
   padding: 0.75rem;
   text-align: center;
   background-color: #f9f9f9;
   height: 100%;
}

.card-info h3 {
   font-size: 1rem;
   color: #333;
   margin: 0;
   font-weight: 600;
}

/* 📱 Responsive */
@media (max-width: 1200px) {
   .manga-list {
      grid-template-columns: repeat(4, 1fr);
   }
}

@media (max-width: 992px) {
   .manga-list {
      grid-template-columns: repeat(3, 1fr);
   }
}

@media (max-width: 768px) {
   .manga-list {
      grid-template-columns: repeat(2, 1fr);
   }
}

@media (max-width: 500px) {
   .manga-list {
      grid-template-columns: 1fr;
   }
}
</style>
