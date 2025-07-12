import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LinkView from '../views/LinkView.vue'
import RedirectView from '../views/RedirectView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/link/:code',
      name: 'link',
      component: LinkView,
    },
    {
      path: '/k/:code',
      name: 'redirect',
      component: RedirectView,
    },
  ],
})

export default router
