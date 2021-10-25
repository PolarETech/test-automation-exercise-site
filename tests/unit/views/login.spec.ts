import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { ref } from '@vue/runtime-core'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import Login from '@/views/Login.vue'

const head = createHead()

/**
 * Router Mock Configuration
 */

const mockRouter = { push: jest.fn() }

jest.mock('vue-router')

// eslint-disable-next-line @typescript-eslint/no-var-requires
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
 * useAuthStore Mock Configuration
 */

const correctID = 'testID'
const correctPass = 'testPASS'
const wrongID = 'foo'
const wrongPass = 'boo'

const mockLogin = jest.fn(() => false)
const mockResetLoginUserErrorStatus = jest.fn()

// NOTE:
// Rewriting of values may occur during test execution.
// For initialization before each test,
// define the mock data as a function that returns the data.
const getUseAuthStoreMock = () => ({
  userId: ref(''),
  password: ref(''),
  isLoginProcessing: false,
  isLoginUserError: false,
  login: mockLogin,
  resetLoginUserErrorStatus: mockResetLoginUserErrorStatus
})

const getUseAuthStoreMockUserError = () => ({
  userId: ref(''),
  password: ref(''),
  isLoginProcessing: false,
  isLoginUserError: true,
  login: mockLogin,
  resetLoginUserErrorStatus: mockResetLoginUserErrorStatus
})

jest.mock('@/compositions/useAuthStore', () => ({
  useAuthStore: jest.fn()
}))

/**
 * useMessageStore Mock Configuration
 */

const dummyRequireLoginMessage = 'dummy-require-login'
const dummyUserErrorMessage = 'dummy-user-error'

jest.mock('@/compositions/useMessageStore', () => ({
  useMessageStore: jest.fn(() => ({
    requireLoginMessage: dummyRequireLoginMessage,
    loginErrorMessage: dummyUserErrorMessage
  }))
}))

describe('Login.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof Login>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('directly access login page', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('vue-router').useRoute.mockReturnValue({
        ...getRouteMockDirectAccess
      })

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useAuthStore').useAuthStore.mockReturnValue({
        ...getUseAuthStoreMock()
      })

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
        expect(wrapper.vm.doLogin).toBeTruthy()
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
        wrapper.vm.password = ''
        await flushPromises()
        expect(submit.attributes().disabled).toBe('true')
      })

      test('disable "login" button when input only Password', async () => {
        const submit = wrapper.find('#login-submit')
        wrapper.vm.userId = ''
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
      test('user id input bind "userId" property', async () => {
        const id = wrapper.find('#user-id-input')
        wrapper.vm.userId = wrongID
        await flushPromises()
        expect(id.attributes('modelvalue')).toBe(wrongID)
      })

      test('password input bind "password" property', async () => {
        const pass = wrapper.find('#password-input')
        wrapper.vm.password = wrongPass
        await flushPromises()
        expect(pass.attributes('modelvalue')).toBe(wrongPass)
      })
    })

    describe('login control', () => {
      test('call "doLogin" when submit', async () => {
        wrapper.vm.userId = correctID
        wrapper.vm.password = correctPass
        await wrapper.find('form').trigger('submit.prevent')
        expect(mockLogin).toBeCalled()
      })

      test('call "router.push" with "/todo" path when login succeeded', async () => {
        mockLogin.mockImplementationOnce(jest.fn(() => true))
        wrapper.vm.userId = correctID
        wrapper.vm.password = correctPass
        await wrapper.find('form').trigger('submit.prevent')
        expect(mockLogin).toBeCalled()
        expect(mockLogin).toReturnWith(true)
        expect(mockRouter.push).toBeCalledWith('/todo')
        expect(mockResetLoginUserErrorStatus).toBeCalled()
      })

      test('should not call "router.push" when login with wrong ID and Password', async () => {
        mockLogin.mockImplementationOnce(jest.fn(() => false))
        wrapper.vm.userId = wrongID
        wrapper.vm.password = wrongPass
        await wrapper.find('form').trigger('submit.prevent')
        expect(mockLogin).toBeCalled()
        expect(mockLogin).toReturnWith(false)
        expect(mockRouter.push).not.toBeCalled()
      })
    })
  })

  describe('login with wrong ID/Password', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('vue-router').useRoute.mockReturnValue({
        ...getRouteMockDirectAccess
      })

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useAuthStore').useAuthStore.mockReturnValue({
        ...getUseAuthStoreMockUserError()
      })

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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('vue-router').useRoute.mockReturnValue({
        ...getRouteMockRedirectAccess
      })

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useAuthStore').useAuthStore.mockReturnValue({
        ...getUseAuthStoreMock()
      })

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
      expect(el.text()).toBe(dummyRequireLoginMessage)
    })

    test('call "router.push" with "/todo" path when login succeeded', async () => {
      mockLogin.mockImplementationOnce(jest.fn(() => true))
      wrapper.vm.userId = correctID
      wrapper.vm.password = correctPass
      await wrapper.find('form').trigger('submit.prevent')
      expect(mockLogin).toBeCalled()
      expect(mockLogin).toReturnWith(true)
      expect(mockRouter.push).toBeCalledWith('/todo')
    })
  })
})
