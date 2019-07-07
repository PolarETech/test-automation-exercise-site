import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import todo from './modules/todo'
import message from './modules/message'

import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    todo,
    message
  },
  strict: process.env.VUE_APP_DEV,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, {
          expires: 1 / 24,
          secure: !process.env.VUE_APP_DEV
        }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ]
})

export default store
