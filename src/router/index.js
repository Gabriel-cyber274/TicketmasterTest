import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IndexView from '../views/IndexView.vue'
import AccountView from '../views/AccountView.vue'
import EventView from '../views/EventView.vue'
import EventSlideView from '../views/EventSlideView.vue'
import EventSlideSuccessView from '../views/EventSuccessPage.vue'
import EditPage from '../views/EditPage.vue'
import UkIndexPage from '../views/uk/index.vue'
import UkAccountPage from '../views/uk/Account.vue'
import UkEventViewPage from '../views/uk/EventView.vue'
import EventUKSlideView from '../views/uk/EventViewSlide.vue'
import EventUkTransfer from '../views/uk/TransferPage.vue'

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
      path: '/event/details/success',
      name: 'event-details-success',
      component: EventSlideSuccessView,
      props: route => ({ event: route.query.event }),
    },
    {
      path: '/edit-page',
      name: 'edit page',
      component: EditPage,
    },
    {
      path: '/uk-index',
      name: 'uk index page',
      component: UkIndexPage,
    },
    {
      path: '/account2',
      name: 'account 2',
      component: UkAccountPage,
    },
    {
      path: '/event2',
      name: 'event2',
      component: UkEventViewPage,
    },
    {
      path: '/event/uk-details',
      name: 'event-uk-details',
      component: EventUKSlideView,
      props: route => ({ event: route.query.event }),
    },
    {
      path: '/uk-transfer',
      name: 'uk-transfer',
      component: EventUkTransfer,
      props: route => ({ event: route.query.event }),
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
