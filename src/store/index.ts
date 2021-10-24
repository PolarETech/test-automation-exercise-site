import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { State } from '@/types/store'

import auth from './modules/auth'
import todo from './modules/todo'
import message from './modules/message'

import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  modules: {
    auth,
    todo,
    message
  },
  strict: Boolean(import.meta.env.MODE !== 'production'),
  plugins: [
    createPersistedState({
      key: 'PtExampleToken',
      paths: ['auth.token'],
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, {
          expires: 1 / 24,
          secure: Boolean(import.meta.env.MODE === 'production')
        }),
        removeItem: key => Cookies.remove(key)
      }
    }),
    createPersistedState({
      key: 'PtExampleTodos',
      paths: ['todo.items']
    })
  ]
})

export function useStore () {
  return baseUseStore(key)
}

export default store
