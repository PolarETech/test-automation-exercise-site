import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import VueGtag from 'vue-gtag'
import '@/assets/style.scss'
import router from './router'
import store from './store'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.use(store)

app.use(PrimeVue)
app.use(ToastService)

app.use(VueGtag, {
  config: {
    id: 'UA-144246391-1',
    params: {
      anonymize_ip: true
    }
  }
}, router)

app.mount('#app')
