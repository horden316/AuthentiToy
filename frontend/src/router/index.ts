import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VertifyToy from '@/views/VertifyToy.vue'
import ToyConfirm from '@/views/Toyconfirm.vue'
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
    }, {
      path: '/confirm',
      name: '/confirm',
      component: ToyConfirm
    }
  ]
})

export default router
