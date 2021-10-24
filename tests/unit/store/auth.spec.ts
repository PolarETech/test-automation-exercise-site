import { createStore, Store } from 'vuex'
import { State } from '@/types/store'
import { cloneDeep } from 'lodash'
import auth from '@/store/modules/auth'

const initStore = () => ({
  modules: cloneDeep({ auth })
})

describe('auth', () => {
  let store: Store<State>

  beforeEach(() => {
    store = createStore(initStore())
  })

  test('commit LOGIN', () => {
    const token = 'dummy-token'
    store.commit('auth/LOGIN', token)
    expect(store.state.auth.token).toBeTruthy()
    expect(store.state.auth.token).toEqual(token)
  })

  test('commit LOGOUT', () => {
    store.commit('auth/LOGIN', 'dummy-token')
    expect(store.state.auth.token).toBeTruthy()
    store.commit('auth/LOGOUT')
    expect(store.state.auth.token).toBeFalsy()
  })

  test('commit LOGIN_USER_ERROR', () => {
    expect(store.state.auth.userError).toBeFalsy()
    store.commit('auth/LOGIN_USER_ERROR', true)
    expect(store.state.auth.userError).toBeTruthy()
    store.commit('auth/LOGIN_USER_ERROR', false)
    expect(store.state.auth.userError).toBeFalsy()
  })

  test('getter GET_LOGIN_STATUS before login', () => {
    expect(store.state.auth.token).toBeFalsy()
    expect(store.getters['auth/GET_LOGIN_STATUS']).toBeFalsy()
  })

  test('getter GET_LOGIN_STATUS after login', () => {
    expect(store.state.auth.token).toBeFalsy()
    expect(store.getters['auth/GET_LOGIN_STATUS']).toBeFalsy()
    store.commit('auth/LOGIN', 'dummy-token')
    expect(store.state.auth.token).toBeTruthy()
    expect(store.getters['auth/GET_LOGIN_STATUS']).toBeTruthy()
  })

  test('getter GET_LOGIN_STATUS after logout', () => {
    store.commit('auth/LOGIN', 'dummy-token')
    expect(store.state.auth.token).toBeTruthy()
    expect(store.getters['auth/GET_LOGIN_STATUS']).toBeTruthy()
    store.commit('auth/LOGOUT')
    expect(store.state.auth.token).toBeFalsy()
    expect(store.getters['auth/GET_LOGIN_STATUS']).toBeFalsy()
  })

  test('getter GET_LOGIN_USER_ERROR_STATUS before login', () => {
    expect(store.state.auth.userError).toBeFalsy()
    expect(store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']).toBeFalsy()
  })

  test('getter GET_LOGIN_USER_ERROR_STATUS after "userError" status is true', () => {
    expect(store.state.auth.userError).toBeFalsy()
    expect(store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']).toBeFalsy()
    store.commit('auth/LOGIN_USER_ERROR', true)
    expect(store.state.auth.userError).toBeTruthy()
    expect(store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']).toBeTruthy()
  })

  test('getter GET_LOGIN_USER_ERROR_STATUS after "userError" status is false', () => {
    store.commit('auth/LOGIN_USER_ERROR', true)
    expect(store.state.auth.userError).toBeTruthy()
    expect(store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']).toBeTruthy()
    store.commit('auth/LOGIN_USER_ERROR', false)
    expect(store.state.auth.userError).toBeFalsy()
    expect(store.getters['auth/GET_LOGIN_USER_ERROR_STATUS']).toBeFalsy()
  })

  test('dispatch LOGIN with wrong ID and correct Pass', async () => {
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeFalsy()
    await store.dispatch('auth/LOGIN', {
      userId: 'foo',
      password: 'testPASS'
    })
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeTruthy()
  })

  test('dispatch LOGIN with correct ID and wrong Pass', async () => {
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeFalsy()
    await store.dispatch('auth/LOGIN', {
      userId: 'testID',
      password: 'boo'
    })
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeTruthy()
  })

  test('dispatch LOGIN with wrong ID/Pass', async () => {
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeFalsy()
    await store.dispatch('auth/LOGIN', {
      userId: 'foo',
      password: 'boo'
    })
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeTruthy()
  })

  test('dispatch LOGIN with correct ID/Pass', async () => {
    expect(store.state.auth.token).toBeFalsy()
    expect(store.state.auth.userError).toBeFalsy()
    await store.dispatch('auth/LOGIN', {
      userId: 'testID',
      password: 'testPASS'
    })
    expect(store.state.auth.token).toBeTruthy()
    expect(store.state.auth.userError).toBeFalsy()
  })

  test('dispatch LOGOUT', async () => {
    await store.dispatch('auth/LOGIN', {
      userId: 'testID',
      password: 'testPASS'
    })
    expect(store.state.auth.token).toBeTruthy()
    await store.dispatch('auth/LOGOUT')
    expect(store.state.auth.token).toBeFalsy()
  })

  test('dispatch RESET_LOGIN_USER_ERROR_STATUS', async () => {
    store.commit('auth/LOGIN_USER_ERROR', true)
    expect(store.state.auth.userError).toBeTruthy()
    await store.dispatch('auth/RESET_LOGIN_USER_ERROR_STATUS')
    expect(store.state.auth.userError).toBeFalsy()
  })
})
