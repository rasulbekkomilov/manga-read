<template>
   <div class="spinner"></div>
</template>

<style scoped>
.spinner {
   width: 24px;
   height: 24px;
   border: 3px solid #ccc;
   border-top: 3px solid #1abc9c;
   border-radius: 50%;
   animation: spin 1s linear infinite;
   margin: auto;
}

@keyframes spin {
   to {
      transform: rotate(360deg);
   }
}
</style>
