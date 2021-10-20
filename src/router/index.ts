import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
        query: Object({
          redirect: to.fullPath,
          message: 'true'
        })
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
