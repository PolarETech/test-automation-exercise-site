import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import Login from '@/views/Login.vue'

const head = createHead()

/**
 * Router Mock Configuration
 */

jest.mock('vue-router')

const mockRouter = { push: jest.fn() }

require('vue-router').useRouter.mockReturnValue(
  mockRouter
)

const getRouteMockDirectAccess = {
  path: '/login',
  query: {
    redirect: undefined,
    message: undefined
  }
}

const getRouteMockRedirectAccess = {
  path: '/login',
  query: {
    redirect: '/todo',
    message: 'true'
  }
}

/**
 * Store Mock Configuration
 */

jest.mock('@/store', () => ({
  store: null,
  useStore: jest.fn()
}))

const correctID = 'testID'
const correctPass = 'testPASS'
const wrongID = 'foo'
const wrongPass = 'boo'
const dummyRequireMessage = 'dummy-require'
const dummyUserErrorMessage = 'dummy-user-error'

const getLoginUserSuccessStatus = {
  GET_LOGIN_USER_ERROR_STATUS: jest.fn(() => false)
}

const getLoginUserErrorStatus = {
  GET_LOGIN_USER_ERROR_STATUS: jest.fn(() => true)
}

const actions = {
  LOGIN: jest.fn((commit, data) => {
    return !!(data.userId === correctID && data.password === correctPass)
  }),
  RESET_LOGIN_USER_ERROR_STATUS: jest.fn()
}

const getStoreModuleLoginSuccess = {
  modules: {
    auth: {
      namespaced: true,
      state: {},
      getters: getLoginUserSuccessStatus,
      actions
    },
    message: {
      namespaced: true,
      state: {
        requireLogin: dummyRequireMessage,
        loginError: dummyUserErrorMessage
      }
    }
  }
}

const getStoreModuleLoginError = {
  modules: {
    auth: {
      namespaced: true,
      state: {},
      getters: getLoginUserErrorStatus,
      actions
    },
    message: {
      namespaced: true,
      state: {
        requireLogin: dummyRequireMessage,
        loginError: dummyUserErrorMessage
      }
    }
  }
}

describe('Login.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof Login>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('directly access login page', () => {
    beforeEach(() => {
      require('vue-router').useRoute.mockReturnValue({
        ...getRouteMockDirectAccess
      })

      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleLoginSuccess
        })
      )

      wrapper = mount(Login, {
        shallow: true,
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    describe('display control', () => {
      test('show "Login" vue', () => {
        expect(wrapper.findComponent(Login).exists()).toBeTruthy()
        expect(wrapper.vm.login).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('#user-id-input').exists()).toBeTruthy()
        expect(wrapper.find('#password-input').exists()).toBeTruthy()
        expect(wrapper.find('#login-submit').exists()).toBeTruthy()
      })

      test('hide "require log-in" message', () => {
        const el = wrapper.find('#require-message')
        expect(el.exists()).toBeFalsy()
      })

      test('hide "log-in user error" message', () => {
        expect(getLoginUserSuccessStatus.GET_LOGIN_USER_ERROR_STATUS).toBeCalled()
        const el = wrapper.find('.error-message')
        expect(el.exists()).toBeFalsy()
      })

      test('disable "login" button before input ID and Password', () => {
        const submit = wrapper.find('#login-submit')
        expect(submit.attributes().disabled).toBe('true')
      })

      test('disable "login" button when input only ID', async () => {
        const submit = wrapper.find('#login-submit')
        wrapper.vm.userId = wrongID
        await flushPromises()
        expect(submit.attributes().disabled).toBe('true')
      })

      test('disable "login" button when input only Password', async () => {
        const submit = wrapper.find('#login-submit')
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(submit.attributes().disabled).toBe('true')
      })

      test('enable "login" button when input ID and Password', async () => {
        const submit = wrapper.find('#login-submit')
        wrapper.vm.userId = wrongID
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(submit.attributes().disabled).toBe('false')
      })

      test('disable/enable "login" button when clear/input ID', async () => {
        const submit = wrapper.find('#login-submit')
        wrapper.vm.userId = wrongID
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(submit.attributes().disabled).toBe('false')

        wrapper.vm.userId = ''
        await flushPromises()
        expect(submit.attributes().disabled).toBe('true')
        wrapper.vm.userId = wrongID
        await flushPromises()
        expect(submit.attributes().disabled).toBe('false')
      })

      test('disable/enable "login" button when clear/input Password', async () => {
        const submit = wrapper.find('#login-submit')
        wrapper.vm.userId = wrongID
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(submit.attributes().disabled).toBe('false')

        wrapper.vm.password = ''
        await flushPromises()
        expect(submit.attributes().disabled).toBe('true')
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(submit.attributes().disabled).toBe('false')
      })
    })

    describe('binding control', () => {
      test('text input bind "userId" props', async () => {
        const id = wrapper.find('#user-id-input')
        wrapper.vm.userId = wrongID
        await flushPromises()
        expect(id.attributes('modelvalue')).toBe(wrongID)
      })

      test('password input bind "password" props', async () => {
        const pass = wrapper.find('#password-input')
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(pass.attributes('modelvalue')).toBe(wrongPass)
      })
    })

    describe('login control', () => {
      test('call store action "auth/LOGIN" with correct args when submit', async () => {
        wrapper.vm.userId = correctID
        wrapper.vm.password = correctPass
        await wrapper.find('form').trigger('submit.prevent')
        expect(actions.LOGIN).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            userId: correctID,
            password: correctPass
          })
        )
      })

      test('call "router.push" with "/todo" path when login succeeded', async () => {
        wrapper.vm.userId = correctID
        wrapper.vm.password = correctPass
        await wrapper.find('form').trigger('submit.prevent')
        expect(actions.LOGIN).toReturnWith(true)
        expect(mockRouter.push).toBeCalledWith('/todo')
        expect(actions.RESET_LOGIN_USER_ERROR_STATUS).toBeCalled()
      })

      test('should not call "router.push" when login with wrong ID and Password', async () => {
        wrapper.vm.userId = wrongID
        wrapper.vm.password = wrongPass
        await wrapper.find('form').trigger('submit.prevent')
        expect(actions.LOGIN).toReturnWith(false)
        expect(mockRouter.push).not.toBeCalled()
      })
    })
  })

  describe('login with wrong ID/Password', () => {
    beforeEach(() => {
      require('vue-router').useRoute.mockReturnValue({
        ...getRouteMockDirectAccess
      })


      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleLoginError
        })
      )

      wrapper = mount(Login, {
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    test('show "log-in user error" message', () => {
      const el = wrapper.find('.error-message')
      expect(el.exists()).toBeTruthy()
      expect(el.text()).toBe(dummyUserErrorMessage)
    })
  })

  describe('redirect to login page when access todo page without login', () => {
    beforeEach(async () => {
      require('vue-router').useRoute.mockReturnValue({
        ...getRouteMockRedirectAccess
      })

      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreModuleLoginSuccess
        })
      )

      wrapper = mount(Login, {
        global: {
          plugins: [
            head,
            PrimeVue
          ]
        }
      })
    })

    test('show "require log-in" message', () => {
      const el = wrapper.find('#require-message')
      expect(el.exists()).toBeTruthy()
      expect(el.text()).toBe(dummyRequireMessage)
    })

    test('call "router.push" with "/todo" path when login succeeded', async () => {
      wrapper.vm.userId = correctID
      wrapper.vm.password = correctPass
      await wrapper.find('form').trigger('submit.prevent')
      expect(actions.LOGIN).toReturnWith(true)
      expect(mockRouter.push).toBeCalledWith('/todo')
    })
  })
})
