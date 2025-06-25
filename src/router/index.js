import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Sahifa komponentlarini import qiling
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import HomePage from '../pages/HomePage.vue'

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
      name: 'Dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true }
   },
   {
      path: '/admin',
      name: 'Admin',
      component: AdminPage,
      meta: { requiresAuth: true, requiresAdmin: true }
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
   const auth = useAuthStore()

   if (!auth.user) {
      // Foydalanuvchi ma'lumotlari hali olinmagan bo‘lishi mumkin
      await auth.fetchUser()
   }

   const isLoggedIn = !!auth.user
   const isAdmin = auth.isAdmin

   if (to.meta.requiresAuth && !isLoggedIn) {
      next('/login')
   } else if (to.meta.requiresAdmin && !isAdmin) {
      next('/dashboard') // oddiy user admin panelga kira olmaydi
   } else {
      next()
   }
})

export default router
