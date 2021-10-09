import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: { template: 'about page' } },
    { path: '/todo', component: { template: 'todo page' } }
  ]
})

jest.spyOn(router, 'push')

const head = createHead()

describe('Home.vue', () => {
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
    wrapper.unmount()
  })

  describe('before login', () => {
    beforeEach(async () => {
      router.push('/')
      await router.isReady()

      wrapper = mount(Home, {
        global: {
          plugins: [
            router,
            head
          ]
        }
      })
    })

    describe('display control', () => {
      test('show "Home" vue', () => {
        expect(wrapper.findComponent(Home).exists()).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('#about-button').exists()).toBeTruthy()
        expect(wrapper.find('#todo-button').exists()).toBeTruthy()
      })
    })

    describe('router control', () => {
      test('"#about-button" links to "/about" path', async () => {
        await wrapper.find('#about-button').trigger('click')
        expect(wrapper.vm.$router.push).toBeCalledWith('/about')
      })

      test('"#todo-button" links to "/todo" path', async () => {
        await wrapper.find('#todo-button').trigger('click')
        expect(wrapper.vm.$router.push).toBeCalledWith('/todo')
      })
    })
  })
})
