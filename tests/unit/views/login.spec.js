import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import Login from '@/views/Login.vue'

const head = createHead()

const correctID = 'testID'
const correctPass = 'testPASS'
const wrongID = 'foo'
const wrongPass = 'boo'
const dummyRequireMessage = 'dummy-require'
const dummyUserErrorMessage = 'dummy-user-error'

const actions = {
  LOGIN: jest.fn((commit, data) => {
    return !!(data.userId === correctID && data.password === correctPass)
  })
}

const getters = {
  GET_LOGIN_USER_ERROR_STATUS: jest.fn(() => false)
}

const getModules = {
  auth: {
    namespaced: true,
    state: {},
    actions,
    getters
  },
  message: {
    namespaced: true,
    state: {
      requireLogin: dummyRequireMessage,
      loginError: dummyUserErrorMessage
    }
  }
}

const getMocks = () => ({
  $route: {
    path: '/login',
    name: 'login',
    query: {
      redirect: undefined,
      message: undefined
    }
  },
  $router: {
    push: jest.fn()
  }
})

describe('Login.vue', () => {
  let store
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('directly access login page', () => {
    beforeEach(() => {
      store = createStore({
        modules: {
          ...getModules
        }
      })

      wrapper = mount(Login, {
        shallow: true,
        global: {
          mocks: {
            ...getMocks()
          },
          plugins: [
            store,
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
        expect(getters.GET_LOGIN_USER_ERROR_STATUS).toBeCalled()
        const el = wrapper.find('.error-message')
        expect(el.exists()).toBeFalsy()
      })

      test('disable "login" button before input ID and Password', () => {
        const submit = wrapper.find('#login-submit')
        expect(submit.attributes().disabled).toBe('true')
      })

      test('disable "login" button when input only ID', async () => {
        const submit = wrapper.find('#login-submit')
        await wrapper.setData({ userId: wrongID })
        expect(submit.attributes().disabled).toBe('true')
      })

      test('disable "login" button when input only Password', async () => {
        const submit = wrapper.find('#login-submit')
        await wrapper.setData({ password: wrongPass })
        expect(submit.attributes().disabled).toBe('true')
      })

      test('enable "login" button when input ID and Password', async () => {
        const submit = wrapper.find('#login-submit')
        await wrapper.setData({ userId: wrongID, password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "login" button when clear/input ID', async () => {
        const submit = wrapper.find('#login-submit')
        await wrapper.setData({ userId: wrongID, password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()

        await wrapper.setData({ userId: '' })
        expect(submit.attributes().disabled).toBe('true')
        await wrapper.setData({ userId: wrongID })
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "login" button when clear/input Password', async () => {
        const submit = wrapper.find('#login-submit')
        await wrapper.setData({ userId: wrongID, password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()

        await wrapper.setData({ password: '' })
        expect(submit.attributes().disabled).toBe('true')
        await wrapper.setData({ password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()
      })
    })

    describe('binding control', () => {
      test('text input bind "userId" props', async () => {
        const id = wrapper.find('#user-id-input')
        await wrapper.setData({ userId: wrongID })
        expect(id.attributes('modelvalue')).toBe(wrongID)
      })

      test('password input bind "password" props', async () => {
        const pass = wrapper.find('#password-input')
        await wrapper.setData({ password: wrongPass })
        expect(pass.attributes('modelvalue')).toBe(wrongPass)
      })
    })

    describe('login control', () => {
      test('call store action "auth/LOGIN" with correct args when submit', async () => {
        await wrapper.setData({ userId: correctID, password: correctPass })
        await wrapper.find('form').trigger('submit.prevent')
        expect(actions.LOGIN).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            userId: correctID,
            password: correctPass
          })
        )
      })

      test('call "$router.push" with "/todo" path when login succeeded', async () => {
        await wrapper.setData({ userId: correctID, password: correctPass })
        await wrapper.find('form').trigger('submit.prevent')
        expect(actions.LOGIN).toReturnWith(true)
        expect(wrapper.vm.$route.path).toBe('/login')
        expect(wrapper.vm.$router.push).toBeCalledWith('/todo')
      })

      test('should not call "$router.push" when login with wrong ID and Password', async () => {
        await wrapper.setData({ userId: wrongID, password: wrongPass })
        await wrapper.find('form').trigger('submit.prevent')
        expect(actions.LOGIN).toReturnWith(false)
        expect(wrapper.vm.$router.push).not.toBeCalled()
      })
    })
  })

  describe('login with wrong ID/Password', () => {
    beforeEach(() => {
      store = createStore({
        modules: {
          ...getModules,
          auth: {
            namespaced: true,
            state: {},
            getters: {
              GET_LOGIN_USER_ERROR_STATUS: () => true
            }
          }
        }
      })

      wrapper = mount(Login, {
        global: {
          mocks: {
            ...getMocks()
          },
          plugins: [
            store,
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
    beforeEach(() => {
      store = createStore({
        modules: {
          ...getModules
        }
      })

      wrapper = mount(Login, {
        global: {
          mocks: {
            ...getMocks(),
            $route: {
              path: '/login',
              name: 'login',
              query: {
                redirect: '/todo',
                message: true
              }
            }
          },
          plugins: [
            store,
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

    test('call "$router.push" with "/todo" path when login succeeded', async () => {
      await wrapper.setData({ userId: correctID, password: correctPass })
      await wrapper.find('form').trigger('submit.prevent')
      expect(actions.LOGIN).toReturnWith(true)
      expect(wrapper.vm.$route.path).toBe('/login')
      expect(wrapper.vm.$route.query.redirect).toBe('/todo')
      expect(wrapper.vm.$router.push).toBeCalledWith('/todo')
    })
  })
})
