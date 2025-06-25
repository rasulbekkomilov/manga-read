<template>
   <form @submit.prevent="submitChapter">
      <h4>Yangi Bob Qo‘shish</h4>
      <input v-model="chapterNumber" placeholder="Chapter Number" required />
      <input type="file" multiple @change="handleImages" />
      <button type="submit">Qo‘shish</button>
   </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useUiStore } from '@/stores/ui'  
import axios from 'axios'

const props = defineProps({ mangaId: Number })
const ui = useUiStore()

const chapterNumber = ref('')
const images = ref([])

function handleImages(e) {
   images.value = [...e.target.files]
}

async function submitChapter() {
   ui.setLoading(true)
   const imageUrls = []

   for (const file of images.value) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)
      formData.append('publicKey', 'public_5bLBWfijCqeu8NuRntOUNKKSGyU=')

      try {
         const res = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData, {
            headers: {
               Authorization: `Basic ${btoa('private_deajqEWgfqiw93NcvVIdhoR+wIQ=')}`
            }
         })
         imageUrls.push(res.data.url)
      } catch (err) {
         ui.showToastMessage("Rasm yuklanmadi")
         return
      }
   }

   const { error } = await supabase.from('chapters').insert({
      manga_id: props.mangaId,
      chapter_number: chapterNumber.value,
      page_urls: imageUrls,
   })

   ui.setLoading(false)

   if (error) {
      ui.showToastMessage("Bob qo‘shishda xatolik")
   } else {
      chapterNumber.value = ''
      images.value = []
   }
}
</script>
