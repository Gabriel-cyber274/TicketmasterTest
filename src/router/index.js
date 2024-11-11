import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IndexView from '../views/IndexView.vue'
import AccountView from '../views/AccountView.vue'
import EventView from '../views/EventView.vue'
import EventSlideView from '../views/EventSlideView.vue'
import EditPage from '../views/EditPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/event',
      name: 'event',
      component: EventView,
    },
    {
      path: '/event/details',
      name: 'event-details',
      component: EventSlideView,
      props: route => ({ event: route.query.event }),
    },
    {
      path: '/edit-page',
      name: 'edit page',
      component: EditPage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
