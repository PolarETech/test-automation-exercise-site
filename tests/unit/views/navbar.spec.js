import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()
router.push = jest.fn()

const getLoginStatus = {
  isLogin: jest.fn(() => true)
}

const getLogoutStatus = {
  isLogin: jest.fn(() => false)
}

const actions = {
  LOGOUT: jest.fn()
}

const getAuthModules = {
  namespaced: true,
  state: {},
  actions: actions,
  getters: getLogoutStatus
}

const getMocks = () => ({
  $toast: {
    open: jest.fn()
  }
})

describe('NavBar.vue', () => {
  let store
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('before login', () => {
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          auth: {
            ...getAuthModules
          }
        }
      })

      wrapper = shallowMount(NavBar, {
        stubs: {
          RouterLink: RouterLinkStub
        },
        store,
        localVue
      })
    })

    describe('display control', () => {
      test('show "NavBar" vue', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.vm.toggleMenuExpand).toBeTruthy()
        expect(wrapper.vm.logout).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('#home').exists()).toBeTruthy()
        expect(wrapper.find('#todo').exists()).toBeTruthy()
        expect(wrapper.find('#about').exists()).toBeTruthy()
      })

      test('show "Login" menu', () => {
        expect(getLogoutStatus.isLogin).toBeCalled()
        const el = wrapper.find('#login')
        expect(el.exists()).toBeTruthy()
      })

      test('hide "Logout" menu', () => {
        expect(getLogoutStatus.isLogin).toBeCalled()
        const el = wrapper.find('#logout')
        expect(el.exists()).toBeFalsy()
      })
    })

    describe('router control', () => {
      test('call "$router.push" with "/" path when select Home menu', async () => {
        const el = wrapper.find('#home')
        expect(el.props().to).toBe('/')
      })

      test('call "$router.push" with "/about" path when select About menu', async () => {
        const el = wrapper.find('#about')
        expect(el.props().to).toBe('/about')
      })

      test('call "$router.push" with "/todo" path when select TodoList menu', async () => {
        const el = wrapper.find('#todo')
        expect(el.props().to).toBe('/todo')
      })

      test('call "$router.push" with "/login" path when select Login menu', async () => {
        const el = wrapper.find('#login')
        expect(el.props().to).toBe('/login')
      })
    })
  })

  describe('after login', () => {
    beforeEach(() => {
      store = new Vuex.Store({
        modules: {
          auth: {
            ...getAuthModules,
            getters: getLoginStatus
          }
        }
      })

      wrapper = shallowMount(NavBar, {
        mocks: {
          ...getMocks()
        },
        router,
        store,
        localVue
      })
    })

    describe('display control', () => {
      test('show "NavBar" vue', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.vm.toggleMenuExpand).toBeTruthy()
        expect(wrapper.vm.logout).toBeTruthy()
      })

      test('hide "Login" menu', () => {
        expect(getLoginStatus.isLogin).toBeCalled()
        const el = wrapper.find('#login')
        expect(el.exists()).toBeFalsy()
      })

      test('show "Logout" menu', () => {
        expect(getLoginStatus.isLogin).toBeCalled()
        const el = wrapper.find('#logout')
        expect(el.exists()).toBeTruthy()
      })
    })

    describe('logout control', () => {
      test('click "logout" menu', async () => {
        wrapper.find('#logout').trigger('click')
        await flushPromises()
        expect(actions.LOGOUT).toBeCalled()
        expect(router.push).toBeCalledWith('/')
        expect(wrapper.vm.$toast.open).toBeCalled()
      })
    })
  })
})
