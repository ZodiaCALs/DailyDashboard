import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('../components/DailyDashboard.vue') },
    { path: '/login', name: 'login', component: () => import('../components/LoginPage.vue') },
  ]
})

// ✅ 简易登录状态检查（生产环境请替换为 token 验证）
router.beforeEach((to) => {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'
  if (to.name !== 'login' && !isAdmin) {
    return { name: 'login' }
  }
})

export default router