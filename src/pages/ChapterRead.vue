<template>
   <div v-if="chapter">
      <h2>Bob #{{ chapter.number }}</h2>

      <div v-for="(img, index) in chapter.pages" :key="index" class="page-img">
         <img :src="img" :alt="`Sahifa ${index + 1}`" />
      </div>

      <LikeButton :chapterId="route.params.chapterId" @liked="fetchChapter" />
      <p class="like-count">❤️ {{ chapter.likes }} ta like</p>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'
import LikeButton from '@/components/LikeButton.vue'

const route = useRoute()
const chapter = ref(null)

const fetchChapter = async () => {
   const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', route.params.chapterId)
      .single()

   if (error) {
      console.error('Chapter yuklanmadi:', error.message)
      return
   }

   chapter.value = data
}

onMounted(() => {
   fetchChapter()
})
</script>

<style scoped>
.page-img {
   margin-bottom: 1rem;
}

img {
   max-width: 100%;
   border: 1px solid #ccc;
   border-radius: 5px;
}

.like-count {
   margin-top: 1rem;
   font-weight: bold;
   color: #555;
}
</style>
