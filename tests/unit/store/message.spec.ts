import { createStore, Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { cloneDeep } from 'lodash'
import message from '@/store/modules/message'

const initStore = () => ({
  modules: cloneDeep({ message })
})

describe('auth', () => {
  let store: Store<State>

  beforeEach(() => {
    store = createStore(initStore())
  })

  test('messages exist', () => {
    expect(store.state.message.requireLogin).toBeTruthy()
    expect(store.state.message.loginError).toBeTruthy()
    expect(store.state.message.emptyItem).toBeTruthy()
    expect(store.state.message.requireInputTodo).toBeTruthy()
  })
})
