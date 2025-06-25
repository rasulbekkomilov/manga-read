
<template>
   <NavbarVue />
   <div class="manga-list">
      <h2>Eng so‘nggi mangalar</h2>

      <div v-if="loading">Yuklanmoqda...</div>

      <div v-else class="grid">
         <div v-for="manga in mangas" :key="manga.id" class="card">
            <img :src="manga.cover_url" alt="cover" />
            <h3>{{ manga.title }}</h3>
         </div>
      </div>
   </div>
</template>

<script setup>
import NavbarVue from '@/components/Navbar.vue';
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const mangas = ref([])
const loading = ref(true)

async function fetchMangas() {
   const { data, error } = await supabase.from('manga').select('*')
   if (!error) {
      mangas.value = data
   }
   loading.value = false
}

onMounted(fetchMangas)
</script>

<style scoped>
.manga-list {
   padding: 2rem;
}

.grid {
   margin-top: 2rem;
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
   gap: 1.5rem;
}

.card {
   background: #fff;
   border-radius: 8px;
   padding: 1rem;
   box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
   text-align: center;
   transition: transform 0.2s ease;
}

.card:hover {
   transform: scale(1.02);
}

.card img {
   width: 100%;
   height: 220px;
   object-fit: cover;
   border-radius: 4px;
}

.card h3 {
   margin-top: 0.5rem;
   font-size: 1rem;
}
</style>
