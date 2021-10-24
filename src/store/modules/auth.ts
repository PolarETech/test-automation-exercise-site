import {
  LOGIN,
  LOGOUT,
  LOGIN_USER_ERROR,
  RESET_LOGIN_USER_ERROR_STATUS,
  GET_LOGIN_STATUS,
  GET_LOGIN_USER_ERROR_STATUS
} from '@/store/mutation-types'

import { AuthState, Context } from '@/types/store'

export default {
  namespaced: true,
  state: {
    token: '',
    userError: false
  } as AuthState,
  mutations: {
    [LOGIN]: (state: AuthState, payload: string): void => {
      state.token = payload
    },
    [LOGOUT]: (state: AuthState): void => {
      state.token = ''
    },
    [LOGIN_USER_ERROR]: (state: AuthState, payload: boolean): void => {
      state.userError = payload
    }
  },
  getters: {
    [GET_LOGIN_STATUS]: (state: AuthState): boolean => !!state.token,
    [GET_LOGIN_USER_ERROR_STATUS]: (state: AuthState): boolean => state.userError
  },
  actions: {
    [LOGIN]: async ({ commit }: Context, data: { userId: string, password: string }): Promise<boolean> => {
      commit(LOGIN_USER_ERROR, false)

      // dummy authentication and random waiting time
      /* istanbul ignore next */
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(() => true)
        }, (Math.floor(Math.random() * 2001)) + 300)
      })
      const validation = !!(data.userId === 'testID' && data.password === 'testPASS')
      const token: string = !validation ? '' : 'dummy-token'

      commit(LOGIN_USER_ERROR, !validation)
      commit(LOGIN, token)
      return validation
    },
    [LOGOUT]: ({ commit }: Context): void => {
      commit(LOGOUT)
    },
    [RESET_LOGIN_USER_ERROR_STATUS]: ({ commit }: Context): void => {
      commit(LOGIN_USER_ERROR, false)
    }
  }
}
