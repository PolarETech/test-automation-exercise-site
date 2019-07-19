import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter()

const spyRouter = new VueRouter()
spyRouter.push = jest.fn()

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

      test('toggle menu expand', () => {
        const burger = wrapper.find('.navbar-burger')
        const menuArea = wrapper.find('.navbar-menu')
        const menuItem = wrapper.find('.navbar-end')
        expect(menuArea.classes()).not.toContain('is-active')

        burger.trigger('click')
        expect(menuArea.classes()).toContain('is-active')
        burger.trigger('click')
        expect(menuArea.classes()).not.toContain('is-active')

        burger.trigger('click')
        expect(menuArea.classes()).toContain('is-active')
        menuItem.trigger('click')
        expect(menuArea.classes()).not.toContain('is-active')
        menuItem.trigger('click')
        expect(menuArea.classes()).not.toContain('is-active')
      })

      test('close expanded menu when route is changed', () => {
        const burger = wrapper.find('.navbar-burger')
        const menuArea = wrapper.find('.navbar-menu')
        wrapper.vm.$router.push({ path: '/' })

        burger.trigger('click')
        expect(menuArea.classes()).toContain('is-active')
        wrapper.vm.$router.push({ path: '/about' })
        expect(menuArea.classes()).not.toContain('is-active')
      })
    })

    describe('router control', () => {
      test('Home menu has to="/todo" props', () => {
        const el = wrapper.find('#home')
        expect(el.props().to).toBe('/')
      })

      test('About menu has to="/about" props', () => {
        const el = wrapper.find('#about')
        expect(el.props().to).toBe('/about')
      })

      test('TodoList menu has to="/todo" props', () => {
        const el = wrapper.find('#todo')
        expect(el.props().to).toBe('/todo')
      })

      test('Login menu has to="/todo" props', () => {
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
        router: spyRouter,
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
        expect(spyRouter.push).toBeCalledWith('/')
        expect(wrapper.vm.$toast.open).toBeCalled()
      })
    })
  })
})
