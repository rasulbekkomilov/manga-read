// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignUpPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import HomePage from '../pages/HomePage.vue'
import MangaManage from '../pages/MangaManage.vue'
import ChapterManage from '../pages/ChapterManage.vue'
import ChapterRead from '../pages/ChapterRead.vue'
import MangaDetail from '../pages/MangaDetail.vue'

const routes = [
   {
      path: '/',
      name: 'Home',
      component: HomePage
   },
   {
      path: '/login',
      name: 'Login',
      component: LoginPage
   },
   {
      path: '/signup',
      name: 'Signup',
      component: SignupPage
   },
   {
      path: '/dashboard',
      component: DashboardPage,
   },
   {
      path: '/admin',
      name: 'Admin',
      component: AdminPage,
      meta: { requiresAuth: true, requiresAdmin: true }
   },
   {
      path: '/admin/manga',
      component: MangaManage,
      meta: { requiresAuth: true, requiresAdmin: true }
   },
   {
      path: '/admin/chapters',
      component: ChapterManage,
      meta: { requiresAuth: true, requiresAdmin: true }
   },
   {
      path: '/read/:mangaId/:chapterId',
      component: ChapterRead,
   },
   {
      path: '/series/:mangaId/:slug',
      component: MangaDetail,
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

// 🔐 Navigation Guard
router.beforeEach(async (to, from, next) => {
   const auth = useAuthStore()

   // Faqat kerak bo‘lsa userni fetch qilamiz
   if (!auth.user) {
      await auth.fetchUser()
   }

   const isLoggedIn = !!auth.user
   const isAdmin = auth.isAdmin

   if (to.meta.requiresAuth && !isLoggedIn) {
      return next('/login')
   }

   if (to.meta.requiresAdmin && !isAdmin) {
      return next('/dashboard')
   }

   next()
})

export default router
