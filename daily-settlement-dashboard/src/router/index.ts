// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'DailyDashboard',
      component: () => import('../components/DailyDashboard.vue'),
    },
    {
      path: '/annual-report',
      name: 'AnnualReport',
      component: () => import('../components/AnnualReport.vue'),
    },
  ],
})

export default router