import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import VueHead from 'vue-head'
import VueAnalytics from 'vue-analytics'
import '@/assets/style.scss'
import router from './router'
import store from './store'

Vue.use(Buefy)
Vue.use(VueHead, {
  separator: ' | '
})
Vue.use(VueAnalytics, {
  id: 'UA-144246391-1',
  router
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
