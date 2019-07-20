import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Buefy from 'buefy'
import Login from '@/views/Login.vue'
import flushPromises from 'flush-promises'

const correctID = 'testID'
const correctPass = 'testPASS'
const wrongID = 'foo'
const wrongPass = 'boo'
const dummyRequireMessage = 'dummy-require'
const dummyUserErrorMessage = 'dummy-user-error'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Buefy)

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
  })

  describe('directly access login page', () => {
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          ...getModules
        }
      })

      wrapper = shallowMount(Login, {
        mocks: {
          ...getMocks()
        },
        store,
        localVue
      })
    })

    describe('display control', () => {
      test('show "Login" vue', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.vm.login).toBeTruthy()
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
        const submit = wrapper.find('b-button-stub[nativetype="submit"]')
        expect(submit.attributes().disabled).toBeTruthy()
      })

      test('disable "login" button when input only ID', () => {
        const submit = wrapper.find('b-button-stub[nativetype="submit"]')
        wrapper.setData({ userId: wrongID })
        expect(submit.attributes().disabled).toBeTruthy()
      })

      test('disable "login" button when input only Password', () => {
        const submit = wrapper.find('b-button-stub[nativetype="submit"]')
        wrapper.setData({ password: wrongPass })
        expect(submit.attributes().disabled).toBeTruthy()
      })

      test('enable "login" button when input ID and Password', () => {
        const submit = wrapper.find('b-button-stub[nativetype="submit"]')
        wrapper.setData({ userId: wrongID, password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "login" button when clear/input ID', () => {
        const submit = wrapper.find('b-button-stub[nativetype="submit"]')
        wrapper.setData({ userId: wrongID, password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()

        wrapper.setData({ userId: '' })
        expect(submit.attributes().disabled).toBeTruthy()
        wrapper.setData({ userId: wrongID })
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "login" button when clear/input Password', () => {
        const submit = wrapper.find('b-button-stub[nativetype="submit"]')
        wrapper.setData({ userId: wrongID, password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()

        wrapper.setData({ password: '' })
        expect(submit.attributes().disabled).toBeTruthy()
        wrapper.setData({ password: wrongPass })
        expect(submit.attributes().disabled).toBeUndefined()
      })
    })

    describe('binding control', () => {
      test('text input bind "userId" props', () => {
        const id = wrapper.find('b-input-stub[type="text"]')
        wrapper.setData({ userId: wrongID })
        expect(id.attributes().value).toBe(wrongID)
      })

      test('password input bind "password" props', () => {
        const pass = wrapper.find('b-input-stub[type="password"]')
        wrapper.setData({ password: wrongPass })
        expect(pass.attributes().value).toBe(wrongPass)
      })
    })

    describe('login control', () => {
      test('call store action "auth/LOGIN" with correct args when submit', async () => {
        wrapper.setData({ userId: correctID, password: correctPass })
        wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(actions.LOGIN).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            userId: correctID,
            password: correctPass
          }),
          undefined
        )
      })

      test('call "$router.push" with "/todo" path when login succeeded', async () => {
        wrapper.setData({ userId: correctID, password: correctPass })
        wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(actions.LOGIN).toReturnWith(true)
        expect(wrapper.vm.$route.path).toBe('/login')
        expect(wrapper.vm.$router.push).toBeCalledWith('/todo')
      })

      test('should not call "$router.push" when login with wrong ID and Password', async () => {
        wrapper.setData({ userId: wrongID, password: wrongPass })
        wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(actions.LOGIN).toReturnWith(false)
        expect(wrapper.vm.$router.push).not.toBeCalled()
      })
    })
  })

  describe('login with wrong ID/Password', () => {
    beforeEach(() => {
      store = new Vuex.Store({
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

      wrapper = shallowMount(Login, {
        mocks: {
          ...getMocks()
        },
        store,
        localVue
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
      store = new Vuex.Store({
        modules: {
          ...getModules
        }
      })

      wrapper = shallowMount(Login, {
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
        store,
        localVue
      })
    })

    test('show "require log-in" message', () => {
      const el = wrapper.find('#require-message')
      expect(el.exists()).toBeTruthy()
      expect(el.text()).toBe(dummyRequireMessage)
    })

    test('call "$router.push" with "/todo" path when login succeeded', async () => {
      wrapper.setData({ userId: correctID, password: correctPass })
      wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      expect(actions.LOGIN).toReturnWith(true)
      expect(wrapper.vm.$route.path).toBe('/login')
      expect(wrapper.vm.$route.query.redirect).toBe('/todo')
      expect(wrapper.vm.$router.push).toBeCalledWith('/todo')
    })
  })
})
