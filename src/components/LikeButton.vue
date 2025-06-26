<!-- src/components/LikeButton.vue -->
<template>
   <button @click="toggleLike" :disabled="loading">
      <span v-if="loading">Yuklanmoqda...</span>
      <span v-else>
         {{ liked ? '❤️ Unlike' : '🤍 Like' }}
      </span>
   </button>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
   chapterId: {
      type: String,
      required: true
   }
})

const liked = ref(false)
const loading = ref(false)

const auth = useAuthStore()

// Like holatini tekshirish
const checkLiked = async () => {
   if (!auth.user) return
   loading.value = true

   const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('chapter_id', props.chapterId)
      .single()

   liked.value = !!data
   loading.value = false
}

// Like bosish yoki olib tashlash
const toggleLike = async () => {
   if (!auth.user) {
      alert('Avval tizimga kiring!')
      return
   }

   loading.value = true

   if (liked.value) {
      // Unlike qilish
      const { error } = await supabase
         .from('likes')
         .delete()
         .eq('user_id', auth.user.id)
         .eq('chapter_id', props.chapterId)

      if (!error) liked.value = false
   } else {
      // Like qo‘shish
      const { error } = await supabase
         .from('likes')
         .insert({
            user_id: auth.user.id,
            chapter_id: props.chapterId
         })

      if (!error) liked.value = true
   }

   loading.value = false
}

onMounted(() => {
   checkLiked()
})
</script>

<style scoped>
button {
   padding: 6px 12px;
   border: 1px solid #ccc;
   background-color: white;
   cursor: pointer;
   border-radius: 5px;
   transition: all 0.3s ease;
}

button:hover {
   background-color: #f8f8f8;
}
</style>
