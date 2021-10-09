import { mount } from '@vue/test-utils'
import { createHead } from '@vueuse/head'
import PrimeVue from 'primevue/config'
import About from '@/views/About.vue'

const head = createHead()

describe('About.vue', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  beforeEach(() => {
    wrapper = mount(About, {
      global: {
        plugins: [
          head,
          PrimeVue
        ]
      }
    })
  })

  describe('display control', () => {
    test('show "About" vue', () => {
      expect(wrapper.findComponent(About).exists()).toBeTruthy()
    })

    test('show elements', () => {
      expect(wrapper.find('.p-tabview-nav').exists()).toBeTruthy()
      expect(wrapper.find('.p-tabview-nav-link').exists()).toBeTruthy()
      expect(wrapper.find('.p-tabview-panels').exists()).toBeTruthy()
      expect(wrapper.find('.content').exists()).toBeTruthy()
    })
  })
})
