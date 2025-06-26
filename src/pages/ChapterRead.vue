<template>
   <div v-if="chapter">
      <h2>Bob #{{ chapter.number }}</h2>

      <div v-for="(img, index) in chapter.pages" :key="index" class="page-img">
         <img :src="img" :alt="`Sahifa ${index + 1}`" />
      </div>

      <button @click="likeChapter">👍 Like ({{ chapter.likes || 0 }})</button>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const chapter = ref(null)

onMounted(async () => {
   const { data } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', route.params.chapterId)
      .single()

   chapter.value = data
})

const likeChapter = async () => {
   if (!chapter.value) return

   const { data, error } = await supabase.rpc('increment_likes', {
      chapter_id: chapter.value.id
   })

   if (!error) {
      chapter.value.likes++
   }
}
</script>

<style scoped>
.page-img {
   margin-bottom: 1rem;
}

img {
   max-width: 100%;
   border: 1px solid #ccc;
}
</style>