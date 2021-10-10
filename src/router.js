import { createRouter, createWebHistory } from 'vue-router'
import store from './store'

// import { configureCompat } from 'vue'
// configureCompat({
//   WATCH_ARRAY: false
// })

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/todo',
    name: 'todo',
    component: () => import('./views/TodoList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/GET_LOGIN_STATUS']) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
          message: true
        }
      })
    } else {
      next()
    }
  } else if (to.path === '/login' && store.getters['auth/GET_LOGIN_STATUS']) {
    next({ path: '/todo' })
  } else {
    next()
  }
})

export default router
