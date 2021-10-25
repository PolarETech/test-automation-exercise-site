import { useAuthStore } from '@/compositions/useAuthStore'
import { createStore } from 'vuex'

/**
 * Store Mock Configuration
 */

const correctID = 'testID'
const correctPass = 'testPASS'

const getters = {
  GET_LOGIN_STATUS: jest.fn(() => false),
  GET_LOGIN_USER_ERROR_STATUS: jest.fn(() => false)
}

const actions = {
  LOGIN: jest.fn((commit, data) => {
    return !!(data.userId === correctID && data.password === correctPass)
  }),
  LOGOUT: jest.fn(),
  RESET_LOGIN_USER_ERROR_STATUS: jest.fn()
}

const getStoreModule = {
  modules: {
    auth: {
      namespaced: true,
      state: {},
      getters,
      actions
    }
  }
}

jest.mock('@/store', () => ({
  useStore: () => createStore({
    ...getStoreModule
  })
}))

describe('useAuthStore', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('called store getter "auth/GET_LOGIN_STATUS"', () => {
    const { isLoggedIn } = useAuthStore()
    expect(isLoggedIn.value).toBeFalsy()
    expect(getters.GET_LOGIN_STATUS).toBeCalled()
  })

  test('called store getter "auth/GET_LOGIN_USER_ERROR_STATUS"', () => {
    const { isLoginUserError } = useAuthStore()
    expect(isLoginUserError.value).toBeFalsy()
    expect(getters.GET_LOGIN_USER_ERROR_STATUS).toBeCalled()
  })

  test('called store action "auth/LOGIN" with correct args', async () => {
    const { userId, password, login, isLoginProcessing } = useAuthStore()
    expect(isLoginProcessing.value).toBeFalsy()
    userId.value = correctID
    password.value = correctPass
    await login()
    expect(actions.LOGIN).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: correctID,
        password: correctPass
      })
    )
    // TODO: Lack of testing
    //   Make sure that the 'isLoginProcessing' changes to true once
    //   during the login process
    expect(isLoginProcessing.value).toBeFalsy()
  })

  test('called store action "auth/LOGOUT"', () => {
    const { logout } = useAuthStore()
    logout()
    expect(actions.LOGOUT).toBeCalled()
  })

  test('called store action "auth/RESET_LOGIN_USER_ERROR_STATUS"', () => {
    const { resetLoginUserErrorStatus } = useAuthStore()
    resetLoginUserErrorStatus()
    expect(actions.RESET_LOGIN_USER_ERROR_STATUS).toBeCalled()
  })
})
