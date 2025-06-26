<template>
   <div class="admin-panel">
      <h1>Admin Panel</h1>
      <div class="button-group">
         <router-link to="/admin/manga" class="admin-button">📘 Manga Boshqaruvi</router-link>
         <router-link to="/admin/chapters" class="admin-button">📂 Boblar (Chapters)</router-link>
      </div>
   </div>
</template>

<style scoped>
.admin-panel {
   max-width: 600px;
   margin: auto;
   padding: 2rem;
   text-align: center;
}

.button-group {
   display: flex;
   flex-direction: column;
   gap: 1rem;
}

.admin-button {
   padding: 1rem;
   background-color: #eee;
   border: 1px solid #ccc;
   text-decoration: none;
   color: black;
   font-weight: bold;
   border-radius: 8px;
   transition: all 0.3s ease;
}

.admin-button:hover {
   background-color: #ddd;
}
</style>