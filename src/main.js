import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import VueHead from 'vue-head'
import VueGtag from 'vue-gtag'
import '@/assets/style.scss'
import router from './router'
import store from './store'

Vue.use(Buefy)
Vue.use(VueHead, {
  separator: ' | '
})
Vue.use(VueGtag, {
  config: {
    id: 'UA-144246391-1',
    params: {
      anonymize_ip: true
    }
  }
}, router)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
