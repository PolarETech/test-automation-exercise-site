import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import { createStore } from 'vuex'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import NavBar from '@/components/NavBar.vue'

const head = createHead()

/**
 * Router Spy Configuration
 */

const router = createRouter({
  history: createWebHistory(),
  routes
})

jest.spyOn(router, 'push')

/**
 * Store Mock Configuration
 */

jest.mock('@/store', () => ({
  store: null,
  useStore: jest.fn()
}))

const getLogoutStatus = {
  GET_LOGIN_STATUS: jest.fn(() => false)
}

const getLoginStatus = {
  GET_LOGIN_STATUS: jest.fn(() => true)
}

const actions = {
  LOGOUT: jest.fn()
}

const getStoreMockLogoutStatus = {
  modules: {
    auth: {
      namespaced: true,
      state: {},
      getters: getLogoutStatus,
      actions
    }
  }
}

const getStoreMockLoginStatus = {
  modules: {
    auth: {
      namespaced: true,
      state: {},
      getters: getLoginStatus,
      actions
    }
  }
}

/**
 * Toast Mock Configuration
 */

const mockToast = { add: jest.fn() }

jest.mock('primevue/usetoast', () => ({
  useToast: () => mockToast
}))

describe('NavBar.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof NavBar>>

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('before login', () => {
    beforeEach(async () => {
      router.push('/')
      await router.isReady()

      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreMockLogoutStatus
        })
      )

      wrapper = mount(NavBar, {
        global: {
          plugins: [
            router,
            head,
            PrimeVue,
            ToastService
          ]
        }
      })
    })

    describe('display control', () => {
      test('show "NavBar" vue', () => {
        expect(wrapper.findComponent(NavBar).exists()).toBeTruthy()
        expect(wrapper.vm.toggleMenuExpand).toBeTruthy()
        expect(wrapper.vm.closeMenu).toBeTruthy()
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

        await burger.trigger('click')
        expect(menuArea.classes()).toContain('is-active')
        await burger.trigger('click')
        expect(menuArea.classes()).not.toContain('is-active')

        await burger.trigger('click')
        expect(menuArea.classes()).toContain('is-active')
        await menuItem.trigger('click')
        expect(menuArea.classes()).not.toContain('is-active')
        await menuItem.trigger('click')
        expect(menuArea.classes()).not.toContain('is-active')
      })

      test('close expanded menu when route is changed', async () => {
        const burger = wrapper.find('.navbar-burger')
        const menuArea = wrapper.find('.navbar-menu')
        await wrapper.vm.$router.push({ path: '/about' })

        await burger.trigger('click')
        expect(menuArea.classes()).toContain('is-active')
        await wrapper.vm.$router.push({ path: '/' })
        expect(menuArea.classes()).not.toContain('is-active')
      })
    })

    describe('router control', () => {
      test('Top Logo links to "/" path', async () => {
        await wrapper.find('#top-logo-link').trigger('click')
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
      })

      test('Home menu links to "/" path', async () => {
        await wrapper.find('#nav-home-link').trigger('click')
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
      })

      test('About menu links to "/about" path', async () => {
        await wrapper.find('#nav-about-link').trigger('click')
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/about')
      })

      test('TodoList menu links to "/todo" path', async () => {
        await wrapper.find('#nav-todo-link').trigger('click')
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/todo')
      })

      test('Login menu links to "/login" path', async () => {
        await wrapper.find('#nav-login-link').trigger('click')
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/login')
      })
    })
  })

  describe('after login', () => {
    beforeEach(async () => {
      router.push('/')
      await router.isReady()

      require('@/store').useStore.mockReturnValue(
        createStore({
          ...getStoreMockLoginStatus
        })
      )

      wrapper = mount(NavBar, {
        global: {
          plugins: [
            router,
            head,
            PrimeVue,
            ToastService
          ]
        }
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
      test('call "$router.push" with "/" path and call "$toast.add" when click "logout" menu', async () => {
        await wrapper.find('#nav-logout-link').trigger('click')
        expect(actions.LOGOUT).toBeCalled()
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
        expect(mockToast.add).toBeCalled()
      })
    })
  })
})
