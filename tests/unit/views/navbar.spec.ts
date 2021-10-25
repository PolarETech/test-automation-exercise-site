import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
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
  routes: [
    { path: '/', component: { template: 'home page' } },
    { path: '/about', component: { template: 'about page' } },
    { path: '/login', component: { template: 'login page' } },
    { path: '/todo', component: { template: 'todo page' } }
  ]
})

jest.spyOn(router, 'push')

/**
 * useAuthStore Mock Configuration
 */

const mockLogout = jest.fn()

jest.mock('@/compositions/useAuthStore', () => ({
  useAuthStore: jest.fn()
}))

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

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useAuthStore').useAuthStore.mockReturnValue({
        isLoggedIn: false
      })

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
        expect(wrapper.vm.doLogout).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('#top-logo-link').exists()).toBeTruthy()
        expect(wrapper.find('#nav-home-link').exists()).toBeTruthy()
        expect(wrapper.find('#nav-about-link').exists()).toBeTruthy()
        expect(wrapper.find('#nav-todo-link').exists()).toBeTruthy()
      })

      test('show "Login" menu', () => {
        const el = wrapper.find('#nav-login-link')
        expect(el.exists()).toBeTruthy()
      })

      test('hide "Logout" menu', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@/compositions/useAuthStore').useAuthStore.mockReturnValue({
        isLoggedIn: true,
        logout: mockLogout
      })

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
        expect(wrapper.vm.doLogout).toBeTruthy()
      })

      test('hide "Login" menu', () => {
        const el = wrapper.find('#nav-login-link')
        expect(el.exists()).toBeFalsy()
      })

      test('show "Logout" menu', () => {
        const el = wrapper.find('#nav-logout-link')
        expect(el.exists()).toBeTruthy()
      })
    })

    describe('logout control', () => {
      test('call "$router.push" with "/" path and call "$toast.add" when click "logout" menu', async () => {
        await wrapper.find('#nav-logout-link').trigger('click')
        expect(mockLogout).toBeCalled()
        expect(wrapper.vm.$router.push).toHaveBeenLastCalledWith('/')
        expect(mockToast.add).toBeCalled()
      })
    })
  })
})
