import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Home.vue', () => {
  let wrapper

  describe('before login', () => {
    beforeEach(() => {
      wrapper = shallowMount(Home, {
        stubs: {
          RouterLink: RouterLinkStub
        },
        localVue
      })
    })

    describe('display control', () => {
      test('show "Home" vue', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
      })

      test('show elements', () => {
        expect(wrapper.find('#todo-button').exists()).toBeTruthy()
        expect(wrapper.find('#about-button').exists()).toBeTruthy()
      })
    })

    describe('router control', () => {
      test('"#todo-button" has to="/todo" props', () => {
        const el = wrapper.find('#todo-button')
        expect(el.props().to).toBe('/todo')
      })

      test('"#about-button" has to="/about" props', () => {
        const el = wrapper.find('#about-button')
        expect(el.props().to).toBe('/about')
      })
    })
  })
})
