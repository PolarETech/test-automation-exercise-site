import { useMessageStore } from '@/compositions/useMessageStore'
import { createStore } from 'vuex'

/**
 * Store Mock Configuration
 */

const dummyRequireLoginMessage = 'dummy-require-login'
const dummyUserErrorMessage = 'dummy-user-error'
const dummyEmptyMessage = 'dummy-empty'
const dummyRequireInputMessage = 'dummy-require-input'

const getStoreModule = {
  modules: {
    message: {
      namespaced: true,
      state: {
        requireLogin: dummyRequireLoginMessage,
        loginError: dummyUserErrorMessage,
        emptyItem: dummyEmptyMessage,
        requireInputTodo: dummyRequireInputMessage
      }
    }
  }
}

jest.mock('@/store', () => ({
  useStore: () => createStore({
    ...getStoreModule
  })
}))

describe('useTodoStore', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('get messages"', () => {
    const {
      requireLoginMessage,
      loginErrorMessage,
      emptyItemMessage,
      requireInputTodoMessage
    } = useMessageStore()

    expect(requireLoginMessage.value).toBe(dummyRequireLoginMessage)
    expect(loginErrorMessage.value).toBe(dummyUserErrorMessage)
    expect(emptyItemMessage.value).toBe(dummyEmptyMessage)
    expect(requireInputTodoMessage.value).toBe(dummyRequireInputMessage)
  })
})
