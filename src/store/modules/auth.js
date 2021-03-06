import {
  LOGIN,
  LOGOUT,
  LOGIN_USER_ERROR,
  GET_LOGIN_STATUS,
  GET_LOGIN_USER_ERROR_STATUS
} from '@/store/mutation-types'

export default {
  namespaced: true,
  state: {
    token: '',
    userError: false
  },
  mutations: {
    [LOGIN]: (state, payload) => {
      state.token = payload
    },
    [LOGOUT]: (state) => {
      state.token = ''
    },
    [LOGIN_USER_ERROR]: (state, payload) => {
      state.userError = payload
    }
  },
  getters: {
    [GET_LOGIN_STATUS]: (state) => !!state.token,
    [GET_LOGIN_USER_ERROR_STATUS]: (state) => state.userError
  },
  actions: {
    [LOGIN]: async ({ commit }, data) => {
      commit(LOGIN_USER_ERROR, false)

      // dummy authentication and random waiting time
      // istanbul ignore next
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(() => true)
        }, (Math.floor(Math.random() * 2001)) + 300)
      })
      const validation = !!(data.userId === 'testID' && data.password === 'testPASS')
      const token = !validation ? '' : 'dummy-token'

      commit(LOGIN_USER_ERROR, !validation)
      commit(LOGIN, token)
      return validation
    },
    [LOGOUT]: ({ commit }) => {
      commit(LOGOUT)
    }
  }
}
