import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VertifyToy from '@/views/VertifyToy.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      component: HomeView
    }
    ,{
      path: '/v',
      name: '/v',
      component: VertifyToy
    }
  ]
})

export default router
