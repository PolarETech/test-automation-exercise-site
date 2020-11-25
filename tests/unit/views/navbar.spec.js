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
  GET_LOGIN_STATUS: jest.fn(() => true)
}

const getLogoutStatus = {
  GET_LOGIN_STATUS: jest.fn(() => false)
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
  $buefy: {
    toast: {
      open: jest.fn()
    }
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
        expect(wrapper.findComponent(NavBar).exists()).toBeTruthy()
        expect(wrapper.vm.toggleMenuExpand).toBeTruthy()
        expect(wrapper.vm.logout).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('#top-logo-link').exists()).toBeTruthy()
        expect(wrapper.find('#nav-home-link').exists()).toBeTruthy()
        expect(wrapper.find('#nav-about-link').exists()).toBeTruthy()
        expect(wrapper.find('#nav-todo-link').exists()).toBeTruthy()
      })

      test('show "Login" menu', () => {
        expect(getLogoutStatus.GET_LOGIN_STATUS).toBeCalled()
        const el = wrapper.find('#nav-login-link')
        expect(el.exists()).toBeTruthy()
      })

      test('hide "Logout" menu', () => {
        expect(getLogoutStatus.GET_LOGIN_STATUS).toBeCalled()
        const el = wrapper.find('#nav-logout-link')
        expect(el.exists()).toBeFalsy()
      })

      test('toggle menu expand', async () => {
        const burger = wrapper.find('.navbar-burger')
        const menuArea = wrapper.find('.navbar-menu')
        const menuItem = wrapper.find('.navbar-end')
        expect(menuArea.classes()).not.toContain('is-active')

        burger.trigger('click')
        await flushPromises()
        expect(menuArea.classes()).toContain('is-active')
        burger.trigger('click')
        await flushPromises()
        expect(menuArea.classes()).not.toContain('is-active')

        burger.trigger('click')
        await flushPromises()
        expect(menuArea.classes()).toContain('is-active')
        menuItem.trigger('click')
        await flushPromises()
        expect(menuArea.classes()).not.toContain('is-active')
        menuItem.trigger('click')
        await flushPromises()
        expect(menuArea.classes()).not.toContain('is-active')
      })

      test('close expanded menu when route is changed', async () => {
        const burger = wrapper.find('.navbar-burger')
        const menuArea = wrapper.find('.navbar-menu')
        wrapper.vm.$router.push({ path: '/about' })
        await flushPromises()

        burger.trigger('click')
        await flushPromises()
        expect(menuArea.classes()).toContain('is-active')
        wrapper.vm.$router.push({ path: '/' })
        await flushPromises()
        expect(menuArea.classes()).not.toContain('is-active')
      })
    })

    describe('router control', () => {
      test('Top Logo has to="/" props', () => {
        const el = wrapper.find('#top-logo-link')
        expect(el.props().to).toBe('/')
      })

      test('Home menu has to="/" props', () => {
        const el = wrapper.find('#nav-home-link')
        expect(el.props().to).toBe('/')
      })

      test('About menu has to="/about" props', () => {
        const el = wrapper.find('#nav-about-link')
        expect(el.props().to).toBe('/about')
      })

      test('TodoList menu has to="/todo" props', () => {
        const el = wrapper.find('#nav-todo-link')
        expect(el.props().to).toBe('/todo')
      })

      test('Login menu has to="/todo" props', () => {
        const el = wrapper.find('#nav-login-link')
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
        expect(wrapper.findComponent(NavBar).exists()).toBeTruthy()
        expect(wrapper.vm.toggleMenuExpand).toBeTruthy()
        expect(wrapper.vm.logout).toBeTruthy()
      })

      test('hide "Login" menu', () => {
        expect(getLoginStatus.GET_LOGIN_STATUS).toBeCalled()
        const el = wrapper.find('#nav-login-link')
        expect(el.exists()).toBeFalsy()
      })

      test('show "Logout" menu', () => {
        expect(getLoginStatus.GET_LOGIN_STATUS).toBeCalled()
        const el = wrapper.find('#nav-logout-link')
        expect(el.exists()).toBeTruthy()
      })
    })

    describe('logout control', () => {
      test('click "logout" menu', async () => {
        wrapper.find('#nav-logout-link').trigger('click')
        await flushPromises()
        expect(actions.LOGOUT).toBeCalled()
        expect(spyRouter.push).toBeCalledWith('/')
        expect(wrapper.vm.$buefy.toast.open).toBeCalled()
      })
    })
  })
})
