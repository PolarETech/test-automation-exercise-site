import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
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

const actions = {
  LOGIN: jest.fn((commit, data) => {
    return !!(data.userId === correctID && data.password === correctPass)
  })
}

const getters = {
  isLoginUserError: jest.fn(() => false)
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
        const el = wrapper.find('#requireMessage')
        expect(el.isVisible()).toBe(false)
      })

      test('hide "log-in user error" message', () => {
        expect(getters.isLoginUserError).toBeCalled()
        const el = wrapper.find('.errorMessage')
        expect(el.isVisible()).toBe(false)
      })

      test('disable "login" button before input ID and Password', () => {
        const submit = wrapper.find('button[type="submit"]')
        expect(submit.attributes().disabled).toBe('disabled')
      })

      test('disable "login" button when input only ID', () => {
        const submit = wrapper.find('button[type="submit"]')
        wrapper.find('input[type="text"]').setValue(wrongID)
        expect(submit.attributes().disabled).toBe('disabled')
      })

      test('disable "login" button when input only Password', () => {
        const submit = wrapper.find('button[type="submit"]')
        wrapper.find('input[type="password"]').setValue(wrongPass)
        expect(submit.attributes().disabled).toBe('disabled')
      })

      test('enable "login" button when input ID and Password', () => {
        const submit = wrapper.find('button[type="submit"]')
        wrapper.find('input[type="text"]').setValue(wrongID)
        wrapper.find('input[type="password"]').setValue(wrongPass)
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "login" button when clear/input ID', () => {
        const submit = wrapper.find('button[type="submit"]')
        wrapper.find('input[type="text"]').setValue(wrongID)
        wrapper.find('input[type="password"]').setValue(wrongPass)
        expect(submit.attributes().disabled).toBeUndefined()

        wrapper.find('input[type="text"]').setValue('')
        expect(submit.attributes().disabled).toBe('disabled')
        wrapper.find('input[type="text"]').setValue(wrongID)
        expect(submit.attributes().disabled).toBeUndefined()
      })

      test('disable/enable "login" button when clear/input Password', () => {
        const submit = wrapper.find('button[type="submit"]')
        wrapper.find('input[type="text"]').setValue(wrongID)
        wrapper.find('input[type="password"]').setValue(wrongPass)
        expect(submit.attributes().disabled).toBeUndefined()

        wrapper.find('input[type="password"]').setValue('')
        expect(submit.attributes().disabled).toBe('disabled')
        wrapper.find('input[type="password"]').setValue(wrongPass)
        expect(submit.attributes().disabled).toBeUndefined()
      })
    })

    describe('login control', () => {
      test('call store action "auth/LOGIN" with correct args when submit', async () => {
        wrapper.find('input[type="text"]').setValue(correctID)
        wrapper.find('input[type="password"]').setValue(correctPass)
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
              isLoginUserError: () => true
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
      const el = wrapper.find('.errorMessage')
      expect(el.isVisible()).toBe(true)
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
      const el = wrapper.find('#requireMessage')
      expect(el.isVisible()).toBe(true)
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
